"use strict";

var mqtt = require("mqtt");
const configVariable = require("../configs/variable.configs");
const deviceServices = require("./../services/device.services");
const accountService = require("../services/account.service");
const mailerServices = require("../services/mailer.services");
const readingService = require("../services/reading.services");

var client;
let url_mqtt = "https://139.59.115.246:1883";

function connectMqtt() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  client = mqtt.connect(url_mqtt, {
    clean: true,
    connectTimeout: 4000,
    username: "mesh",
    password: "mesh@12345",
    reconnectPeriod: 1000,
    qos: 0,
  });

  client.on("connect", async () => {
    console.log(3, `SERVER CONNECT MQTT SUCCESSFULLY!`);
    const deviceDocuments = await deviceServices.getAllDocument();

    // LISTEN NEW DEVICE
    client.subscribe(
      configVariable.TOPIC_MQTT.REGISTER_DEVICE,
      {
        qos: 1,
      },
      () => {}
    );

    for (let i = 0; i < deviceDocuments.length; i++) {
      console.log("Ket noi device Mqtt::", deviceDocuments[i].dv_mac_address);
      client.subscribe(
        configVariable.TOPIC_MQTT.RECEIVE_DATA +
          "/" +
          deviceDocuments[i].dv_mac_address,
        {
          qos: 1,
        },
        () => {}
      );

      client.subscribe(
        configVariable.TOPIC_MQTT.RECEIVE_BATTERY +
          "/" +
          deviceDocuments[i].dv_mac_address,
        {
          qos: 1,
        },
        () => {}
      );

      client.subscribe(
        configVariable.TOPIC_MQTT.RECEIVE_DATA_MOTION +
          "/" +
          deviceDocuments[i].dv_mac_address,
        {
          qos: 1,
        },
        () => {}
      );

      client.subscribe(
        configVariable.TOPIC_MQTT.RECEIVE_SOUND +
          "/" +
          deviceDocuments[i].dv_mac_address,
        {
          qos: 1,
        },
        () => {}
      );

      // LISTEN DATA FROM AI
      client.subscribe(
        configVariable.TOPIC_MQTT.RECEIVE_DATA_PREDICTION_MOTION,
        {
          qos: 1,
        },
        () => {}
      );

      client.subscribe(
        configVariable.TOPIC_MQTT.RECEIVE_DATA_PREDICTION_SOUND,
        {
          qos: 1,
        },
        () => {}
      );

      client.subscribe(
        configVariable.TOPIC_MQTT.RECEIVE_DATA_PREDICTION_HEALTH,
        {
          qos: 1,
        },
        () => {}
      );
    }

    setTimeout(() => {
      listenEvent();
    }, 1000);
  });

  client.on("disconnect", async (error) => {
    console.log("Mqtt disconnect", error);
  });
}

