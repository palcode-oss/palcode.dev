const express = require("express");
const router = express.Router();
const apiGet = require("./get");

router.use(apiGet);

module.exports = router;
