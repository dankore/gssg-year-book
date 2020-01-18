const User = require('./model');

exports.home = (req, res) => {
  const loginErrors = req.flash('errors');
  res.render('homePage', { errors: loginErrors, user: req.session.user})
}

exports.registrationPage = (req, res) => {
 const registrationErrors = req.flash("reqError")
  res.render('registrationPage', { reqErrors: registrationErrors, user: req.session.user });
}

exports.registrationSubmission = (req, res) => {
  let user = new User(req.body);
  user.register();

  if (user.errors.length) {
    user.errors.forEach(function (error) {
      req.flash('reqError', error)
    })
    req.session.save(async function(){
     await res.redirect('/register')
    })
  } else {
    res.send("Congrats there no errors.");
  }

}

exports.login = (req, res) => {
  let user = new User(req.body);

  user.login().then(function (result) {
    req.session.user = {
      email: user.data.email,
    }
    req.session.save(function () {
      res.redirect("/");
    });
  })
    .catch(function (err) {
      req.flash("errors", err);
      req.session.save(function () {
        res.redirect("/");
      });
    });
}

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/')
  })

}