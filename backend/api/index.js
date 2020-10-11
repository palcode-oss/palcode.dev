const express = require("express");
const router = express.Router();
const apiGet = require("./get");
const apiSave = require("./save");
const apiCode = require("./code");
const apiClone = require("./clone");

router.use(apiGet);
router.use(apiSave);
router.use(apiCode);
router.use(apiClone);

module.exports = router;
