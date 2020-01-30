const usersCollection = require("./db")
  .db()
  .collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
      this.errors.push("Email can only contain letters and numbers.");
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
  if (this.data.password.length < 4 || this.data.password.length > 32) {
    this.errors.push("Password should be between 4 and 32 characters.");
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
  // IF NOT EMPTY
  if (this.data.link_social_type_1 != "") {
    if (!validator.isURL(this.data.link_social_type_1)) {
      this.errors.push("Social media link #1 must be a valid web address.");
    }
  }

  if (this.data.link_social_type_2 != "") {
    if (!validator.isURL(this.data.link_social_type_2)) {
      this.errors.push("Social media link #2 must be a valid web address.");
    }
  }
};
User.prototype.validateSomeUserRegistrationInputs = function() {
  // check for empty boxes
  if (this.data.firstName.length == "") {
    this.errors.push("First name is required.");
  }
  if (this.data.lastName.length == "") {
    this.errors.push("Last name is required.");
  }

  if (String(this.data.year).length == "") {
    this.errors.push("Year of graduation is required.");
  }

  if (String(this.data.year).length < 4) {
    this.errors.push("Year should not be less than 4 numbers.");
  }
  if (String(this.data.year).length > 4) {
    this.errors.push("Year should not be greater than 4 numbers.");
  }

  // check for non-allowed inputs
  if (
    this.data.firstName.length != "" &&
    !validator.isAlphanumeric(this.data.firstName)
  ) {
    this.errors.push("First name can only contain letters and numbers.");
  }
  if (
    this.data.firstName.length != "" &&
    !validator.isAlphanumeric(this.data.lastName)
  ) {
    this.errors.push("Last name can only contain letters and numbers.");
  }

  if (
    String(this.data.year).length != "" &&
    !validator.isNumeric(this.data.year)
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
      resolve();
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
              residence: userDoc.residence,
              class: userDoc.class,
              occupation: userDoc.occupation,
              teacher: userDoc.teacher,
              month: userDoc.month,
              day: userDoc.day,
              social_type_1: userDoc.social_type_1,
              link_social_type_1: userDoc.link_social_type_1,
              social_type_2: userDoc.social_type_2,
              link_social_type_2: userDoc.link_social_type_2
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
            residence: this.residence,
            class: this.class,
            occupation: this.occupation,
            teacher: this.teacher,
            month: this.month,
            day: this.day,
            social_type_1: this.social_type_1,
            link_social_type_1: this.link_social_type_1,
            social_type_2: this.social_type_2,
            link_social_type_2: this.link_social_type_2
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
        residence: userDoc.residence,
        class: userDoc.class,
        occupation: userDoc.occupation,
        teacher: userDoc.teacher,
        month: userDoc.month,
        day: userDoc.day,
        social_type_1: userDoc.social_type_1,
        link_social_type_1: userDoc.link_social_type_1,
        social_type_2: userDoc.social_type_2,
        link_social_type_2: userDoc.link_social_type_2
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
            residence: userDoc.residence,
            class: userDoc.class,
            occupation: userDoc.occupation,
            teacher: userDoc.teacher,
            month: userDoc.month,
            day: userDoc.day,
            social_type_1: userDoc.social_type_1,
            link_social_type_1: userDoc.link_social_type_1,
            social_type_2: userDoc.social_type_2,
            link_social_type_2: userDoc.link_social_type_2
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
module.exports = User;
