const express = require("express");
const app = express();
const api = require("./api/index");
const socket = require("./socket/run");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}

app.use("/api", api);

app.get('/*', (req, res) => {
    if (req.path.startsWith('/static/')) {
        res.sendFile(path.resolve('build/' + req.path));
        return;
    }

    const files = fs.readdirSync(path.resolve('build'));
    const isFile = files.some(file => {
        return req.path.startsWith('/' + file);
    });

    if (isFile) {
        res.sendFile(path.resolve('build' + req.path));
        return;
    }

    res.sendFile(path.resolve('build/index.html'));
});

const server = require("http").createServer(app);
const io = require("socket.io")(server);
socket(io);

server.listen(process.env.PAL_PORT, () => {
    console.log("Ready on port " + process.env.PAL_PORT);
});
