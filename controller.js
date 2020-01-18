const User = require('./model');

exports.home = (req, res) => {
  res.render('homePage', {user: req.session.user})
}

exports.registrationPage = (req, res) => {
  res.render('registrationPage', {user: req.session.user});
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