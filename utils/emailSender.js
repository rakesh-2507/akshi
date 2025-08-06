const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // e.g. your@gmail.com
    pass: process.env.EMAIL_PASS      // App password
  }
});

// ✅ Send OTP Email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Apartment App',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Send Visitor Scanned Email
const sendVisitorScannedEmail = async ({ to, name, flat, scannedAt }) => {
  const formattedDate = new Date(scannedAt).toLocaleString();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Visitor Entry Scanned - ${name}`,
    text: `Your visitor '${name}' for flat ${flat} was scanned at the gate on ${formattedDate}.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOtpEmail,
  sendVisitorScannedEmail
};
