const express = require("express");
const router = express.Router();
const apiGet = require("./get");
const apiSave = require("./save");

router.use(apiGet);
router.use(apiSave);

module.exports = router;
