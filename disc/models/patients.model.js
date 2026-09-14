"use strict";

const { model, Schema, Types, Collection } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Patient";
const COLLECTION_NAME = "Patients";

var modelSchema = new Schema(
  {
    pt_number: { type: String, required: true },
    pt_name: { type: String, required: true },
    pt_password: { type: String, required: true },
    pt_gender: { type: String, required: true },
    pt_address: { type: String, default: "" },
    pt_avatar: { type: String, default: "" },
    pt_phone: { type: String, required: true },
    pt_role: { type: String, default: "user" },
    pt_birth: { type: String, required: true },
    pt_devices: { type: Array, default: [] }, // danh sach thiet bi so huu
    pt_examinations: { type: Array, default: [] },  // Thong so moi lan kham
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, modelSchema);
