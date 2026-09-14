"use strict";
const express = require("express");
const router = express.Router();

// router.use("/account", require("./account.router"));
// router.use("/device", require("./device.router"));

// UPDATE
router.use("/patients", require("./patient.routers"));
router.use("/devices", require("./device.routers"));
router.use("/account", require("./account.routers"));
router.use("/readings", require("./reading.routers"));
router.use("/appointment", require("./appointment.routers"));

module.exports = router;
