const usersCollection = require('./db').db().collection("users");
const validator = require('validator');
const bcrypt = require('bcryptjs');

let User = class user {
  constructor(data) {
    this.data = data,
      this.errors = []
  }
};

User.prototype.validateUserRegistration = function () {
  return new Promise(async (resolve, reject) => {
    // check for empty boxes
    if (this.data.firstName.length == "") {
      this.errors.push("First name is required.")
    }
    if (this.data.lastName.length == "") {
      this.errors.push("Last name is required.")
    }
    if (this.data.email.length == "") {
      this.errors.push("Email is required.")
    }
    if (this.data.password.length == "") {
      this.errors.push("Password is required.")
    }
    if (this.data.year.length == "") {
      this.errors.push("Year of graduation is required.")
    }
    // check for length
    if (this.data.password.length < 4 || this.data.password.length > 32) {
      this.errors.push("Password should be between 4 and 32 characters.")
    }
    if (String(this.data.year).length < 4) {
      this.errors.push("Year should not be less than 4 characters.")
    }
    if (String(this.data.year).length > 4) {
      this.errors.push("Year should not be greater than 4 characters.")
    }

    // check for non-allowed inputs
    if (this.data.firstName.length != "" && !validator.isAlphanumeric(this.data.firstName)) {
      this.errors.push("First name can only contain letters and numbers.")
    }
    if (this.data.firstName.length != "" && !validator.isAlphanumeric(this.data.lastName)) {
      this.errors.push("Last name can only contain letters and numbers.")
    }
    if (this.data.email.length != "" && !validator.isEmail(this.data.email)) {
      this.errors.push("Email can only contain letters and numbers.")
    }
    if (this.data.year.length != "" && !validator.isNumeric(this.data.year)) {
      this.errors.push("Year can only be numbers.")
    }

    // if email is valid, check to see if it is taken
    if (validator.isEmail(this.data.email)) {
      let emailExist = await usersCollection.findOne({ email: this.data.email });
      if (emailExist) { this.errors.push('That email is already taken.') }
    }
    resolve()
  })
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    usersCollection.findOne({ email: this.data.email }).then((attemptedUser) => {
      if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
        resolve("Congrats!")
      } else {
        reject("Invalid email/password!")
      }
    }).catch(() => {
      reject("Please try again later.")
    })
  })
}

User.prototype.cleanUp = function () {
  if (typeof this.data.firstName != 'string') {
    this.data.firstName = "";
  }
  if (typeof this.data.lastName != 'string') {
    this.data.lastName = "";
  }
  if (typeof this.data.email != 'string') {
    this.data.email = "";
  }
}

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    //Make sure email is string
    this.cleanUp()
    // Step #1: Validate user data
    await this.validateUserRegistration();

    // Step #2: Only if there no validation error
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

  })
}

module.exports = User;