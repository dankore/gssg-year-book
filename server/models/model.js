const usersCollection = require("../../db")
    .db()
    .collection("users"),
  validator = require("validator"),
  bcrypt = require("bcryptjs"),
  crypto = require("crypto"),
  Email = require("../misc/emailNotifications"),
  helpers = require("../misc/helpers"),
  ObjectId = require("mongodb").ObjectID;

// CLASS
let User = class user {
  constructor(data, photo, sessionEmail, requestedEmail) {
    (this.data = data),
      (this.photo = photo),
      (this.errors = []),
      (this.sessionEmail = sessionEmail),
      (this.requestedEmail = requestedEmail);
  }
};
// CLASS ENDS
User.prototype.validateEmail = function() {
  return new Promise(async (resolve, reject) => {
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
  // REMOVE UNWATED CHARACTERS
  (this.data.firstName = this.data.firstName.trim()),
    (this.data.lastName = this.data.lastName.trim()),
    (this.data.email = this.data.email.trim()),
    (this.data.year = this.data.year.trim()),
    (this.data.password = this.data.password);

  // check for empty boxes
  if (this.data.firstName.length == "") {
    this.errors.push("First name cannot be empty.");
  }
  if (this.data.lastName.length == "") {
    this.errors.push("Last name cannot be empty.");
  }

  if (this.data.year.length == "") {
    this.errors.push("Year of graduation is required.");
  }
  if (!validator.isLength(this.data.year, { min: 4, max: 4 })) {
    this.errors.push("Year should be 4 characters in length.");
  }

  // check for non-allowed inputs
  if (this.data.firstName.length > 30) {
    this.errors.push("First name cannot exceed 30 characters.");
  }
  if (
    this.data.firstName.length != "" &&
    !helpers.isAlphaNumericDashHyphen(this.data.firstName)
  ) {
    this.errors.push(
      "First name can only contain letters, dashes, undercores, and numbers."
    );
  }
  if (this.data.lastName.length > 30) {
    this.errors.push("Last name cannot exceed 30 characters.");
  }
  if (
    this.data.lastName.length != "" &&
    !helpers.isAlphaNumericDashHyphen(this.data.lastName)
  ) {
    this.errors.push(
      "Last name can only contain letters, dashes, undercores, and numbers."
    );
  }

  if (this.data.year.length != "" && !validator.isNumeric(this.data.year)) {
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
            // EMAIL WHO LOGINS
            new Email().whoLoggedIn(attemptedUser.firstName);
            // EMAIL WHO LOGINS ENDS
            resolve(attemptedUser.firstName);
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
      // INITIALIZE THE BELOW FOR EACH REGISTERED USER
      this.data.photo = "";
      this.data.comments = [];
      this.data.likes_received_from = [];
      this.data.likes_given_to = [];

      await usersCollection.insertOne(this.data);

      resolve(
        "Success, Up GSS Gwarinpa! Add your photo, nickname, birthday, and more below."
      );
      // EMAIL USER FOR A SUCCESSFULL REGISTRATION
      new Email().regSuccessEmail(this.data.email, this.data.firstName);
      // EMAIL USER FOR A SUCCESSFULL REGISTRATION ENDS
    } else {
      reject(this.errors);
    }
  });
};

