"use strict";

const config = require("../configs/variable.configs");
const accountServices = require("../services/account.service");
const jwtUtils = require("../utils/jwt.utils");
const { BadRequestError } = require("./error.response");

class Permission {
  checkAuthentication = async (req, res, next) => {
    const token = req.headers["authorization"].split("Bearer ")[1];
    console.log(token);
    const encode_token = await jwtUtils.verifyToken(token);

    if (!encode_token["accountId"])
      throw new BadRequestError(config.ERROR_MESSAGE.NOT_PERMISSION);

    let account = await accountServices.getOneDocument(
      encode_token["accountId"]
    );

    if (!account)
      throw new BadRequestError(config.ERROR_MESSAGE.NOT_PERMISSION);

    req.account = account;
    next();
  };
}

module.exports = new Permission();
