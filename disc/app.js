const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const mongo = require("./dbs/init.mongodb");
const configs = require("./configs/variable.configs");
const appointmentService = require("./services/appointment.service");
const mqttServices = require("./mqtt/index.mqtt");
const mailerServices = require("./services/mailer.services");
const smsServices = require("./mqtt/sms.services");

const app = express();

// !INIT MIDDLEWARE
app.use(cors("*"));
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// mailerServices.handleMailWarningHeart("3C:E9:0E:AD:C3:EC", {
//   mac_address: "3C:E9:0E:AD:C3:EC",
//   prediction: "Absence",
//   type: "health",
//   value_heart: 0,
//   prediction_spo2: "4",
//   value_spo2: 0,
//   prediction_pm: "3",
//   value_pm: 309,
// });

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    defCharset: "utf8",
    defParamCharset: "utf8",
  })
);

// !CONNECT MONGO DB
mongo.connectMongo();

// !INIT ROUTER
app.use(configs.PREFIX_API, require("./routers"));

// !HANDLE ERROR
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Error Server",
  });
});

// !CONNECT MQTT
mqttServices.connectMqtt();

module.exports = app;
