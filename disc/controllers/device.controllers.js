"use strict";

const deviceServices = require("./../services/device.services");
const mqttServices = require("./../mqtt/index.mqtt");

const { OkRequestSuccess } = require("./../core/success.response");

class DeviceControllers {
  getAllDevices = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await deviceServices.getAllDocument(),
    }).send(res);
  };

  getDataAlarmDevice = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await deviceServices.getDataAlarmDocument(req.query),
    }).send(res);
  };

  setDeviceForPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await deviceServices.setDocumentForPatient(req.body),
    }).send(res);
  };

  settingAccountForAlarm = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await deviceServices.setAccountForAlarm(req.body),
    }).send(res);
  };

  removeDeviceInAccount = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await deviceServices.removeDocumentInAccount(req.body),
    }).send(res);
  };

  removeAccountInAlarm = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await deviceServices.removeAccountForAlarm(req.body),
    }).send(res);
  };

  restartDevice = async (req, res, next) => {
    let data = await deviceServices.restartDocument(req.query);

    console.log("send", data.msg_restart);
    await mqttServices.sendEvent(data.topic_restart, data.msg_restart);
    setTimeout(async () => {
      await mqttServices.sendEvent(data.topic_restart, data.msg_restart_clear);
    }, 1000);

    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: true,
    }).send(res);
  };

  getFullDetailDevice = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await deviceServices.getFullDetailDocument(req.query.deviceId),
    }).send(res);
  };

  getDeviceByAccount = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await deviceServices.getDocumentByAccount(req.account._id),
    }).send(res);
  };
}

module.exports = new DeviceControllers();
