"use strict";

const mongoose = require("mongoose");

const config = require("../configs/variable.configs").MONGO;

exports.connectMongo = function () {
  mongoose.Promise = global.Promise;
  let uri_connect_local =
    "mongodb://" +
    config.db.username +
    ":" +
    config.db.password +
    "@" +
    config.db.host3 +
    ":" +
    config.db.port +
    "/" +
    config.db.database_name;

  mongoose
    .connect(uri_connect_local, {
    })
    .then(() => {
      console.log(2, `CONNECT ${config.db.database_name} SUCCESSFULLY!`);
    })
    .catch((err) => {
      console.log("Connect Mongodb Error!", err);
    });
};
