"use strict";

const nodemailer = require("nodemailer");
const config = require("../configs/variable.configs");
const template_mailer = require("../configs/template_mailer");
const deviceServices = require("./device.services");
const accountService = require("./account.service");
const MailerModel = require("../models/mailer.model");
const supportUtils = require("../utils/support.utils");
const smsServices = require("./../mqtt/sms.services");

const userMail = config.MAILER.USER;
const passMail = config.MAILER.PASSWORD;
const userAdmin = config.MAILER.NAME;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userMail, // generated ethereal user
    pass: passMail, // generated ethereal password
  },
});

class MailerServices {
  createNewDocument = async (data) => {
    const newDocument = new MailerModel({
      ml_patient: data.ml_patient,
      ml_device: data.ml_device,
      ml_receiver: data.ml_receiver,
      ml_timestamp: new Date().getTime(),
      ml_reasons: data.ml_reasons,
      ml_data_reason: data.ml_data_reason,
    });

    return newDocument;
  };

  sendMailWarning = async (to, code) => {
    const mailOption = this.mailWarning(to, code);
    transporter.sendMail(mailOption, (error, info) => {
      console.log(error, info);
      if (error) return reject(resolve);
      return resolve(true);
    });
  };

  handleMailWarningHeart = async (mac_address, data_predict) => {
    const deviceDocument = await deviceServices.getOneDocumentByMac(
      mac_address
    );

    if (!!deviceDocument) {
      const accountDocument = await accountService.getDocumentByDevice(
        deviceDocument._id
      );

      if (!!accountDocument) {
        let name_patient = accountDocument.pt_name;
        let record_health_body =
          accountDocument.pt_examinations[
            accountDocument.pt_examinations.length - 1
          ];

        let mailerDocument = await this.getDocumentByDeviceAndTypeAndTimestamp(
          deviceDocument._id,
          "predict_heart"
        );
        let new_data = {
          ml_patient: accountDocument._id,
          ml_device: deviceDocument._id,
          ml_receiver: deviceDocument.dv_account_alarm,
          ml_reasons: "predict_heart",
          ml_record_body: record_health_body,
          ml_data_reason: {
            prediction: data_predict.prediction,
            prediction_spo2: data_predict.prediction_spo2,
            prediction_pm: data_predict.prediction_pm,
            value_temperature : data_predict.value_temperature,
            value_spo2: data_predict.value_spo2 || "",
            value_heart: data_predict.value_heart || "",
            value_pm: data_predict.value_pm || "",
          },
        };

        if (data_predict.prediction == "Presence") {
          if (!mailerDocument) {
            console.log("Chưa có");
            const newMailerDocument = await this.createNewDocument(new_data);
            newMailerDocument.save();
            this.handleSendMail(
              deviceDocument.dv_account_alarm,
              name_patient,
              data_predict
            );

            return new_data;
          } else {
            let time_mailer_last = mailerDocument.ml_timestamp;
            let time_out = 300000;
            let time_now = new Date().getTime();

            if (time_now - time_out > time_mailer_last) {
              console.log("OK 5p");
              const newMailerDocument = await this.createNewDocument(new_data);
              newMailerDocument.save();
              this.handleSendMail(
                deviceDocument.dv_account_alarm,
                name_patient,
                data_predict
              );
              return new_data;
            } else {
              console.log("Not OK 5p");
            }
          }
        } else return new_data;
      }
    }
  };

