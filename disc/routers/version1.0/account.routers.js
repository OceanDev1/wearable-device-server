"use strict";

const express = require("express");
const { asyncHandler } = require("./../../core/handle.middleware");
const permissionCore = require("./../../core/permission");
const accountControllers = require("../../controllers/account.controller");
const router = express.Router();

router.get(
  "/by-token",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(accountControllers.getAccountByToken)
);

router.get(
  "/get-dashboard",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(accountControllers.getAllDataDashboard)
);

module.exports = router;
