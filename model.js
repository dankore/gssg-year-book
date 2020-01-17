const usersCollection = require('./db').db().collection("users");
const validator = require('validator');

let User = class user {
  constructor(data) {
    this.data = data,
    this.errors = []
  }
};

User.prototype.validateUserRegistration = function(){
  return new Promise(async (resolve, reject) =>{
     // check for empty boxes
    if(this.data.firstName.length == ""){
      this.errors.push("First name is required.")
    }
    if(this.data.lastName.length == ""){
      this.errors.push("Last name is required.")
    }
    if(this.data.email.length == ""){
      this.errors.push("Email is required.")
    }
    if(this.data.password.length == ""){
      this.errors.push("Password is required.")
    }

    // check for non-allowed inputs
    if(this.data.firstName.length != "" && !validator.isAlphanumeric(this.data.firstName)){
      errors.push("First name can only contain letters and numbers.")
    }
    if(this.data.firstName.length != "" && !validator.isAlphanumeric(this.data.lastName)){
      errors.push("Last name can only contain letters and numbers.")
    }
    if(this.data.firstName.length != "" && !validator.isEmail(this.data.email)){
      errors.push("Email can only contain letters and numbers.")
    }

    // check to see if email is valid and not taken
    if(validator.isEmail(this.data.email)){
      let emailExist = await usersCollection.findOne({email: this.data.email});

      if(emailExist){
        errors.push("That email is already been used.")
      }
    }
    resolve();
  });
 
}

User.prototype.cleanUp = function(){
  if(typeof this.data.firstName != 'string'){
    this.data.firstName.length = "";
  }
  if(typeof this.data.lastName != 'string'){
    this.data.lastName.length = "";
  }
  if(typeof this.data.email != 'string'){
    this.data.email = "";
  }
}

User.prototype.register = function () {
  return new Promise(async(resolve, reject) => {
    this.cleanUp();
    await this.validateUserRegistration();

    if(!this.errors.length){
      await usersCollection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
    
  })
 
}

module.exports = User;