const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const sanitize = require("sanitize-filename");
const {getStorageRoot} = require("../helpers");

const storageRoot = getStorageRoot();

router.post('/save', (req, res) => {
    const projectId = sanitize(req.body.projectId);
    const files = req.body.files;
    if (!projectId || !files || !files.length) {
        res.sendStatus(400);
        return;
    }

    const projectPath = path.resolve(storageRoot, projectId);
    const projectExists = fs.existsSync(projectPath);
    if (!projectExists) {
        fs.mkdirSync(projectPath);
    }

    files.forEach(file => {
        const fileName = sanitize(file.name);
        const fileContent = file.content;

        if (!fileName || !fileContent) {
            return;
        }

        fs.writeFileSync(
            path.resolve(projectPath, fileName),
            fileContent,
        );
    });

    res.sendStatus(200);
});

router.post('/delete-file', (req, res) => {
    const projectId = sanitize(req.body.projectId);
    const fileName = sanitize(req.body.fileName);

    if (!projectId || !fileName) {
        res.sendStatus(400);
        return;
    }

    const filePath = path.resolve(storageRoot, projectId, fileName);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
        res.sendStatus(404);
        return;
    }

    fs.unlinkSync(filePath);
    res.sendStatus(200);
});

router.post('/clone', (req, res) => {
    const projectId = sanitize(req.body.projectId);
    const sourceProjectId = sanitize(req.body.sourceProjectId);

    if (!projectId || !sourceProjectId) {
        res.sendStatus(400);
        return;
    }

    const sourceProjectPath = path.resolve(storageRoot, sourceProjectId);
    const pathExists = fs.existsSync(sourceProjectPath);
    if (!pathExists) {
        res.sendStatus(404);
        return;
    }

    const projectPath = path.resolve(storageRoot, projectId);
    fs.mkdirSync(projectPath);
    fs.copySync(sourceProjectPath, projectPath);

    res.sendStatus(200);
});

module.exports = router;
