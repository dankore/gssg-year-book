const usersCollection = require("./db")
  .db()
  .collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");

let User = class user {
  constructor(data, sessionEmail, requestedEmail) {
    (this.data = data),
      (this.errors = []),
      (this.sessionEmail = sessionEmail),
      (this.requestedEmail = requestedEmail);
  }
};

User.prototype.validateEmail = function() {
  return new Promise(async (resolve, reject) => {
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

User.prototype.validateUserRegistration = function() {
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
    this.errors.push("Year should not be less than 4 characters.");
  }
  if (String(this.data.year).length > 4) {
    this.errors.push("Year should not be greater than 4 characters.");
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
    usersCollection
      .findOne({ email: this.data.email })
      .then(attemptedUser => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          resolve("Congrats!");
        } else {
          reject("Invalid email/password!");
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
    this.validateUserRegistration();
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
      await usersCollection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

User.findByEmail = function(email) {
  return new Promise(function(resolve, reject) {
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
            email: userDoc.data.email
          };

          resolve(userDoc);
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
};

User.prototype.update = function() {
  return new Promise(async (resolve, reject) => {
    try {
      let profile = await User.findByEmail(this.requestedEmail);

      const requestedEmailUser = profile.email;
      const sessionEmailUser = this.sessionEmail;

      if (requestedEmailUser === sessionEmailUser) {
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
    this.validateUserRegistration();

    if (!this.errors.length) {
      await usersCollection.findOneAndUpdate(
        { email: this.requestedEmail },
        {
          $set: {
            firstName: this.data.firstName,
            lastName: this.data.lastName,
            email: this.data.email,
            year: this.data.year
          }
        }
      );
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};

module.exports = User;
