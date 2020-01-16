const usersCollection = require('./db').db().collection("users");

let User = class user {
  constructor(data) {
    this.data = data
  }
};

User.prototype.cleanUp = function(){
  if(!this.data.firstName.length){
    return false;
  }
}

User.prototype.register = function () {
  if(this.cleanUp() !== false){
    usersCollection.insertOne(this.data)
  }
}

module.exports = User;