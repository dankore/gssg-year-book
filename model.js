
let User = class user {
  constructor(fn, ln){
    this.fn = fn,
    this.ln = ln,
    this.fullName = () => {
      return this.fn + " " + this.ln;
    }
  }
};

module.exports = User;