const express = require("express");
const router = express.Router();

const { getPythonTag, getStorageRoot } = require("../helpers");

const Docker = require("dockerode");
const docker = Docker();

/*router.get('/pyflakes', (req, res) => {
    // TODO: implement linting
    const projectId = req.query.projectId;
    const fileName = req.query.fileName;

    if (!projectId || !fileName) {
        res.sendStatus(400);
        return;
    }

    const projectPath = path.resolve(getStorageRoot() + '/' + projectId);

    docker.createContainer({
        Image: 'python:' + getPythonTag(),
        WorkingDir: '/usr/src/app',
        Binds: [
            '/var/run/docker.sock:/var/run/docker.sock',
             + ':/usr/src/app',
        ],
    });
});*/

module.exports = router;
