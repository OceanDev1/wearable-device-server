"use strict";

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../configs/variable.configs");

function generateToken(dataJson) {
   return new Promise((resolve, reject) => {
      jwt.sign(dataJson, config.TOKEN.secret_key_token, (error, token) => {
         if (error) return reject(error);

         return resolve(token);
      });
   });
}

function generateRefreshToken(dataJson) {
   return new Promise((resolve, reject) => {
      jwt.sign(dataJson, config.TOKEN.secret_key_rf_token, (error, token) => {
         if (error) return reject(error);

         return resolve(token);
      });
   });
}

function verifyToken(token) {
   return new Promise((resolve, reject) => {
      try {
         const decode = jwt.verify(token, config.TOKEN.secret_key_token);
         return resolve(decode);
      } catch (error) {
         return reject(error);
      }
   });
}

module.exports = {
   generateToken: generateToken,
   generateRefreshToken: generateRefreshToken,
   verifyToken: verifyToken,
};

