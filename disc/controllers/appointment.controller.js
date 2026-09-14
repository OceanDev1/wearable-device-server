"use strict";

const { OkRequestSuccess } = require("./../core/success.response");
const appointmentServices = require("../services/appointment.service");

class AppointmentController {
  createNewAppointment = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await appointmentServices.insertNewDocument(
        req.body,
        req.account._id
      ),
    }).send(res);
  };

  getAllAppointmentByPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await appointmentServices.getAllDocumentByPatient(
        req.account._id
      ),
    }).send(res);
  };

  cancelAppointment = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await appointmentServices.cancelDocument(req.query.appointmentId),
    }).send(res);
  };

  checkSlotAppointment = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await appointmentServices.checkSlotInDocument(req.body),
    }).send(res);
  };

  getByDoctorAndRangeWeek = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await appointmentServices.getDocumentByDoctorAndRangeWeek(
        req.account._id,
        req.body
      ),
    }).send(res);
  };

  updateStatusAppointment = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await appointmentServices.updateStatusDocument(req.body),
    }).send(res);
  };
}

module.exports = new AppointmentController();
