const User = require('./model');

exports.home = (req, res) => {
  if (req.session.user) {
    res.render('homeDashboard', { email: req.session.user.email})
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
    res.send("Congrats there no errors.");
  }
}

exports.login = (req, res) => {
  let user = new User(req.body);

  user.login().then(function(result){
    req.session.user = {
      email: user.data.email,
      fav: "color"
    }
    res.redirect('/')
  }).catch(function(err){
    res.send(err)
  })
}

exports.logout = function(req, res){
  req.session.destroy()
  res.redirect('/')
  
}