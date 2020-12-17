const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");
const { getLanguageDefaultFile, isValidLanguage } = require("../helpers");

const storageRoot = process.env.PAL_STORAGE_ROOT;
const ignoredPaths = [
    '__pycache__',
    'README.md',
    'env',
    'requirements.old.txt',
    'node_modules',
    'yarn.lock',
];

router.get('/get-file-list', (req, res) => {
    const projectId = sanitize(req.query.projectId);
    const language = req.query.language;
    if (!projectId || !language || !isValidLanguage(language)) {
        res.sendStatus(400);
        return;
    }

    const defaultFile = getLanguageDefaultFile(language);

    let fileList = [];
    try {
        fileList = fs.readdirSync(
            path.resolve(storageRoot, projectId)
        );
    } catch (e) {
        res.json([defaultFile]);
        return;
    }

    const filteredFiles = fileList.filter(file => {
        return !ignoredPaths.includes(file) && !file.startsWith('.');
    });

    if (!filteredFiles.includes(defaultFile)) {
        filteredFiles.push(defaultFile);
    }

    filteredFiles.sort((a, b) => {
        if (a === defaultFile) {
            return -1;
        } else if (b === defaultFile) {
            return 1;
        }

        try {
            if (a.endsWith('.txt') || !a.includes('.')) {
                return 1;
            }
        } catch (e) {}

        return 0;
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
