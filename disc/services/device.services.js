"use strict";

const DeviceModel = require("./../models/devices.model");
const PatientModel = require("./../models/patients.model");
const MailerModel = require("./../models/mailer.model");
const VariableConfigs = require("./../configs/variable.configs");
const SupportUtils = require("./../utils/support.utils");
const config = require("./../configs/variable.configs");

class DeviceServices {
  createNewModel = (data) => {
    let newDeviceElement = new DeviceModel({
      dv_name: data.name_device,
      dv_mac_address: data.mac_address,
      dv_serial_number: data.serial_number,
      dv_version: data.version,
      dv_model: data.model,
    });

    return newDeviceElement;
  };

  createNewDocument = async (data) => {
    const deviceDocument = await DeviceModel.findOne({
      dvc_mac_address: data.mac_address,
    }).lean();

    if (!!deviceDocument)
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.DEVICE_EXIST);

    let number_of_device = await DeviceModel.countDocuments({
      dvc_model: data.model,
    });

    let map_prefix_device = VariableConfigs.MAP_PREFIX_SERIAL_DEVICE;
    let map_name_device = VariableConfigs.MAP_PREFIX_NAME_DEVICE;

    let serial_number =
      map_prefix_device[data.model] +
      SupportUtils.randomStringCode(7) +
      "0" +
      number_of_device +
      1;
    let name_device =
      map_name_device[data.model] + " #" + SupportUtils.randomStringCode(4);

    data.serial_number = serial_number;
    data.name_device = name_device;

    const newDeviceModel = this.createNewModel(data);
    await newDeviceModel.save();

