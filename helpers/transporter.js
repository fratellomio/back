const { createTransport } = require('nodemailer');

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.usermail,
    pass: process.env.passwordmail,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
