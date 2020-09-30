const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const storageRoot = process.env.PAL_STORAGE_ROOT;

router.get('/get-file-list', (req, res) => {
    const projectId = req.query.projectId;
    if (!projectId) {
        res.sendStatus(400);
        return;
    }

    let fileList = [];
    try {
        fileList = fs.readdirSync(path.resolve(storageRoot + '/' + projectId));
    } catch (e) {
        res.sendStatus(500);
        return;
    }

    res.json(fileList);
});

router.get('/get-file', (req, res) => {
    const projectId = req.query.projectId;
    const fileName = req.query.fileName;

    if (!projectId || !fileName) {
        res.sendStatus(400);
        return;
    }

    let fileContents = '';
    try {
        fileContents = fs.readFileSync(
            path.resolve(storageRoot + '/' + projectId + '/' + fileName),
            "utf-8"
        );
    } catch (e) {
        res.sendStatus(500);
        return;
    }

    res.set('Content-Type', 'text/plain');
    res.send(fileContents);
});

module.exports = router;
