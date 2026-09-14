"use strict";

const AppointmentModel = require("./../models/appointment");

const { BadRequestError } = require("./../core/error.response");
const supportUtils = require("../utils/support.utils");
const mqttServices = require("../mqtt/index.mqtt");
const config = require("../configs/variable.configs");

class AppointmentServices {
  createNewDocument = (data) => {
    const document = new AppointmentModel({
      ap_patient: data.patient,
      ap_doctor: data.doctor,
      ap_date: data.date,
      ap_time: data.time,
    });

    return document;
  };

  insertNewDocument = async (data, accountId) => {
    const date_parse = data.date.split("-");
    const date_appointment = new Date(
      Number.parseInt(date_parse[2]),
      Number.parseInt(date_parse[1]) - 1,
      Number.parseInt(date_parse[0]),
      23,
      59
    ).getTime();

    let data_document = {
      patient: accountId,
      doctor: data.doctor,
      date: date_appointment,
      time: data.time,
    };

    const newDocument = this.createNewDocument(data_document);

    await newDocument.save();

    const apDocument = await this.getOneDocumentByDoctor(newDocument.ap_doctor);

    let topic_listen_ap =
      config.TOPIC_MQTT.ACTION_SEND_APPOINTMENT + newDocument.ap_doctor;
    let msg = JSON.stringify(apDocument);

    mqttServices.sendEventForUser(topic_listen_ap, msg);

    return newDocument;
  };

  updateStatusDocument = async (data) => {
    const { appointmentId, status } = data;

    await AppointmentModel.findByIdAndUpdate(appointmentId, {
      $set: {
        ap_status: status,
      },
    });

    return true;
  };

  getAllDocumentByPatient = async (accountId) => {
    const appointmentDocuments = await AppointmentModel.find({
      ap_patient: accountId,
    })
      .sort({ ap_date: 1 })
      .lean();

    return appointmentDocuments;
  };

  getOneDocumentByDoctor = async (doctorId) => {
    const documents = await AppointmentModel.find({
      ap_doctor: doctorId,
    })
      .populate("ap_patient")
      .lean();

    return documents;
  };

  getOneDocumentById = async (apId) => {
    const documents = await AppointmentModel.findById(apId)
      .populate("ap_patient")
      .lean();

    return documents;
  };

  getDocumentByDoctorAndRangeWeek = async (doctorId, data) => {
    let range_weeks = data.range_week;

    const { time_start, time_finish } = supportUtils.sortRangeDayOfWeek(
      range_weeks[0],
      range_weeks[1]
    );

    const documents = await AppointmentModel.find({
      ap_doctor: doctorId,
      ap_date: { $gte: time_start, $lte: time_finish },
    })
      .populate("ap_patient")
      .lean();

    return documents;
  };

  cancelDocument = async (data) => {
    const appointmentDocument = await this.getOneDocumentById(data);

    if (!!appointmentDocument) {
      await AppointmentModel.findByIdAndDelete(appointmentDocument._id).lean();

      setTimeout(() => {
        let topic_listen_ap =
          config.TOPIC_MQTT.ACTION_SEND_APPOINTMENT +
          appointmentDocument.ap_doctor;
        let msg = JSON.stringify({});

        mqttServices.sendEventForUser(topic_listen_ap, msg);
      }, 2000);
    }
  };

  checkSlotInDocument = async (data) => {
    const { date_ap, doctorId } = data;
    let array_exist_slots = [];
    const { time_start, time_finish } = supportUtils.sortRangeDayOfWeek(
      date_ap,
      date_ap
    );
    const appointmentDocuments = await AppointmentModel.find({
      ap_doctor: doctorId,
      ap_date: { $gte: time_start, $lte: time_finish },
    }).lean();

    for (let i = 0; i < appointmentDocuments.length; i++) {
      array_exist_slots.push(appointmentDocuments[i].ap_time);
    }

    return array_exist_slots;
  };
}

module.exports = new AppointmentServices();
