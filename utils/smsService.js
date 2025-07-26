const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ Send Visitor Entry SMS Notification
const sendVisitorSMS = async ({ phone, name, flat, scannedAt }) => {
  const formattedDate = new Date(scannedAt).toLocaleString();
  const message = `Visitor '${name}' for flat ${flat} scanned at gate on ${formattedDate}.`;

  // Ensure valid Indian 10-digit number
  const formattedPhone = phone.startsWith('+') ? phone : '+91' + phone;

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: formattedPhone,
  });
};

module.exports = {
  sendVisitorSMS
};