function listenEvent() {
  client.on("message", async (topic, payload) => {
    const topic_handle = topic.split("/")[0];

    const mac_address = topic.split("/")[1];

    if (topic_handle == "data_from_esp") {
      let data = payload.toString();

      const deviceDocument = await deviceServices.getOneDocumentByMac(
        mac_address
      );

      if (!!deviceDocument) {
        const accountDocument = await accountService.getDocumentByDevice(
          deviceDocument._id
        );
        if (!!accountDocument) {
          let value_payload = JSON.parse(data);

          let data_health = accountDocument.pt_examinations;
          let detail_data_health = data_health[data_health.length - 1];

          value_payload.acr_air = value_payload.acr_air;
          value_payload.acr_temperature_human =
            value_payload.acr_temperature_human.toFixed(1);
          value_payload.acr_temperature_ambident =
            value_payload.acr_temperature_ambident.toFixed(1);
          value_payload.acr_heart_average =
            value_payload.acr_heart_average.toString();

          // await readingService.insertDocument(
          //   deviceDocument._id,
          //   accountDocument._id,
          //   value_payload
          // );

          if (!!detail_data_health) {
            let topic_send_AI = "main_server/data_health";
            let msg_send_AI_server = JSON.stringify({
              mac_address: mac_address,
              type: "health",
              ...value_payload,
              ...detail_data_health,
            });

            sendEvent(topic_send_AI, msg_send_AI_server);
          }

          const topic = "response_data_health/" + deviceDocument._id;
          const msg = JSON.stringify({
            topic: topic_handle,
            device_id: deviceDocument._id,
            value: value_payload,
          });

          sendEventForUser(topic, msg);
        }
      }
    }

    if (topic_handle == "sound_from_esp") {
      let data = JSON.parse(payload.toString());
      var array = JSON.parse(data.acr_sound);
      const deviceDocument = await deviceServices.getOneDocumentByMac(
        mac_address
      );

      if (!!deviceDocument) {
        const topic = "response_data_sound/" + deviceDocument._id;
        const msg = JSON.stringify({
          topic: topic_handle,
          device_id: deviceDocument._id,
          value: array,
        });

        sendEventForUser(topic, msg);
      }

      let topic_send_AI = "main_server/data_health";
      let msg_send_AI_server = JSON.stringify({
        mac_address: mac_address,
        type: "sound",
        data: array,
      });

      sendEvent(topic_send_AI, msg_send_AI_server);
    }

    if (topic_handle == "motion_from_esp") {
      const deviceDocument = await deviceServices.getOneDocumentByMac(
        mac_address
      );
      if (!!deviceDocument) {
        const accountDocument = await accountService.getDocumentByDevice(
          deviceDocument._id
        );

        if (!!accountDocument) {
          let value_payload_motion = JSON.parse(payload.toString());
          value_payload_motion.xAcc = value_payload_motion.xAcc.toFixed(2);
          value_payload_motion.yAcc = value_payload_motion.yAcc.toFixed(2);
          value_payload_motion.zAcc = value_payload_motion.zAcc.toFixed(2);
          value_payload_motion.xGyro = value_payload_motion.xGyro.toFixed(2);
          value_payload_motion.yGyro = value_payload_motion.yGyro.toFixed(2);
          value_payload_motion.zGyro = value_payload_motion.zGyro.toFixed(2);

          let topic_send_AI = "main_server/data_health";
          let msg_send_AI_server = JSON.stringify({
            mac_address: mac_address,
            type: "motion",
            act_sex: accountDocument.pt_gender == "female" ? 1 : 0,
            ...value_payload_motion,
          });

          sendEvent(topic_send_AI, msg_send_AI_server);

          const topic = "response_data_motion/" + deviceDocument._id;
          const msg = JSON.stringify({
            topic: topic_handle,
            device_id: deviceDocument._id,
            value: value_payload_motion,
          });

          sendEventForUser(topic, msg);
        }
      }
    }

    if (topic_handle == "receive_prediction_health") {
      let payload_parse = JSON.parse(payload.toString());
      const topic = "response_predict_health/" + payload_parse.mac_address;

      const msg = JSON.stringify({
        topic: "response_predict_health",
        value: payload_parse,
      });

      sendEventForUser(topic, msg);

      const data = await mailerServices.handleMailWarningHeart(
        payload_parse.mac_address,
        payload_parse
      );

      if (!!data) {
        const topic = "warning_heart_patient";
        let msg = JSON.stringify({
          ml_patient: data.ml_patient,
          ml_device: data.ml_device,
          ml_reasons: data.ml_reasons,
          ml_data_reason: data.ml_data_reason,
        });
        sendEventForUser(topic, msg);
      }
    }

    if (topic_handle == "receive_prediction_motion") {
      let payload_parse = JSON.parse(payload.toString());

      const topic = "response_predict_motion/" + payload_parse.mac_address;

      const msg = JSON.stringify({
        topic: "response_predict_motion",
        value: payload_parse,
      });

      sendEventForUser(topic, msg);

      if (payload_parse.prediction == "fall") {
        const data = await mailerServices.handleMailWarningFall(
          payload_parse.mac_address,
          payload_parse
        );
      }
    }

    if (topic_handle == "receive_prediction_sound") {
      let payload_parse = JSON.parse(payload.toString());

      const topic = "response_predict_sound/" + payload_parse.mac_address;

      const msg = JSON.stringify({
        topic: "response_predict_sound",
        value: payload_parse,
      });

      sendEventForUser(topic, msg);

      // if (payload_parse.prediction == "fall") {
      //   const data = await mailerServices.handleMailWarningFall(
      //     payload_parse.mac_address,
      //     payload_parse
      //   );
      // }
    }

    if (topic_handle == "register_device") {
      let data = JSON.parse(payload.toString());

      await deviceServices.registerNewDocument(data);
    }

    if (topic_handle == "battery_from_esp") {
      let data = JSON.parse(payload.toString());

      const topic = "battery_esp/" + mac_address;
      const msg = JSON.stringify(data);

      sendEventForUser(topic, msg);

      await deviceServices.updatePowerDocument(mac_address, data);
    }
  });
}

function adcToVoltage(adcValue) {
  const referenceVoltage = 3.3;
  const maxADCValue = 4095;

  return (adcValue / maxADCValue) * referenceVoltage;
}

async function sendEventForUser(topic, message) {
  try {
    var options = {
      retain: true,
      qos: 1,
    };
    client.publish(topic, message, options);
    message = JSON.parse(message);
  } catch (error) {}
}

async function sendEvent(topic, message) {
  try {
    var options = {
      retain: true,
      qos: 0,
    };

    await client.publish(topic, message, options);
  } catch (error) {}
}

module.exports = {
  connectMqtt,
  sendEvent,
  sendEventForUser,
};
