"use strict";

const SERVER = {
  protocol: "http://",
  // host: "localhost",
  // host: "192.168.38.60",
  // host: "192.168.0.113",
  host: "118.69.168.44",
  port: "9991",
  path_public_picture: "/thumbnail",
  path_public_document: "/document",
  path_public_avatar: "/avatar",
};

const MONGO = {
  app: {
    port: "9000",
  },

  db: {
    username: "admin",
    password: "p0o9i8u7y6t5r4e3w2q1",
    // host1: "165.22.240.231",
    host1: "118.69.171.119",
    host2: "128.199.76.207",
    host3: "118.69.168.44",
    port: 28017,
    host_local: "localhost",
    port_local: 27017,
    // database_name: "heath_wearable_dbs",
    database_name: "health_wearable_dbs",
  },
};

const ERROR_MESSAGE = {
  INVALID_FORM: "INVALID_FORM",
  ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
  ACCOUNT_NOT_DOCTOR: "ACCOUNT_NOT_DOCTOR",
  ACCOUNT_NOT_PATIENT: "ACCOUNT_NOT_PATIENT",
  DEVICE_NOT_FOUND: "DEVICE_NOT_FOUND",
  DEVICE_USING: "DEVICE_USING",
  ACCOUNT_NOT_VERIFY: "ACCOUNT_NOT_VERIFY",
  ACCOUNT_IS_LOCKED: "ACCOUNT_IS_LOCKED",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  WRONG_PASSWORD: "WRONG_PASSWORD",
  WRONG_CODE: "WRONG_CODE",
  WRONG_OLD_PASSWORD: "WRONG_OLD_PASSWORD",
  ACCOUNT_EXIST: "ACCOUNT_EXIST",
  DEVICE_EXIST: "DEVICE_EXIST",
  NO_FILE_UPLOAD: "NO_FILE_UPLOAD",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_IS_NOT_SUPPORT: "FILE_IS_NOT_SUPPORT",
  NOT_PERMISSION: "NOT_PERMISSION",
  IS_SUBMITTED: "IS_SUBMITTED",
  SUCCESS: "SUCCESS",
  INTERNAL_SERVER: "INTERNAL_ERROR_SERVER",
};

const TOPIC_MQTT = {
  RECEIVE_DATA: "data_from_esp",
  RECEIVE_BATTERY: "battery_from_esp",
  RECEIVE_SOUND: "sound_from_esp",
  RECEIVE_BATTERY: "battery_from_esp",
  RECEIVE_DATA_MOTION: "motion_from_esp",
  RECEIVE_DATA_PREDICTION: "ai_server/receive_prediction",
  RECEIVE_DATA_PREDICTION_HEALTH: "receive_prediction_health",
  RECEIVE_DATA_PREDICTION_MOTION: "receive_prediction_motion",
  RECEIVE_DATA_PREDICTION_SOUND: "receive_prediction_sound",
  RECEIVE_TEMPERATURE: "temp_from_esp",
  RECEIVE_HEART: "heart_from_esp",
  RECEIVE_AIR: "air_from_esp",
  REGISTER_DEVICE: "register_device",
  RECEIVE_VECTOR: "",

  ACTION_SEND_APPOINTMENT: "topic/send_appointment/",
};

const TOKEN = {
  secret_key_token: "-xN_h82PHVTCMA9vdoHrcZxH-x5mb11y1537t3rGzcM",
  secret_key_rf_token: "qjrzSW9gMiUgpUvqgEPE4_-8swvyCtfOV",
};

const PREFIX_API = "/api";

const MAP_PREFIX_ROLE = {
  doctor: "DT",
  member: "MB",
};

const MAP_PREFIX_SERIAL_DEVICE = {
  w_d: "SWD",
};

const MAP_PREFIX_NAME_DEVICE = {
  w_d: "Smart Wearable",
};

const MAILER = {
  USER: "administrator@bms.vn",
  PASSWORD: "jevc vcwd huxo raxy",
  NAME: "Healthcare Admin",
  SUBJECT: {
    WARNING: "Cảnh báo quan trọng",
  },
};

const config = {
  MONGO,
  ERROR_MESSAGE,
  TOKEN,
  SERVER,
  PREFIX_API,
  MAP_PREFIX_NAME_DEVICE,
  MAP_PREFIX_SERIAL_DEVICE,
  MAP_PREFIX_ROLE,
  TOPIC_MQTT,
  MAILER,
};

module.exports = config;
