"use strict";

const express = require("express");
const { asyncHandler } = require("./../../core/handle.middleware");
const permissionCore = require("./../../core/permission");
const router = express.Router();
const readingController = require("./../../controllers/reading.controllers");

router.get(
  "/get-first",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(readingController.getDataFirst)
);

module.exports = router;
