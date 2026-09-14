"use strict";

const patientServices = require("../services/patient.services");
const { OkRequestSuccess } = require("./../core/success.response");

class PatientControllers {
  createNewPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await patientServices.createNewDocument(req.body),
    }).send(res);
  };

  loginAccountDoctor = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await patientServices.loginDoctorDocument(req.body),
    }).send(res);
  };

  loginAccountPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await patientServices.loginPatientDocument(req.body),
    }).send(res);
  };

  getAllDoctors = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await patientServices.getAllDoctorDocuments(),
    }).send(res);
  };

  getHistoryAlarm = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await patientServices.getHistoryAlarmDocument(req.query.accountId),
    }).send(res);
  };

  getAllPatients = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await patientServices.getAllPatientDocuments(),
    }).send(res);
  };

  getDetailPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await patientServices.getDetailPatientDocuments(req.query),
    }).send(res);
  };

  updateExaminationPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await patientServices.updateExaminationPatientDocument(
        req.body
      ),
    }).send(res);
  };
}

module.exports = new PatientControllers();
