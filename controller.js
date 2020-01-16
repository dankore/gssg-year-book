const router = require('./router');
const User = require('./model')

exports.home = (req, res) => {
  res.render('home-guest')
}

exports.registrationPage = (req, res) => {
  res.render('register');
}
exports.registrationSubmission = (req, res) => {
  let user = new User(req.body);
  user.register();
  res.send("Thank for for submitting your profile!");
}


