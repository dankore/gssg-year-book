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


Emails.prototype.sendCommentSuccessMessage = (
  comments, 
  visitorFirstName,
  visitorEmail,
  photoUrl,
  commentDate,
  comment,
  profileOwnerEmail,
  profileOwnerFirstName,
  profileOwnerLastName
  ) => {
   
  /**
     * EMAIL USERS FOR A SUCCESSFULL COMMENT
     * TODO: OPTIMIZE GETTING EMAIL BY REMOVING [...NEW SET()]
     * @variable [array] info.value.comments
  */
  let emailListFromComments = [];
        
        for (let i = 0; i < comments.length; i++) {
          const currentElement = comments[i];

          // IF CURRENT LOGGED IN USER COMMENT ON THEIR PROFILE. DO NOT SEND HIM/HER EMAIL
          if (profileOwnerEmail == visitorEmail) {
            if (currentElement.visitorEmail !== visitorEmail) {
              emailListFromComments.push(currentElement.visitorEmail);
            };
          } else {
            // IF CURRENT LOGGED IN USER COMMENT ON ANOTHER PROFILE. DO NOT SEND HIM/HER EMAIL
            if (currentElement.visitorEmail !== visitorEmail) {
              emailListFromComments.push(currentElement.visitorEmail);
            };

            emailListFromComments.push(profileOwnerEmail);
          };
        };

      // REMOVE DUPLICATE EMAILS FROM LIST
      emailListFromComments = [...new Set(emailListFromComments)];

   if(emailListFromComments.length > 0){
    for (let i = 0; i < emailListFromComments.length; i++) {
      let data;
      if(emailListFromComments[i] == profileOwnerEmail){
          data = {
          bcc: emailListFromComments[i],
          from: '"GSS Gwarinpa Contact Book 📗" <gssgcontactbook@gmail.com>',
          subject:`${visitorFirstName} commented on your profile`,
          html:  `<div style="width: 320px;">
                  <p>GSS Gwarinpa Contact Book</p>
                    <hr style="margin-bottom: 50px;">
                    <div style="padding: 10px; margin-bottom: 10px; overflow-wrap: break-word; min-width: 0px; width: 300px; background-color: #F2F3F5; border-radius: 5px;">
                      <img src=${photoUrl} style="width: 60px; height: 60px; border-radius: 5px;" alt="profile photo"/>
                      <span>${visitorFirstName}</span> |
                      <em>${commentDate}</em>
                    <p style="font-size: 15px;"><strong>${comment}</strong></p>
                    </div>
                    <a 
                    href="https://www.gssgcontactbook.com/profile/${profileOwnerEmail}" 
                    style="text-decoration: none; padding: 10px; background-color: #38a169; border-radius: 5px; color: white; 
                      font-size: 15px; width: 300px; text-align: center; display:inline-block;">View on GSS Gwarinpa Contact Book
                    </a>
                    <p style="font-size: 10px; margin-top: 15px;">You are receiving this email because you are the owner of the profile that was commented on by ${visitorFirstName}.</p>
                  </div>
                  `
        };
      } else {
          data = {
          bcc: emailListFromComments[i],
          from: '"GSS Gwarinpa Contact Book 📗" <gssgcontactbook@gmail.com>',
          subject:`${visitorFirstName} commented on ${profileOwnerFirstName} ${profileOwnerLastName}'s profile`,
          html:  `<div style="width: 320px;">
                  <p>GSS Gwarinpa Contact Book</p>
                    <hr style="margin-bottom: 50px;">
                    <div style="padding: 10px; margin-bottom: 10px; overflow-wrap: break-word; min-width: 0px; width: 300px; background-color: #F2F3F5; border-radius: 5px;">
                      <img src=${photoUrl} style="width: 60px; height: 60px; border-radius: 5px;" alt="profile photo"/>
                      <span>${visitorFirstName}</span> |
                      <em>${commentDate}</em>
                    <p style="font-size: 15px;"><strong>${comment}</strong></p>
                    </div>
                    <a 
                    href="https://www.gssgcontactbook.com/profile/${profileOwnerEmail}" 
                    style="text-decoration: none; padding: 10px; background-color: #38a169; border-radius: 5px; color: white; 
                      font-size: 15px; width: 300px; text-align: center; display:inline-block;">View on GSS Gwarinpa Contact Book
                    </a>
                    <p style="font-size: 10px; margin-top: 15px;">You are receiving this email because you commented on ${profileOwnerFirstName} ${profileOwnerLastName}'s profile.</p>
                  </div>
                  `
        };
      };
      Emails.prototype.transporter.sendMail(data, (err, info) => {
          if (err) console.log(err);
          else console.log("Comment Success Emails Sent to Profile Owner: " + info.response);
        });
    }
    // END OF 1ST IF
}
  // END OF FUNCTION
};

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
  const data = {
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
  const data = {
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
