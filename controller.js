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

exports.viewEditScreen = async function(req, res) {
  const saveErrors = req.flash("errors");
  try {
    let profile = await User.findByEmail(req.params.email);
    res.render("editProfilePage", {
      user: req.session.user,
      errors: saveErrors,
      profile: profile
    });
  } catch {
    res.render("404", { user: req.session.user });
  }
};

exports.edit = function(req, res) {
  if (req.session.user) {
    let profile = new User(req.body, req.session.user.email, req.params.email);
    profile
      .update()
      .then(status => {
        if (status == "success") {
          req.flash("success", "Profile successfully updated.");
          req.session.save(function() {
            res.redirect(`/profile/${req.params.email}/edit`);
          });
        } else {
          profile.errors.forEach(error => {
            req.flash("errors", error);
          });
          req.session.save(function() {
            res.redirect(`/profile/${req.params.email}/edit`);
          });
        }
      })
      .catch(() => {
        req.flash(
          "errors",
          "You do not have permission to perform that action."
        );
        res.redirect("/");
      });
  } else {
    req.flash("errors", "You must be logged in to perform that action.");
    res.redirect("/");
  }
};
