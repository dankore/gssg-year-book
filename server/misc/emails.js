const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

let Emails = class emails {
  constructor(bcc, from, subject, html) {
    this.bcc = bcc;
    this.from = from;
    this.subject = subject;
    this.html = html;
  }
  
};
Emails.prototype.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gssgcontactbook@gmail.com",
    pass: process.env.GMAILPW
  }
});

Emails.prototype.sendHi = () => {
  let data = {
  bcc: "adamu.dankore@gmail.com",
  from: "adamu.dankore@gmail.come",
  subject: "Hi, from Email",
  html: "<strong>Body of email hello hello!!!! </strong>"
};
Emails.prototype.transporter.sendMail(data);
}



module.exports = Emails;
