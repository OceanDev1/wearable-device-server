"use strict";
const express = require("express");
const router = express.Router();

router.use("/v1", require("./version1.0"));

module.exports = router;
