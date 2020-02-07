// NODEMAILER
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gssgcontactbook@gmail.com",
    pass: process.env.GMAILPW
  }
});

// NODEMAILER ENDS
