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

Emails.prototype.regSuccessEmail = (email, firstName) => {
  let data = {
    bcc: email,
    from: '"GSS Gwarinpa Contact Book 📗" <gssgcontactbook@gmail.com>',
    subject: `Congratulations, ${firstName}! Registration Success.`,
    html: `<p>Hello <strong>${firstName},</strong></p>
        <p>You have successfully created an account and added your profile to GSS Gwarinpa Contact Book.</p>
        <a 
        href="https://www.gssgcontactbook.com" 
        style="text-decoration: none; padding: 10px; background-color: #38a169; border-radius: 5px; color: white; 
          font-size: 15px; width: 300px; text-align: center; display:inline-block;">Discover GSS Gwarinpa Contact Book
        </a>
        `
  };
  Emails.prototype.transporter.sendMail(data, (err, info) => {
    if (err) console.log(err);
    else console.log("Registration Success Email Sent: " + info.response);
  });
};

Emails.prototype.whoLoggedIn = attemptedUserFirstName => {
  let data = {
    bcc: "adamu.dankore@gmail.com",
    from: '"GSS Gwarinpa Contact Book 📗" <gssgcontactbook@gmail.com>',
    subject: `Login from ${attemptedUserFirstName}`,
    html: `<p><strong>${attemptedUserFirstName}</strong> just logged in.</p>`
  };
  Emails.prototype.transporter.sendMail(data, (err, info) => {
    if (err) console.log(err);
    else console.log("Who logs in email sent: " + info.response);
  });
};

module.exports = Emails;
