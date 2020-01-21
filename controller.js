const User = require("./model");

exports.home = (req, res) => {
  const loginErrors = req.flash("errors");
  res.render("homePage", {
    errors: loginErrors,
    user: req.session.user
  });
};

exports.registrationPage = (req, res) => {
  const registrationErrors = req.flash("reqError");
  res.render("registrationPage", {
    reqErrors: registrationErrors,
    user: req.session.user
  });
};

exports.registrationSubmission = (req, res) => {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      req.session.user = {
        email: user.data.email
      };
      req.session.save(async function() {
        await res.redirect("/");
      });
    })
    .catch(regErrors => {
      regErrors.forEach(function(error) {
        req.flash("reqError", error);
      });
      req.session.save(async function() {
        await res.redirect("/register");
      });
    });
};

exports.login = (req, res) => {
  let user = new User(req.body);

  user
    .login()
    .then(function() {
      req.session.user = {
        email: user.data.email
      };
      req.session.save(function() {
        res.redirect("/");
      });
    })
    .catch(function(err) {
      req.flash("errors", err);
      req.session.save(function() {
        res.redirect("/");
      });
    });
};

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect("/");
  });
};

exports.ifUserExists = (req, res, next) => {
  User.findByEmail(req.params.email)
    .then(userDoc => {
      req.profileUser = userDoc;
      next();
    })
    .catch(() => {
      res.render("404", { user: req.session.user });
    });
};

exports.profileScreen = (req, res) => {
  if (req.session.user) {
    const requestedEmail = req.profileUser.email;
    const loggedInEmail = req.session.user.email;
    if (requestedEmail === loggedInEmail) {
      res.render("profileLoggedInUser", {
        userProfile: req.profileUser,
        user: req.session.user
      });
    } else {
      res.render("profileGuest", {
        userProfile: req.profileUser,
        user: req.session.user
      });
    }
  } else {
    res.render("profileGuest", {
      userProfile: req.profileUser,
      user: req.session.user
    });
  }
};
