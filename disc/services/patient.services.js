"use strict";

const supportUtils = require("../utils/support.utils");
const Patient = require("./../models/patients.model");
const Mailer = require("./../models/mailer.model");
const { BadRequestError } = require("./../core/error.response");
const VariableConfigs = require("./../configs/variable.configs");
const bcryptUtils = require("../utils/bcrypt.utils");
const jwtUtils = require("../utils/jwt.utils");

class PatientServices {
  createModel = async (data) => {
    let render_number = supportUtils.randomPatientNumber(data.pt_role);
    let render_password = "123456";

    let hash_password = await bcryptUtils.hashPassword(render_password);

    const newPatient = new Patient({
      pt_number: render_number,
      pt_name: data.pt_name,
      pt_password: hash_password,
      pt_gender: data.pt_gender,
      pt_phone: data.pt_phone,
      pt_address: data.pt_address,
      pt_role: data.pt_role,
      pt_birth: data.pt_birth,
      pt_devices: [],
      pt_examinations: [],
    });

    return newPatient;
  };

  createNewDocument = async (data) => {
    const checkExistPatient = await this.getOneDocumentByPhone(data.pt_phone);

    if (!!checkExistPatient)
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.ACCOUNT_EXIST);

    const newPatientDocument = await this.createModel(data);

    newPatientDocument.save();

    return newPatientDocument;
  };

  loginPatientDocument = async (data) => {
    const { phone_number, password } = data;

    const accountDocument = await this.getOneDocumentByPhone(phone_number);

    if (!accountDocument)
      throw new BadRequestError(
        VariableConfigs.ERROR_MESSAGE.ACCOUNT_NOT_FOUND
      );

    if (accountDocument.pt_role != "patient")
      throw new BadRequestError(
        VariableConfigs.ERROR_MESSAGE.ACCOUNT_NOT_PATIENT
      );

    let password_account = accountDocument.pt_password;
    let check_password = await bcryptUtils.checkPassword(
      password,
      password_account
    );

    if (!check_password)
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.WRONG_PASSWORD);

    let form_json = {
      accountId: accountDocument._id,
    };

    let token = await jwtUtils.generateToken(form_json);

    return token;
  };

  loginDoctorDocument = async (data) => {
    const { phone_number, password } = data;

    const accountDocument = await this.getOneDocumentByPhone(phone_number);

    if (!accountDocument)
      throw new BadRequestError(
        VariableConfigs.ERROR_MESSAGE.ACCOUNT_NOT_FOUND
      );

    if (accountDocument["pt_role"] != "doctor")
      throw new BadRequestError(
        VariableConfigs.ERROR_MESSAGE.ACCOUNT_NOT_DOCTOR
      );

    let password_account = accountDocument.pt_password;
    let check_password = await bcryptUtils.checkPassword(
      password,
      password_account
    );

    if (!check_password)
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.WRONG_PASSWORD);

    let form_json = {
      accountId: accountDocument._id,
    };

    let token = await jwtUtils.generateToken(form_json);

    return token;
  };

  getOneDocumentByPhone = async (phone) => {
    const patientDocument = await Patient.findOne({ pt_phone: phone }).lean();

    return patientDocument;
  };

  getAllPatientDocuments = async () => {
    const patientDocuments = await Patient.find({ pt_role: "patient" }).lean();

    return patientDocuments;
  };

  getAllDoctorDocuments = async () => {
    const doctorDocuments = await Patient.find({ pt_role: "doctor" }).lean();

    return doctorDocuments;
  };

  getHistoryAlarmDocument = async (accountId) => {
    const alarmDocuments = await Mailer.find({
      ml_patient: accountId,
    })
      .sort({ ml_timestamp: -1 })
      .limit(10)
      .lean();

    return alarmDocuments;
  };

  getDetailPatientDocuments = async (data) => {
    const { accountId } = data;

    const patientDocument = await Patient.findById(accountId).lean();

    if (!!patientDocument) return patientDocument;
  };

  updateExaminationPatientDocument = async (data) => {
    const { heath_data, accountId } = data;

    await Patient.findByIdAndUpdate(accountId, {
      $push: { pt_examinations: heath_data },
    });

    return heath_data;
  };
}

module.exports = new PatientServices();
