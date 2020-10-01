const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const storageRoot = process.env.PAL_STORAGE_ROOT;

router.post('/save', (req, res) => {
    const projectId = req.body.projectId;
    const files = req.body.files;
    if (!projectId || !files || !files.length) {
        res.sendStatus(400);
        return;
    }

    const projectPath = path.resolve(storageRoot + '/' + projectId);
    const projectExists = fs.existsSync(projectPath);
    if (!projectExists) {
        fs.mkdirSync(projectPath);

        const containsIndexPy = files.some(file => file.name === "index.py");
        if (!containsIndexPy) {
            res.sendStatus(400);
            return;
        }
    }

    files.forEach(file => {
        const fileName = file.name;
        const fileContent = file.content;

        if (!fileName || !fileContent) {
            return;
        }

        fs.writeFileSync(
            path.resolve(projectPath + '/' + fileName),
            fileContent,
        );
    });

    res.sendStatus(200);
});

router.post('/delete-file', (req, res) => {
    const projectId = req.body.projectId;
    const fileName = req.body.fileName;

    if (!projectId || !fileName) {
        res.sendStatus(400);
        return;
    }

    const filePath = path.resolve(storageRoot + '/' + projectId + '/' + fileName);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
        res.sendStatus(404);
        return;
    }

    fs.unlinkSync(filePath);
    res.sendStatus(200);
});

module.exports = router;
