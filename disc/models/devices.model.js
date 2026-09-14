"use strict";

const { model, Schema, Types, Collection } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Device";
const COLLECTION_NAME = "Devices";

var modelSchema = new Schema(
  {
    dv_name: { type: String, require: true },
    dv_mac_address: { type: String, require: true },
    dv_serial_number: { type: String, require: true },
    dv_version: { type: String, default: "" },
    dv_account_alarm: { type: Array, default: [] },
    dv_status: { type: Number, default: 1 }, // 1: Thiet bi moi; //0: thiet bi dang su dung
    dv_connection: { type: Boolean, default: false },
    dv_history_using: { type: Array, default: [] },
    dv_power: { type: Object, default: {} },
    dv_model: { type: String, default: "" }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, modelSchema);