    return newDeviceModel;
  };

  getAllDocument = async () => {
    const deviceDocuments = await DeviceModel.find({}).lean();

    return deviceDocuments;
  };

  getDataAlarmDocument = async (query) => {
    const { alarmId } = query;

    const mailerDocument = await MailerModel.findById(alarmId).lean();

    if (!!mailerDocument && mailerDocument.ml_reasons == "predict_heart") {
      const patientDocument = await PatientModel.findById(
        mailerDocument.ml_patient
      );

      const examinations = patientDocument.pt_examinations;
      const examination_with_condition =
        examinations.filter(
          (x) => x.timestamps <= mailerDocument.ml_timestamp
        )[0] || {};

      return {
        reason: mailerDocument.ml_data_reason || {},
        examinations: examination_with_condition,
      };
    }
  };

  getOneDocument = async (data) => {
    const deviceDocument = await DeviceModel.findById(data).lean();

    return deviceDocument;
  };

  getOneDocumentByMac = async (data) => {
    const deviceDocument = await DeviceModel.findOne({
      dv_mac_address: data,
    }).lean();

    return deviceDocument;
  };

  getFullDetailDocument = async (data) => {
    const deviceDocument = await DeviceModel.findById(data).lean();
    if (!deviceDocument)
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.DEVICE_NOT_FOUND);

    const userDocument = await PatientModel.findOne({
      "pt_devices.device_id": deviceDocument._id,
    });

    deviceDocument["patient"] = userDocument;

    return deviceDocument;
  };

  registerNewDocument = async (data) => {
    const { mac_address } = data;
    const deviceDocument = await DeviceModel.findOne({
      dv_mac_address: mac_address,
    }).lean();

    console.log(data);

    if (!deviceDocument) return this.createNewDocument(data);
  };

  setDocumentForPatient = async (data) => {
    const deviceDocument = await DeviceModel.findById(data.device_id).lean();

    if (!deviceDocument)
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.DEVICE_NOT_FOUND);

    const obj_device = {
      device_id: deviceDocument._id,
    };

    if (deviceDocument.dv_status == 0) {
      throw new BadRequestError(VariableConfigs.ERROR_MESSAGE.DEVICE_USING);
    }

    if (deviceDocument.dv_status == 1) {
      let obj_history = {
        patientId: data.account_id,
        timestamp: new Date().getTime(),
      };

      await PatientModel.findByIdAndUpdate(data.account_id, {
        $push: { pt_devices: obj_device },
      });

      await DeviceModel.findByIdAndUpdate(data.device_id, {
        $set: { dv_status: 0 },
        $push: { dv_history_using: obj_history },
      });
    }

    return true;
  };

  setAccountForAlarm = async (data) => {
    const { device, type_account, address_account } = data;

    const deviceDocument = await this.getOneDocument(device);

    const newDataAlarm = {
      type_alarm: type_account,
      address_alarm: address_account,
    };

    if (!!deviceDocument) {
      let array_alarm = deviceDocument.dv_account_alarm;

      const index = array_alarm.findIndex(
        (x) =>
          x.type_alarm == type_account && x.address_alarm == address_account
      );

      if (index == -1) {
        array_alarm.push(newDataAlarm);

        await DeviceModel.findByIdAndUpdate(deviceDocument._id, {
          $set: {
            dv_account_alarm: array_alarm,
          },
        });
      }
    }

    return newDataAlarm;
  };

  removeAccountForAlarm = async (data) => {
    const { device, type_alarm, address_alarm } = data;

    const deviceDocument = await this.getOneDocument(device);

    if (!!deviceDocument) {
      let list_alarm = deviceDocument.dv_account_alarm;

      let index = list_alarm.findIndex(
        (x) => x.type_alarm == type_alarm && x.address_alarm == address_alarm
      );

      list_alarm.splice(index, 1);
      await DeviceModel.findByIdAndUpdate(deviceDocument._id, {
        $set: {
          dv_account_alarm: list_alarm,
        },
      });
    }

    return true;
  };

  restartDocument = async (data) => {
    let topic_restart = "restart_device/" + data.mac;
    let topic_clear = "clear/" + data.mac;
    let msg_restart = "restart";
    let msg_restart_clear = "no_restart";

    return {
      topic_clear: topic_clear,
      topic_restart: topic_restart,
      msg_restart: msg_restart,
      msg_restart_clear: msg_restart_clear,
    };
  };

  removeDocumentInAccount = async (data) => {
    let { device_id, patient } = data;

    const patientDeviceDocuments = await PatientModel.findById(patient)
      .select("pt_devices")
      .lean();

    if (!!patientDeviceDocuments) {
      let list_devices = patientDeviceDocuments.pt_devices;

      const device_exist_index = list_devices.findIndex(
        (x) => x.device_id.toString() == device_id
      );

      if (device_exist_index != -1) {
        list_devices.splice(device_exist_index, 1);
        await PatientModel.findByIdAndUpdate(patient, {
          $set: { pt_devices: list_devices },
        });
        await DeviceModel.findByIdAndUpdate(device_id, {
          $set: { dv_status: 1 },
        });
      }

      return true;
    }

    return {};
  };

  getDocumentByAccount = async (data) => {
    const accountDocument = await PatientModel.findById(data).lean();

    if (!accountDocument)
      throw new BadRequestError(config.ERROR_MESSAGE.ACCOUNT_NOT_FOUND);

    let list_devices = accountDocument.pt_devices;
    let list_ids_devices = [];

    list_devices.forEach((e) => {
      list_ids_devices.push(e.device_id.toString());
    });

    let deviceDocuments = await DeviceModel.find({
      _id: { $in: list_ids_devices },
    });

    return deviceDocuments;
  };

  updatePowerDocument = async (mac_address, data_power) => {
    let percent = data_power.bt_percent.toFixed(2);
    let volt = data_power.bt_volt.toFixed(2);
    let used = data_power.bt_time_used;

    await DeviceModel.findOneAndUpdate(
      { dv_mac_address: mac_address },
      {
        $set: {
          dv_power: {
            bt_percent: percent,
            bt_volt: volt,
            bt_time_used: used,
          },
        },
      }
    );

    return true;
  };
}

module.exports = new DeviceServices();
