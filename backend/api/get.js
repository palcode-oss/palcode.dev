const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");

const storageRoot = process.env.PAL_STORAGE_ROOT;
const ignoredPaths = [
    '__pycache__',
    'README.md',
    'env',
    'requirements.old.txt',
];

router.get('/get-file-list', (req, res) => {
    const projectId = sanitize(req.query.projectId);
    if (!projectId) {
        res.sendStatus(400);
        return;
    }

    let fileList = [];
    try {
        fileList = fs.readdirSync(
            path.resolve(storageRoot, projectId)
        );
    } catch (e) {
        res.sendStatus(404);
        return;
    }

    const filteredFiles = fileList.filter(file => {
        return !ignoredPaths.includes(file) && !file.startsWith('.');
    });

    res.json(filteredFiles);
});

router.get('/get-file', (req, res) => {
    const projectId = sanitize(req.query.projectId);
    const fileName = sanitize(req.query.fileName);

    if (!projectId || !fileName) {
        res.sendStatus(400);
        return;
    }

    let fileContents = '';
    try {
        fileContents = fs.readFileSync(
            path.resolve(storageRoot, projectId, fileName),
            "utf-8"
        );
    } catch (e) {
        res.sendStatus(404);
        return;
    }

    res.set('Content-Type', 'text/plain');
    res.send(fileContents);
});

module.exports = router;
