"use strict";

const { model, Schema, Types, Collection } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Mailer";
const COLLECTION_NAME = "Mailers";

var modelSchema = new Schema(
  {
    ml_patient: { type: String, required: true, ref: "Patient" },
    ml_device: { type: String, required: true, ref: "Device" },
    ml_receiver: { type: Array, default: [] },
    ml_timestamp: { type: Number },
    ml_reasons: { type: String, default: {} },
    ml_record_body: { type: Object, default: {} },
    ml_data_reason: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, modelSchema);
