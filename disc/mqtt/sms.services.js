const twilio = require("twilio");

const accountSid = "ACd38b91412603afdc481d9d5ac0db8c28";
const authToken = "6b0b40202b0d7bdac24a58b225a67e54";

const client = new twilio(accountSid, authToken);

async function sendSms(to, message) {
  try {
    const messageResponse = await client.messages.create({
      body: message,
      from: "+12513602083",
      to: to,
    });

    console.log("Message sent:", to, messageResponse);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = {
  sendSms: sendSms,
};