User.findByEmail = function(email) {
  return new Promise(function(resolve, reject) {
    if (typeof email != "string") {
      reject("Email not string. Model line 304");
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
            relationship: userDoc.data.relationship,
            comments: userDoc.data.comments,
            totalLikes: userDoc.data.totalLikes,
            likes_received_from: userDoc.data.likes_received_from,
            likes_given_to: userDoc.data.likes_given_to
          };

          resolve(userDoc);
        } else {
          reject("Cannot find one user_by_email Model line 337");
        }
      })
      .catch(() => {
        reject("Cannot find one user_by_email Model line 341");
      });
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
        // DELETE ACCOUNT
        await usersCollection.deleteOne({ email: requestedEmail });
        // NOW DELETE COMMENTS OF THE USER ACROSS ALL DOCS
        await usersCollection.updateMany(
          {},
          { $pull: { comments: { visitorEmail: sessionEmail } } },
          { multi: true }
        );
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
        relationship: eachDoc.relationship,
        comments: eachDoc.comments,
        totalLikes: eachDoc.totalLikes,
        likes_received_from: eachDoc.likes_received_from,
        likes_given_to: eachDoc.likes_given_to
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
                },
                {
                  residence: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  class: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  relationship: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  occupation: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  month: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  day: { $regex: new RegExp(searchedItem, "i") }
                },
                {
                  teacher: { $regex: new RegExp(searchedItem, "i") }
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
            relationship: eachDoc.relationship,
            comments: eachDoc.comments,
            totalLikes: eachDoc.totalLikes,
            likes_received_from: eachDoc.likes_received_from,
            likes_given_to: eachDoc.likes_given_to
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

User.prototype.resetPassword = function(url) {
  return new Promise(async (resolve, reject) => {
    try {
      // CHECK IF EMAIL IS VALID
      if (!validator.isEmail(this.data.reset_password_email)) {
        reject(["This is not a valid email."]);
        return;
      }
      // IF VALID EMAIL CHECK DB
      let userDoc = await usersCollection.findOne({
        email: this.data.reset_password_email.trim()
      });
      // IF DB RETURNS NOTHING, ALERT USER
      if (!userDoc) {
        this.errors.push("No account with that email address exists.");
      }

      // IF NO ERRORS
      if (!this.errors.length) {
        const token = await User.cryptoRandomData();
        const resetPasswordExpires = Date.now() + 3600000; // 1 HOUR EXPIRY
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
        // SEND TOKEN TO USER'S EMAIL
        new Email().sendResetPasswordToken(
          userDoc.email,
          userDoc.firstName,
          url,
          token
        );
        // SEND TOKEN TO USER'S EMAIL ENDs
        resolve(
          `Sucesss! Check your email inbox at ${userDoc.email} for further instruction. Check your SPAM folder too.`
        );
      } else {
        reject(this.errors);
      }
    } catch {
      // TRY BLOCK REJECT
      reject();
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
      reject(
        "Password reset token is invalid or has expired. Please generate another token below."
      );
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
      reject(
        "Password reset token is invalid or has expired. Please generate another token below."
      );
    }
    // HASH USER PASSWORD
    let salt = bcrypt.genSaltSync(10);
    this.data.confirm_new_password = bcrypt.hashSync(
      this.data.confirm_new_password,
      salt
    );
    // IF VALIDATION ERRORS
    if (!this.errors.length) {
      await usersCollection.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            password: this.data.confirm_new_password
          }
        }
      );

      resolve(
        "Password successfully reset. You may now login to your account."
      );
      // SEND CONFIRMATION EMAIL
      new Email().sendResetPasswordConfirmationMessage(
        user.email,
        user.firstName
      );
      // SEND CONFIRMATION EMAIL ENDS

      // SET RESET TOKEN AND EXPIRY TO UNDEFINED
      usersCollection.findOneAndUpdate(
        { resetPasswordToken: token },
        {
          $set: {
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
          }
        }
      );
    } else {
      reject(this.errors);
    }
  });
};

User.doesEmailExists = email => {
  return new Promise(async (resolve, reject) => {
    if (typeof email != "string") {
      resolve(false);
      return;
    }

    let user = await usersCollection.findOne({ email: email });
    if (user) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

// FACEBOOK
User.addSocialUser = data => {
  return new Promise(async (resolve, reject) => {
    try {
      // INITIALIZE THE BELOW PROPERTIES FOR EACH REGISTERED USER
      data.comments = [];
      data.likes_received_from = [];
      data.likes_given_to = [];

      await usersCollection.insertOne(data);

      resolve(
        "Success, Up GSS Gwarinpa! Click 'Edit Profile' to add your nickname, birthday, and more."
      );
      // EMAIL USER FOR A SUCCESSFUL REGISTRATION
      new Email().regSuccessEmail(data.email, data.firstName);
      // EMAIL USER FOR A SUCCESSFUL REGISTRATION ENDS
    } catch {
      reject("There was an issue registering your account. Please try again.");
    }
  });
};

User.sortProfiles = q => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await usersCollection
        .find()
        .sort({ _id: +q })
        .toArray();

      resolve(users);
    } catch {
      reject("Abeg no vex, we are having server issues.");
    }
  });
};

User.validateComment = data => {
  if (data === "") {
    reject("Body of comment cannot be empty.");
    return;
  }
};

// ADD COMMENTS
User.saveComment = data => {
  return new Promise(async (resolve, reject) => {
    // CHECK FOR EMPTY AN COMMENT
    if (!data.comment) return;
    // FIND OWNER OF PROFILEE AND ADD COMMENT
    await usersCollection
      .findOneAndUpdate(
        { email: data.profileEmail },
        {
          $push: {
            comments: {
              commentId: data.commentId,
              comment: data.comment,
              visitorEmail: data.visitorEmail,
              visitorFirstName: data.visitorFirstName,
              photo: data.photo,
              commentDate: data.commentDate
            }
          }
        },
        {
          projection: { comments: 1 },
          returnOriginal: false
        }
      )
      .then(info => {
        const lastCommentDoc =
          info.value.comments[info.value.comments.length - 1];
        resolve(lastCommentDoc);
        // EMAIL USERS FOR A SUCCESSFULL COMMENT
        new Email().sendCommentSuccessMessage(
          info.value.comments,
          data.visitorFirstName,
          data.visitorEmail,
          data.photo,
          data.commentDate,
          data.comment,
          data.profileEmail,
          info.value.firstName,
          info.value.lastName
        );
        //EMAIL USERS FOR A SUCCESSFULL COMMENT ENDS
      })
      .catch(_ => {
        reject("Comment not added. Please try again. @[then/catch]");
      });
  });
};

