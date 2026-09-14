"use strict";

const ReadingModel = require("./../models/readings.model");

class ReadingServices {
  createModel = async (deviceId, accountId, data) => {
    const newReading = new ReadingModel({
      rd_patient: accountId,
      rd_device: deviceId,
      rd_readings: data,
    });

    return newReading;
  };

  insertDocument = async (deviceId, accountId, data) => {
    const newReadingDocument = await this.createModel(
      deviceId,
      accountId,
      data
    );

    newReadingDocument.save();
    return true;
  };

  getDocumentDataFirst = async (query) => {
    const { deviceId, patientId } = query;

    console.log(`deviceId`, deviceId, patientId);

    const readingDocuments = await ReadingModel.find({
      rd_patient: patientId,
      rd_device: deviceId,
    })
      .sort({ rd_timestamp: -1 })
      .limit(100)
      .lean();

    let heart = [];
    let spo2 = [];
    let temperature = [];

    for (let i = 0; i < readingDocuments.length; i++) {
      let record = readingDocuments[i].rd_readings;

      heart.push(Number(record.acr_heart));
      spo2.push(Number(record.acr_spo2));
      temperature.push(Number(record.acr_temperature_human));
    }

    return {
      heart: heart,
      spo2: spo2,
      temperature: temperature,
    };
  };
}

module.exports = new ReadingServices();
