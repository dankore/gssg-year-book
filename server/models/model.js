const usersCollection = require("../../db")
  .db()
  .collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRIDAPIKEY);

let User = class user {
  constructor(data, photo, sessionEmail, requestedEmail) {
    (this.data = data),
      (this.photo = photo),
      (this.errors = []),
      (this.sessionEmail = sessionEmail),
      (this.requestedEmail = requestedEmail);
  }
};

User.prototype.validateEmail = function() {
  return new Promise(async (resolve, reject) => {
    // remove spaces
    this.data.email.trim();

    if (this.data.email.length == "") {
      this.errors.push("Email is required.");
    }
    if (this.data.email.length != "" && !validator.isEmail(this.data.email)) {
      this.errors.push(
        "Email can only contain letters and numbers. No spaces as well."
      );
    }
    // if email is valid, check to see if it is taken
    if (validator.isEmail(this.data.email)) {
      let emailExist = await usersCollection.findOne({
        email: this.data.email
      });
      if (emailExist) {
        this.errors.push("That email is already taken.");
      }
    }
    resolve();
  });
};
User.prototype.validatePassword = function() {
  // check for empty box
  if (this.data.password.length == "") {
    this.errors.push("Password is required.");
  }
  //check for length
  if (!validator.isLength(this.data.password, { min: 6, max: 50 })) {
    this.errors.push("Password should be at least 6 characters.");
  }
};
User.prototype.editValidation = function() {
  // check for non-allowed inputs
  // IF NOT EMPTY
  if (("" + this.data.phone).length != "") {
    if (!validator.isMobilePhone(this.data.phone)) {
      this.errors.push("Phone number must be valid.");
    }
  }
  if (!validator.isLength(this.data.nickname, { min: 0, max: 50 })) {
    this.errors.push("Nickname must be less than 50 characters.");
  }
  if (!validator.isLength(this.data.residence, { min: 0, max: 50 })) {
    this.errors.push("Place of residence must be less than 50 characters.");
  }
  if (!validator.isLength(this.data.occupation, { min: 0, max: 50 })) {
    this.errors.push("Occupation must be less than 50 characters.");
  }
  // IF NOT EMPTY
  if (this.data.class != "") {
    if (!validator.isAlphanumeric(this.data.class.trim())) {
      this.errors.push(
        "Class can only contain letters and numbers. No spaces as well."
      );
    }
    if (!validator.isLength(this.data.class, { min: 0, max: 20 })) {
      this.errors.push("Class must be less than 20 characters.");
    }
  }
  if (this.data.link_social_type_1 != "") {
    if (!validator.isURL(this.data.link_social_type_1)) {
      this.errors.push("Social media link #1 must be a valid web address.");
    }
  }
  if (this.data.social_type_1 == "" && this.data.link_social_type_1 != "") {
    this.errors.push(
      "Social Media Type #1 cannot be blank if Link to Social Media Type #1 has a value."
    );
  }
  if (this.data.social_type_1 != "" && this.data.link_social_type_1 == "") {
    this.errors.push(
      "Link to Social Media Type #1 cannot be blank if Social Media Type #1 has a value."
    );
  }
  if (this.data.month == "" && this.data.day != "") {
    this.errors.push(
      "Month of Birth cannot be blank if Day of Birth has a value."
    );
  }
  if (this.data.link_social_type_2 != "") {
    if (!validator.isURL(this.data.link_social_type_2)) {
      this.errors.push("Social media link #2 must be a valid web address.");
    }
  }
  if (this.data.social_type_2 == "" && this.data.link_social_type_2 != "") {
    this.errors.push(
      "Social Media Type #2 cannot be blank if Link to Social Media Type #2 has a value."
    );
  }
  if (this.data.social_type_2 != "" && this.data.link_social_type_2 == "") {
    this.errors.push(
      "Link to Social Media Type #2 cannot be blank if Social Media Type #2 has a value."
    );
  }
  if (this.data.teacher != "") {
    if (typeof this.data.teacher != "string") {
      this.errors.push("Name of favorite teacher can only be letters.");
    }
    if (!validator.isLength(this.data.teacher, { min: 0, max: 50 })) {
      this.errors.push(
        "Name of favorite teacher must be less than 50 characters."
      );
    }
  }
  if (this.data.day != "") {
    if (!validator.isNumeric(this.data.day)) {
      this.errors.push("Day of Birth can only be numbers.");
    }
  }
  // END
};
User.prototype.validateSomeUserRegistrationInputs = function() {
  // check for empty boxes
  if (this.data.firstName.length == "") {
    this.errors.push("First name is required.");
  }
  if (this.data.lastName.length == "") {
    this.errors.push("Last name is required.");
  }

  if (this.data.year.trim().length == "") {
    this.errors.push("Year of graduation is required.");
  }
  if (!validator.isLength(this.data.year.trim(), { min: 4, max: 4 })) {
    this.errors.push("Year should be 4 characters in length.");
  }

  // check for non-allowed inputs
  if (
    this.data.firstName.length != "" &&
    !validator.isAlphanumeric(this.data.firstName.trim())
  ) {
    this.errors.push(
      "First name can only contain letters and numbers. No spaces as well."
    );
  }
  if (
    this.data.lastName.length != "" &&
    !validator.isAlphanumeric(this.data.lastName.trim())
  ) {
    this.errors.push(
      "Last name can only contain letters and numbers. No spaces as well."
    );
  }

  if (
    this.data.year.trim().length != "" &&
    !validator.isNumeric(this.data.year.trim())
  ) {
    this.errors.push("Year can only be numbers.");
  }
};

