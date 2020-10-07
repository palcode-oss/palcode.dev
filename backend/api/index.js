const express = require("express");
const router = express.Router();
const apiGet = require("./get");
const apiSave = require("./save");
const apiCode = require("./code");
const apiAuth = require("./auth");

router.use(apiGet);
router.use(apiSave);
router.use(apiCode);
router.use('/auth', apiAuth);

module.exports = router;