// UPDATE FIRST NAME IN COMMENTS FOR A USER WHO UPDATES THEIR PROFILE
User.updateCommentFirtName = (email, firstName) => {
  return new Promise(async (resolve, reject) => {
    try {
      await usersCollection.updateMany(
        { "comments.visitorEmail": email },
        {
          $set: {
            "comments.$[elem].visitorFirstName": firstName
          }
        },
        {
          arrayFilters: [{ "elem.visitorEmail": email }],
          multi: true
        }
      );
      resolve();
    } catch {
      reject(err =>
        console.log("Error updating user's comments firstname." + err)
      );
    }
  });
};

// UPDATE A COMMENT
User.updateComment = data => {
  return new Promise(async (resolve, reject) => {
    User.validateComment(data.comment);

    usersCollection
      .findOneAndUpdate(
        { email: data.profileEmail },
        {
          $set: {
            "comments.$[elem].comment": data.comment,
            "comments.$[elem].commentDate": `Updated ${helpers.getMonthDayYear()}, ${helpers.getHMS()}`
          }
        },
        {
          projection: { comments: 1 },
          returnOriginal: false,
          arrayFilters: [
            { "elem.commentId": { $eq: new ObjectId(data.commentId) } }
          ]
        }
      )
      .then(info => {
        // FILTER ONLY THE COMMENT THAT WAS UPDATED
        const commentUpdatedObject = helpers.singlePropArrayFilter(info.value.comments, data.commentId);
        
        resolve(commentUpdatedObject);
      })
      .catch(() => {
        reject("Comment was not updated.");
      });
  });
};
// DELETE A COMMENT
User.deleteComment = (commentId, profileEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      await usersCollection.updateOne(
        { email: profileEmail },
        { $pull: { comments: { commentId: new ObjectId(commentId) } } }
      );
      resolve("Comment deleted.");
    } catch {
      reject("Sorry, comment was not deleted. Please try again.");
    }
  });
};

// LIKES
User.storeLikes = data => {
  return new Promise(async (resolve, reject) => {
    /**
     * IF A USER LIKES PROFILE A, THE EMAIL OF THE USER AND COLOR VALUE
     * ARE STORED IN PROFILE A'S DOCUMENT
     * @EMAIL { @STRING }
     * @COLOR { @VALUES YES/NO }
     */
    // DELETE OLD PROPERTIES
    await usersCollection.updateOne(
      { email: data.profileEmail },
      { $pull: { likes_received_from: { visitorEmail: data.visitorEmail } } }
    );

    // ADD THE NEW PROPERTY TO  PROFILE OWNER
    usersCollection
      .findOneAndUpdate(
        { email: data.profileEmail },
        {
          $push: {
            likes_received_from: {
              color: data.color,
              visitorEmail: data.visitorEmail,
              visitorName: data.visitorName
            }
          },
          $inc: { totalLikes: data.like }
        },
        { returnOriginal: false }
      )
      .then(info => {
        // FILTER ONLY VISITORS INFO
        const visitorInfo = info.value.likes_received_from.filter(
          i => i.visitorEmail == data.visitorEmail
        );
        // ADD TOTALLIKES TO FILTERED OBJECT FROM DB
        visitorInfo[0].totalLikes = info.value.totalLikes;
        /**
         * RESOLVE WITH VISITOR_OBJECT
         * @VISITOR_OBJECT [ {COLOR: VALUE, VISITOREMAIL: VALUE,
         * VISITORNAME: VALUE, TOTALLIKES: VALUE} ]
         */
        resolve(visitorInfo);

        // EMAIL USERS FOR A SUCCESSFULL LIKE ENDS
        new Email().sendLikesSuccessMessage(
          info.value.likes_received_from,
          data.profileEmail,
          data.visitorEmail,
          data.color,
          data.visitorName,
          info.value.firstName,
          info.value.lastName
        );
        // EMAIL USERS FOR A SUCCESSFULL LIKE ENDS
      })
      .catch(_ => {
        reject();
      });
    /**
     * IF A USER LIKES PROFILE A, THE EMAIL OF PROFILE A AND COLOR VALUE
     * ARE STORED IN THE USER'S DOCUMENT
     * @EMAIL { @STRING }
     * @COLOR { @VALUES YES/NO }
     */
    // DELETE OLD PROPERTIES
    await usersCollection.updateOne(
      { email: data.visitorEmail },
      { $pull: { likes_given_to: { profileEmail: data.profileEmail } } }
    );
    // ADD THE NEW PROPERTY TO VISITOR'S PROFILE
    usersCollection.findOneAndUpdate(
      { email: data.visitorEmail },
      {
        $push: {
          likes_given_to: {
            color: data.color,
            profileEmail: data.profileEmail,
            visitorName: data.visitorName
          }
        }
      }
    );
  });
};

// EXPORT CODE
module.exports = User;