User.prototype.login = function() {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    // CHECK IF NO EMAIL IS PROVIDED
    if (this.data.email == "" && this.data.password != "") {
      reject("Please provide an email address.");
    }
    // CHECK IF NO EMAIL AND PASSWORD ARE PROVIDED
    if (this.data.email == "" && this.data.password == "") {
      reject("Please provide an email address and a password.");
    }

    usersCollection
      .findOne({ email: this.data.email })
      .then(attemptedUser => {
        // IF NO MATCHING EMAIL FOUND
        if (!attemptedUser) {
          reject(
            "That email has not been registered. Click 'Add Your Profile' above to register."
          );
        }
        // IF MATCHING EMAIL FOUND
        if (attemptedUser) {
          if (attemptedUser && this.data.password == "") {
            reject("Please enter a password.");
          }
          // IF USER WITH EMAIL ADDRESS FOUND
          if (
            attemptedUser &&
            bcrypt.compareSync(this.data.password, attemptedUser.password)
          ) {
            resolve();
          } else {
            reject("Invalid password!");
          }
        }
      })
      .catch(() => {
        reject("Please try again later.");
      });
  });
};

User.prototype.cleanUp = function() {
  if (typeof this.data.firstName != "string") {
    this.data.firstName = "";
  }
  if (typeof this.data.lastName != "string") {
    this.data.lastName = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
};

User.prototype.register = function() {
  return new Promise(async (resolve, reject) => {
    //Make sure email is string
    this.cleanUp();
    // Validate user data
    this.validateSomeUserRegistrationInputs();
    // check password
    this.validatePassword();
    // check to see if email is taken
    await this.validateEmail();

    // Only if there no validation error
    // then save the user data into the database
    if (!this.errors.length) {
      // Hash user password
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      this.data.photo = "";
      await usersCollection.insertOne(this.data);
      resolve(
        "Success! Remember to Edit Your Profile to add more info. Up GSS Gwarinpa!"
      );
    } else {
      reject(this.errors);
    }
  });
};

User.findByEmail = function(email) {
  return new Promise(function(resolve, reject) {
    try {
      if (typeof email != "string") {
        reject();
        return;
      }
      usersCollection
        .findOne({ email: email })
        .then(userDoc => {
          if (userDoc) {
            userDoc = new User(userDoc);

            userDoc = {
              _id: userDoc.data._id,
              firstName: userDoc.data.firstName,
              lastName: userDoc.data.lastName,
              year: userDoc.data.year,
              email: userDoc.data.email,
              nickname: userDoc.data.nickname,
              photo: userDoc.data.photo,
              residence: userDoc.data.residence,
              class: userDoc.data.class,
              occupation: userDoc.data.occupation,
              teacher: userDoc.data.teacher,
              month: userDoc.data.month,
              day: userDoc.data.day,
              phone: userDoc.data.phone,
              social_type_1: userDoc.data.social_type_1,
              link_social_type_1: userDoc.data.link_social_type_1,
              social_type_2: userDoc.data.social_type_2,
              link_social_type_2: userDoc.data.link_social_type_2,
              relationship: userDoc.data.relationship
            };

            resolve(userDoc);
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    } catch {
      reject();
    }
  });
};

User.prototype.update = function() {
  return new Promise(async (resolve, reject) => {
    try {
      let profile = await User.findByEmail(this.requestedEmail);

      const visistorIsOwner = User.isVisitorOwner(
        this.sessionEmail,
        profile.email
      );
      if (visistorIsOwner) {
        //Update
        let status = await this.actuallyUpdate();

        resolve(status);
      } else {
        reject();
      }
    } catch {
      reject();
    }
  });
};

User.prototype.actuallyUpdate = function() {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validateSomeUserRegistrationInputs();
    this.editValidation();

    if (!this.errors.length) {
      await usersCollection.findOneAndUpdate(
        { email: this.requestedEmail },
        {
          $set: {
            firstName: this.data.firstName,
            lastName: this.data.lastName,
            email: this.data.email,
            year: this.data.year,
            nickname: this.data.nickname,
            photo: this.photo,
            residence: this.data.residence,
            class: this.data.class,
            occupation: this.data.occupation,
            teacher: this.data.teacher,
            month: this.data.month,
            day: this.data.day,
            phone: this.data.phone,
            social_type_1: this.data.social_type_1,
            link_social_type_1: this.data.link_social_type_1,
            social_type_2: this.data.social_type_2,
            link_social_type_2: this.data.link_social_type_2,
            relationship: this.data.relationship
          }
        }
      );
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};

User.isVisitorOwner = function(sessionEmail, requestedEmail) {
  return sessionEmail == requestedEmail;
};

User.delete = function(requestedEmail, sessionEmail) {
  return new Promise(async (resolve, reject) => {
    try {
      let visistorIsOwner = User.isVisitorOwner(requestedEmail, sessionEmail);
      if (visistorIsOwner) {
        await usersCollection.deleteOne({ email: requestedEmail });
        resolve();
      } else {
        reject();
      }
    } catch {
      reject();
    }
  });
};

User.allProfiles = function() {
  return new Promise(async (resolve, reject) => {
    let allProfiles = await usersCollection.find({}).toArray();

    allProfiles = allProfiles.map(eachDoc => {
      //clean up each document
      eachDoc = {
        firstName: eachDoc.firstName,
        lastName: eachDoc.lastName,
        year: eachDoc.year,
        email: eachDoc.email,
        nickname: eachDoc.nickname,
        photo: eachDoc.photo,
        residence: eachDoc.residence,
        class: eachDoc.class,
        occupation: eachDoc.occupation,
        teacher: eachDoc.teacher,
        month: eachDoc.month,
        day: eachDoc.day,
        phone: eachDoc.phone,
        social_type_1: eachDoc.social_type_1,
        link_social_type_1: eachDoc.link_social_type_1,
        social_type_2: eachDoc.social_type_2,
        link_social_type_2: eachDoc.link_social_type_2,
        relationship: eachDoc.relationship
      };
      return eachDoc;
    });
    resolve(allProfiles);
  });
};

User.search = async function(searchedItem) {
  return new Promise(async (resolve, reject) => {
    try {
      usersCollection.createIndex({
        firstName: "text",
        lastName: "text",
        year: "text"
      });
      if (typeof searchedItem === "string") {
        let searchedResult = await usersCollection
          .find(
            {
              $or: [
                {
                  firstName: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  lastName: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  year: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  email: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  nickname: { $regex: new RegExp(searchedItem, "i") }
                }
              ]
            },
            {
              $project: { score: { $meta: "textScore" } },
              $sort: { score: { $meta: "textScore" } }
            }
          )
          .toArray();

        searchedResult = searchedResult.map(eachDoc => {
          //clean up each document
          eachDoc = {
            firstName: eachDoc.firstName,
            lastName: eachDoc.lastName,
            year: eachDoc.year,
            email: eachDoc.email,
            photo: eachDoc.photo,
            nickname: eachDoc.nickname,
            residence: eachDoc.residence,
            class: eachDoc.class,
            occupation: eachDoc.occupation,
            teacher: eachDoc.teacher,
            month: eachDoc.month,
            day: eachDoc.day,
            phone: eachDoc.phone,
            social_type_1: eachDoc.social_type_1,
            link_social_type_1: eachDoc.link_social_type_1,
            social_type_2: eachDoc.social_type_2,
            link_social_type_2: eachDoc.link_social_type_2,
            relationship: eachDoc.relationship
          };
          return eachDoc;
        });

        resolve(searchedResult);
      } else {
        reject();
      }
    } catch {
      reject();
    }
  });
};
User.prototype.passwordChangeValidatation = function() {
  return new Promise(async (resolve, reject) => {
    if (this.data.old_password == "") {
      this.errors.push("Please enter your old password.");
    }
    if (this.data.new_password == "") {
      this.errors.push("Please enter your new password.");
    }
    if (this.data.confirm_new_password == "") {
      this.errors.push("Please confirm your new password.");
    }
    if (!validator.isLength(this.data.new_password, { min: 6, max: 50 })) {
      this.errors.push("New password must be at least 6 characters.");
    }
    if (this.data.new_password !== this.data.confirm_new_password) {
      this.errors.push("New passwords do not match.");
    }
    if (this.data.old_password) {
      // FIND OLD PASSWORD AND COMPARE WITH INPUTED OLD PASSWORD
      let userDoc = await usersCollection.findOne({
        email: this.sessionEmail
      });

      if (!bcrypt.compareSync(this.data.old_password, userDoc.password)) {
        this.errors.push("Old passwords do not match.");
      }
    }
    resolve();
  });
};

User.prototype.updatePassword = function() {
  return new Promise(async (resolve, reject) => {
    this.passwordChangeValidatation();
    // FIND OLD PASSWORD AND COMPARE WITH NEW PASSWORD
    let userDoc = await usersCollection.findOne({ email: this.sessionEmail });

    if (!this.errors.length) {
      // Hash user password
      let salt = bcrypt.genSaltSync(10);
      this.data.confirm_new_password = bcrypt.hashSync(
        this.data.confirm_new_password,
        salt
      );
      await usersCollection.findOneAndUpdate(
        { email: this.sessionEmail },
        {
          $set: {
            password: this.data.confirm_new_password
          }
        }
      );
      resolve("Password successfully updated.");
    } else {
      reject(this.errors);
    }
  });
};

// STATS : gets year of graduation from each profile. Return the data.
User.statsByYear = function(allProfiles) {
  let yearsArray = allProfiles.map(item => item.year);
  let obj = {};
  let result = [];

  for (var i = 0; i < yearsArray.length; i++) {
    !obj.hasOwnProperty(yearsArray[i])
      ? (obj[yearsArray[i]] = 1)
      : (obj[yearsArray[i]] += 1);
  }

  for (var prop in obj) {
    obj[prop] > 1
      ? result.push(`${prop}: ${obj[prop]} profiles`)
      : result.push(`${prop}: ${obj[prop]} profile`);
  }

  return result;
};
User.prototype.resetPassword = function(url) {
  return new Promise(async (resolve, reject) => {
    let userDoc = await usersCollection.findOne({
      email: this.data.reset_password
    });
    if (!userDoc) {
      this.errors.push("No account with that email address exists.");
    }

    if (userDoc) {
      const token = await User.cryptoRandomData();
      const resetPasswordExpires = Date.now() + 3600000; // 1 hour
      // ADD TOKEN AND EXPIRY TO DB
      await usersCollection.findOneAndUpdate(
        { email: userDoc.email },
        {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: resetPasswordExpires
          }
        }
      );
      // SEND EMAIL
      const msg = {
        to: "adamu.dankore@gmail.com",
        from: "adamu.dankore@gmail.com",
        subject: "Reset Your Password - GSS Gwarinpa Contact Book",
        html:
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          '<a href="http://' +
          url +
          "/reset-password/" +
          token +
          '">Verify your Account</a>\n\n' +
          "paste the below URL into your browser to complete the process\n" +
          "COMING SOON\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n"
      };
      sendgrid.send(msg);
      // SEND EMAIL ENDs

      resolve(
        `Sucesss! Check your email ${userDoc.email} for further instruction.`
      );
    } else {
      reject(this.errors);
    }
  });
};

User.cryptoRandomData = function() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (buf) {
        var token = buf.toString("hex");
        resolve(token);
      } else {
        reject(err);
      }
    });
  });
};

