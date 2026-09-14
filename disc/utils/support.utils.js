"use strict";

const { v4: uuidv4 } = require("uuid");

function generateIdentifierCode(prefix, data_length) {
  return (
    `${!!prefix ? prefix : ""}` +
    Math.floor(
      Math.pow(10, data_length - 1) +
        Math.random() * 9 * Math.pow(10, data_length - 1)
    )
  );
}

function randomStringCode(length_code) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length_code) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result.toUpperCase();
}

function sortRangeDayOfWeek(date_start, date_finish) {
  let date_start_split = date_start.split("-");
  let date_finish_split = date_finish.split("-");

  let time_start = new Date(
    Number.parseInt(date_start_split[2]),
    Number.parseInt(date_start_split[1] - 1),
    Number.parseInt(date_start_split[0]),
    0,
    1
  ).getTime();

  let time_finish = new Date(
    Number.parseInt(date_finish_split[2]),
    Number.parseInt(date_finish_split[1] - 1),
    Number.parseInt(date_finish_split[0]),
    23,
    59
  ).getTime();
  return {
    time_start: time_start,
    time_finish: time_finish,
  };
}

function randomPatientNumber(role) {
  const uuid = uuidv4().replace(/-/g, ""); // Loại bỏ dấu gạch ngang
  let prefix = role == "doctor" ? "DT" : "PT";
  return prefix + uuid.substring(0, 6).toUpperCase(); // Lấy 6 ký tự đầu tiên và thêm "PT"
}

function convertToInternationalFormat(phoneNumber) {
  phoneNumber = phoneNumber.replace(/\D/g, "");

  if (phoneNumber.startsWith("0")) {
    return "+84" + phoneNumber.slice(1);
  } else {
    throw new Error("Số điện thoại không hợp lệ hoặc không phải của Việt Nam");
  }
}

module.exports = {
  sortRangeDayOfWeek: sortRangeDayOfWeek,
  generateIdentifierCode: generateIdentifierCode,
  randomStringCode: randomStringCode,
  randomPatientNumber: randomPatientNumber,
  convertToInternationalFormat: convertToInternationalFormat,
};
