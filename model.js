const usersCollection = require('./db').db().collection("users");
const validator = require('validator');
const bcryptjs = require('bcryptjs');

let User = class user {
  constructor(data) {
    this.data = data,
      this.errors = []
  }
};

User.prototype.validateUserRegistration = function () {
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

    // check for non-allowed inputs
    if (this.data.firstName.length != "" && !validator.isAlphanumeric(this.data.firstName)) {
      this.errors.push("First name can only contain letters and numbers.")
    }
    if (this.data.firstName.length != "" && !validator.isAlphanumeric(this.data.lastName)) {
      this.errors.push("Last name can only contain letters and numbers.")
    }
    if (this.data.firstName.length != "" && !validator.isEmail(this.data.email)) {
      this.errors.push("Email can only contain letters and numbers.")
    }

    // check to see if email is valid and not taken

}

User.prototype.login = function(callback){
  this.cleanUp();
  usersCollection.findOne({email: this.data.email}, (err, attemptedUser) => {
    if(attemptedUser && attemptedUser.password == this.data.password){
      callback("Congrats!")
    } else {
      callback("Invalid email/password!")
    }
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
    //Make sure username is string
    this.cleanUp()
    // Step #1: Validate user data
    this.validateUserRegistration();

    // Step #2: Only if there no validation error
    // then save the user data into the database
    if (!this.errors.length) {
        // Hash user password
        // let salt = bcrypt.genSaltSync(10);
        // this.data.password = bcrypt.hashSync(this.data.password, salt)
        usersCollection.insertOne(this.data)
    }

}

module.exports = User;