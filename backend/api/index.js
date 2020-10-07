const express = require("express");
const router = express.Router();
const apiGet = require("./get");
const apiSave = require("./save");
const apiCode = require("./code");

router.use(apiGet);
router.use(apiSave);
router.use(apiCode);

module.exports = router;
