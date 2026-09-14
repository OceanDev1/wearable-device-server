"use strict";

const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(passWord) {
   return new Promise((resolve, reject) => {
      bcrypt.hash(passWord, saltRounds, function (error, hash) {
         if (error) return reject(error);
         return resolve(hash);
      });
   });
}

async function checkPassword(passWord, hash) {
   return new Promise((resolve, reject) => {
      bcrypt.compare(passWord, hash, function (error, result) {
         if (error) return reject(error);
         return resolve(result);
      });
   });
}

module.exports = {
   hashPassword: hashPassword,
   checkPassword: checkPassword,
};
