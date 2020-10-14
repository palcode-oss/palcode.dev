const express = require("express");
const router = express.Router();
const apiGet = require("./get");
const apiSave = require("./save");
const apiClone = require("./clone");

router.use(apiGet);
router.use(apiSave);
router.use(apiClone);

module.exports = router;
