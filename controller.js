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
  user.register()
    .then(() => {
      console.log("success!")
    })
    .catch(() => {
      console.log("failure!")
    })

  res.send("Thank for for submitting your profile!");
}

exports.login = (req, res) => {
  let user = new User(req.body);
  user.login()
    .then(() => {
      req.session.user = {
        email: user.data.email,
        _id: user.data._id
      };
      req.session.save(function () {
        res.redirect("/");
      });
      // res.send("Login successful")
    })
    .catch(err => res.send("Login failed!"))
}
exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/')
  })
}

