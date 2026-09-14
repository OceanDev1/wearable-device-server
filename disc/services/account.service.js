"use strict";

const AccountModel = require("./../models/patients.model");
const AppointmentModel = require("./../models/appointment");
const SupportUtils = require("./../utils/support.utils");
const VariableConfigs = require("./../configs/variable.configs");
const BcryptUtils = require("./../utils/bcrypt.utils");
const JwtUtils = require("./../utils/jwt.utils");
const { BadRequestError } = require("./../core/error.response");
const bcryptUtils = require("./../utils/bcrypt.utils");
const config = require("./../configs/variable.configs");
const PatientServices = require("./../services/patient.services");
const DeviceServices = require("./../services/device.services");
// const AppointmentServices = require("./../services/appointment.service");

class AccountServices {
  createNewModelDocument(data) {
    const newAccount = new AccountModel({
      act_number: data.identifier_code,
      act_email: data.email,
      act_password: data.password,
      act_code: data.code,
      act_name: data.name,
      act_sex: data.sex,
      act_phone_number: data.phone_number,
      act_role: data.role,
      act_status: data.status,
      act_doctor: data.doctor,
      act_day_of_birth: data.birth,
    });

    return newAccount;
  }

  createNewDocument = async (data) => {
    const accountDocument = await AccountModel.findOne({
      act_phone_number: data.phone_number,
    }).lean();

    if (!!accountDocument)
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.ACCOUNT_EXIST);

    let map_prefix_code = VariableConfigs.MAP_PREFIX_ROLE;

    let identifier_code = SupportUtils.generateIdentifierCode(
      map_prefix_code[data.role],
      12
    );
    let code_active = Number.parseInt(
      SupportUtils.generateIdentifierCode(null, 6)
    );

    let password_hash = await BcryptUtils.hashPassword(data.password);

    data.password = password_hash;
    data.identifier_code = identifier_code;
    data.code = code_active;

    const accountElement = this.createNewModelDocument(data);
    const accountRecordElement =
      accountRecordServices.createNewModelDocument(accountElement);

    await accountElement.save();
    await accountRecordElement.save();

    return accountElement;
  };

  createNewPatientDocument = async (data) => {
    const accountDocument = await AccountModel.findOne({
      act_phone_number: data.phone_number,
    }).lean();

    if (!!accountDocument)
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.ACCOUNT_EXIST);

    let map_prefix_code = VariableConfigs.MAP_PREFIX_ROLE;

    let identifier_code = SupportUtils.generateIdentifierCode(
      map_prefix_code[data.role],
      12
    );

    let password_hash = await BcryptUtils.hashPassword(data.password);

    data.password = password_hash;
    data.identifier_code = identifier_code;
    data.code = 0;
    data.status = 0;

    const accountElement = this.createNewModelDocument(data);

    const accountRecordElement =
      accountRecordServices.createNewModelDocument(accountElement);

    await accountElement.save();
    await accountRecordElement.save();

    return accountElement;
  };

  getOneDocument = async (data) => {
    const accountDocuments = await AccountModel.findById(data).lean();

    if (!accountDocuments)
      throw new BadRequestError(config.ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

    return accountDocuments;
  };

  getDocumentByDevice = async (data) => {
    const accountDocuments = await AccountModel.findOne({
      "pt_devices.device_id": data,
    });

    return accountDocuments;
  };

  getDetailDocument = async (data) => {
    const accountDocument = await AccountModel.findById(data).lean();

    if (!accountDocument)
      throw new BadRequestError(config.ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

    const recordAccountDocument =
      await accountRecordServices.getOneDocumentByAccount(accountDocument._id);

    if (!!recordAccountDocument)
      accountDocument.act_record = recordAccountDocument;
    else accountDocument.act_record = {};

    return accountDocument;
  };

  getPatientDocumentManagement = async (data) => {
    const patineDocuments = await AccountModel.find({
      act_role: "user",
      act_doctor: data._id,
    }).lean();

    let array_data = [];

    patineDocuments.forEach((e) => {
      array_data.push(e._id);
    });

    const recordAccountDocuments = await accountRecordServices.getManyDocuments(
      array_data
    );
    // console.log(recordAccountDocuments);
    for (let i = 0; i < patineDocuments.length; i++) {
      const record = recordAccountDocuments.find(
        (x) => x.arc_account_id.toString() == patineDocuments[i]._id.toString()
      );
      if (!!record) {
        patineDocuments[i].act_record = record.arc_heath_data;
        patineDocuments[i].act_body_record = record.arc_body_data;
      }
    }

    return patineDocuments;
  };

  updateDataHealthDocument = async (data) => {
    const accountDocuments = await AccountModel.findById(data.accountId).lean();
    if (!accountDocuments)
      throw new BadRequestError(config.ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

    await accountRecordServices.updateDataHealthDocument(data);

    return true;
  };

  changePasswordDocument = async (account, data) => {
    let check_password = await bcryptUtils.checkPassword(
      data.pwd_old,
      account.act_password
    );

    if (!check_password)
      throw new BadRequestError(
        VariableConfigs.ERROR_MESSAGE.WRONG_OLD_PASSWORD
      );

    let hash_new_pwd = await bcryptUtils.hashPassword(data.pwd_new);

    await accountModel.findByIdAndUpdate(account._id, {
      $set: {
        act_password: hash_new_pwd,
      },
    });

    return true;
  };

  getAllDataDocumentDashboard = async (account, query) => {
    let { timestamp } = query;

    const patientDocuments = await PatientServices.getAllPatientDocuments();
    const deviceDocuments = await DeviceServices.getAllDocument();

    let date = new Date(timestamp).getDate();
    let month = new Date(timestamp).getMonth();
    let year = new Date(timestamp).getFullYear();

    let start_time = new Date(year, month, date, 0, 1).getTime();
    let start_end = new Date(year, month, date, 23, 59).getTime();

    const appointmentDocuments = await AppointmentModel.find({
      ap_doctor: account._id,
      ap_date: { $gte: start_time, $lte: start_end },
    })
    .populate("ap_patient")
    .lean();

    let callback = {
      patients: patientDocuments,
      devices: deviceDocuments,
      appointment: appointmentDocuments,
    };

    return callback;
  };
}

module.exports = new AccountServices();
