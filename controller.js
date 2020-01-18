const router = require('./router');
const User = require('./model');

exports.home = (req, res) => {
  if (req.session.user) {
    res.render('homeDashboard', { email: req.session.user.email })
  } else {
    res.render('home-guest')
  }
}

exports.registrationPage = (req, res) => {
  res.render('registrationPage');
}

exports.registrationSubmission = (req, res) => {
  let user = new User(req.body);
  user.register();

  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Congrats there no errors");
  }
}

exports.login = (req, res) => {
  let user = new User(req.body);
  user.login(function(result){
    res.send(result)
  });
}

