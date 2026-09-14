"use strict";

const express = require("express");
const { asyncHandler } = require("./../../core/handle.middleware");
const permissionCore = require("./../../core/permission");
const deviceControllers = require("./../../controllers/device.controllers");
const router = express.Router();

router.get(
  "/get-all",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.getAllDevices)
);

router.get(
  "/by-account",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.getDeviceByAccount)
);

router.get(
  "/get-data-alarm",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.getDataAlarmDevice)
);

router.get(
  "/restart-device",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.restartDevice)
);

router.get(
  "/full-detail",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.getFullDetailDevice)
);

router.post(
  "/setting-account-alarm",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.settingAccountForAlarm)
);

router.put(
  "/remove-account-alarm",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.removeAccountInAlarm)
);

router.put(
  "/remove-in-account",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.removeDeviceInAccount)
);

router.put(
  "/set-account",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(deviceControllers.setDeviceForPatient)
);

module.exports = router;