  handleMailWarningFall = async (mac_address, data_predict) => {
    const deviceDocument = await deviceServices.getOneDocumentByMac(
      mac_address
    );

    if (!!deviceDocument) {
      const accountDocument = await accountService.getDocumentByDevice(
        deviceDocument._id
      );

      if (!!accountDocument) {
        let name_patient = accountDocument.pt_name;
        let mailerDocument = await this.getDocumentByDeviceAndTypeAndTimestamp(
          deviceDocument._id,
          "predict_fall"
        );
        let new_data = {
          ml_patient: accountDocument._id,
          ml_device: deviceDocument._id,
          ml_receiver: deviceDocument.dv_account_alarm,
          ml_reasons: "predict_fall",
          ml_record_body: {},
          ml_data_reason: data_predict,
        };

        if (!mailerDocument) {
          console.log("Chua co fall");
          const newMailerDocument = await this.createNewDocument(new_data);
          // newMailerDocument.save();
          // this.handleSendMail(
          //   deviceDocument.dv_account_alarm,
          //   name_patient,
          //   data_predict
          // );

          return new_data;
        } else {
          let time_mailer_last = mailerDocument.ml_timestamp;
          let time_out = 100000;
          let time_now = new Date().getTime();

          if (time_now - time_out > time_mailer_last) {
            console.log("OK 5p");
            const newMailerDocument = await this.createNewDocument(new_data);
            // newMailerDocument.save();
            this.handleSendMailFall(
              deviceDocument.dv_account_alarm,
              name_patient
            );
            return new_data;
          } else {
            console.log("Not OK 5p");
          }
        }
      }
    }
  };

  handleSendMail = async (receivers, name, data_predict) => {
    receivers.forEach(async (e) => {
      if (e.type_alarm == "email") {
        this.sendMailWarningHeart(
          e.address_alarm,
          name,
          data_predict.value_heart,
          data_predict.value_spo2
        );
      } else if (e.type_alarm == "phone") {
        let phone_number = e.address_alarm;
        let valid_phone =
          supportUtils.convertToInternationalFormat(phone_number);
        let message = `Chào bạn!, ${name} hiện đang có dấu hiệu nguy cơ xảy ra bệnh tim. Vui lòng đặt lịch và chở bệnh nhân đi kiểm tra sớm để phát hiện kịp thời nguy cơ!`;

        // await smsServices.sendSms(valid_phone, message);
      }
    });
  };

  handleSendMailFall = async (receivers, name) => {
    receivers.forEach(async (e) => {
      if (e.type_alarm == "email") {
        this.sendMailWarningFall(e.address_alarm, name);
      } else if (e.type_alarm == "phone") {
        let phone_number = e.address_alarm;
        let valid_phone =
          supportUtils.convertToInternationalFormat(phone_number);
        let message = `Chào bạn!, ${name} phát hiện có vận động bất thường nghi là bị té ngã! Người thân vui lòng kiểm tra và theo dõi! `;

        // await smsServices.sendSms(valid_phone, message);
      }
    });
  };

  sendMailWarningHeart = async (to, name, heart, sp) => {
    const mailOption = this.mailWarningHeart(to, name, heart, sp);
    transporter.sendMail(mailOption, (error, info) => {
      if (error) return reject(resolve);
      return resolve(true);
    });
  };

  sendMailWarningFall = async (to, name) => {
    const mailOption = this.mailWarningFall(to, name);
    transporter.sendMail(mailOption, (error, info) => {
      if (error) return reject(resolve);
      return resolve(true);
    });
  };

  getDocumentByDeviceAndTypeAndTimestamp = async (device_id, type_predict) => {
    const mailerDocument = await MailerModel.findOne({
      ml_device: device_id,
      ml_reasons: type_predict,
    })
      .sort({ ml_timestamp: -1 })
      .lean();

    return mailerDocument;
  };

  mailWarningHeart(to, name, heart, sp) {
    const mailOptions = {
      from: userAdmin,
      to: to,
      subject: config.MAILER.SUBJECT.WARNING,
      html: template_mailer.templateHeartWarning(name, heart, sp),
    };
    return mailOptions;
  }

  mailWarningFall(to, name) {
    const mailOptions = {
      from: userAdmin,
      to: to,
      subject: config.MAILER.SUBJECT.WARNING,
      html: template_mailer.templateFallWarning(name),
    };
    return mailOptions;
  }

  mailWarning(to, code) {
    const mailOptions = {
      from: userAdmin,
      to: to,
      subject: config.MAILER.SUBJECT.WARNING,
      html: template_mailer.templateWarning(to, code),
    };
    return mailOptions;
  }
}

module.exports = new MailerServices();