User.resetTokenExpiryTest = function(token) {
  return new Promise(async (resolve, reject) => {
    let user = await usersCollection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      reject("Password reset token is invalid or has expired.");
    }
    if (user) {
      resolve();
    }
  });
};

User.prototype.passwordResetValidatation = function() {
  if (this.data.new_password == "") {
    this.errors.push("Please enter a new password.");
  }
  if (!validator.isLength(this.data.new_password, { min: 6, max: 50 })) {
    this.errors.push("New password must be at least 6 characters.");
  }
  if (this.data.new_password != this.data.confirm_new_password) {
    this.errors.push("Passwords do not match.");
  }
};

User.prototype.resetToken = function(token) {
  return new Promise(async (resolve, reject) => {
    // CHECK FOR ERRORS
    this.passwordResetValidatation();
    // IS TOKEN IN DB AND NOT EXPIRED?
    let user = await usersCollection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      reject("Password reset token is invalid or has expired.");
    }
    // Hash user password
    let salt = bcrypt.genSaltSync(10);
    this.data.confirm_new_password = bcrypt.hashSync(
      this.data.confirm_new_password,
      salt
    );
    if (!this.errors.length) {
      await usersCollection.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            password: this.data.confirm_new_password
          }
        }
      );
    } else {
      reject(this.errors);
    }
    resolve("Password successfully reset.");
  });
};

// EXPORT CODE
module.exports = User;
