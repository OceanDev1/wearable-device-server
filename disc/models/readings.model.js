"use strict";

const { model, Schema, Types, Collection } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Reading";
const COLLECTION_NAME = "Readings";

var modelSchema = new Schema(
  {
    rd_patient: { type: String, required: true },
    rd_device: { type: String, required: true },
    rd_timestamp: { type: String, default: new Date() },
    rd_readings: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, modelSchema);
