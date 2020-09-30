const express = require("express");
const app = express();
const api = require("./api/index");
const path = require("path");
const fs = require("fs");

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

app.listen(8080, () => {
    console.log("Ready on port 8080!");
});