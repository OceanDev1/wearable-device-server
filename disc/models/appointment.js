"use strict";

const { model, Schema, Types, Collection } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Appointment";
const COLLECTION_NAME = "Appointments";

var modelSchema = new Schema(
  {
    ap_patient: { type: String, require: true, ref: "Patient" },
    ap_doctor: { type: String, require: true, ref: "Patient" },
    ap_date: { type: Number, require: true },
    ap_time: { type: Number, require: true },
    ap_status: { type: Number, default: 0 }, // 0 Chua xu ly // 1 da xu ly
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, modelSchema);
