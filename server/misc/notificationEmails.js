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

Emails.prototype.sendResetPasswordConfirmationMessage = (email, firstName) => {
  const data = {
    bcc: email,
    from: '"GSS Gwarinpa Contact Book 📗" <gssgcontactbook@gmail.com>',
    subject:`${firstName}, You Successfully Reset Your Password - GSS Gwarinpa Contact Book`,
    html:  `Hello ${firstName},` +
          "<br><br>" +
          `This is a confirmation that the password for your account <strong>${email}</strong> has just been changed.\n` +
          "<br><br>" +
          "If you did not reset your password, secure your account by resetting your password:\n" +
          '<a href="https://www.gssgcontactbook.com/reset-password">Reset your password</a>'
  };
  Emails.prototype.transporter.sendMail(data, (err, info) => {
    if (err) console.log(err);
    else console.log("Reset Password Confirmation Sent Via Email: " + info.response);
  });
};


Emails.prototype.sendResetPasswordToken = (email, firstName, url, token) => {
  const data = {
    bcc: email,
    from: '"GSS Gwarinpa Contact Book 📗" <gssgcontactbook@gmail.com>',
    subject:`${firstName}, Reset Your Password - GSS Gwarinpa Contact Book`,
    html:  `Hello ${firstName},` +
            "<br><br>" +
            "Please click on the following link to complete the process:\n" +
            '<a href="https://' +
            url +
            "/reset-password/" +
            token +
            '">Reset your password</a><br>' +
            "OR" +
            "<br>" +
            "Paste the below URL into your browser to complete the process:" +
            "<br>" +
            "https://" +
            url +
            "/reset-password/" +
            token +
            "<br><br>" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
  };
  Emails.prototype.transporter.sendMail(data, (err, info) => {
    if (err) console.log(err);
    else console.log("Reset Password Token Sent Via Email: " + info.response);
  });
};


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
