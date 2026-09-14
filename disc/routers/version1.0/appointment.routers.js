"use strict";

const express = require("express");
const { asyncHandler } = require("./../../core/handle.middleware");
const permissionCore = require("./../../core/permission");
const appointmentController = require("./../../controllers/appointment.controller");
const router = express.Router();

router.get(
  "/get-all-by-patient",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(appointmentController.getAllAppointmentByPatient)
);

router.post(
  "/insert",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(appointmentController.createNewAppointment)
);

router.post(
  "/check-slot",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(appointmentController.checkSlotAppointment)
);

router.post(
  "/get-by-doctor-and-range-week",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(appointmentController.getByDoctorAndRangeWeek)
);

router.put(
  "/update-status",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(appointmentController.updateStatusAppointment)
);

router.delete(
  "/cancel",
  asyncHandler(permissionCore.checkAuthentication),
  asyncHandler(appointmentController.cancelAppointment)
);

module.exports = router;
