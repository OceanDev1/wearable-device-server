"use strict";

const express = require("express");
const { asyncHandler } = require("./../../core/handle.middleware");
const permissionCore = require("./../../core/permission");
const patientControllers = require("../../controllers/patient.controllers");
const router = express.Router();

router.get(
  "/get-all-patients",
  asyncHandler(patientControllers.getAllPatients)
);
router.get("/get-all-doctors", asyncHandler(patientControllers.getAllDoctors));
router.get(
  "/detail-patient",
  asyncHandler(patientControllers.getDetailPatient)
);
router.get(
  "/get-history-alarms",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(patientControllers.getHistoryAlarm)
);

router.post("/", asyncHandler(patientControllers.createNewPatient));
router.post("/login-dt", asyncHandler(patientControllers.loginAccountDoctor));
router.post("/login-pt", asyncHandler(patientControllers.loginAccountPatient));

router.put(
  "/update-data-health",
  asyncHandler(patientControllers.updateExaminationPatient)
);

module.exports = router;
