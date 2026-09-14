"use strict";

const accountServices = require("../services/account.service");
const { OkRequestSuccess } = require("./../core/success.response");

class AccountControllers {
  createNewAccount = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.createNewDocument(req.body),
    }).send(res);
  };

  getAllDataDashboard = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.getAllDataDocumentDashboard(
        req.account,
        req.query
      ),
    }).send(res);
  };

  createNewAccountPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.createNewPatientDocument(req.body),
    }).send(res);
  };

  getAccountByToken = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: req.account,
    }).send(res);
  };

  getPatientManagement = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.getPatientDocumentManagement(req.account),
    }).send(res);
  };

  getDetailPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.getDetailDocument(req.query.accountId),
    }).send(res);
  };

  updateDateHealthPatient = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.updateDataHealthDocument(req.body),
    }).send(res);
  };

  loginAccount = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.loginDocument(req.body),
    }).send(res);
  };

  activeAccount = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.activeDocument(req.body),
    }).send(res);
  };

  changePasswordAccount = async (req, res, next) => {
    new OkRequestSuccess({
      message: "SUCCESS",
      metadata: await accountServices.changePasswordDocument(
        req.account,
        req.body
      ),
    }).send(res);
  };
}

module.exports = new AccountControllers();
