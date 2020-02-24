const User = require("../models/model"),
  helpers = require("../misc/helpers");

exports.home = async (req, res) => {
  let profiles = await User.allProfiles();
  profiles.sort((a, b) => a.year - b.year); // SORT BY YEAR DESCENDING
  res.render("homePage", {
    profiles: profiles,
    statsByYear: helpers.statsByYear(profiles)
  });
};

exports.registrationPage = async (req, res) => {
  res.render("registrationPage", {
    reqErrors: req.flash("reqError")
  });
};

exports.registrationSubmission = async (req, res) => {
  let user = new User(req.body);

  user
    .register()
    .then(successMessage => {
      req.session.user = {
        email: user.data.email,
        firstName: "Gosite"
      };
      req.flash("success", successMessage);
      req.session.save(async function() {
        await res.redirect(`profile/${req.session.user.email}/edit`);
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

exports.loginPage = (req, res) => {
  res.render("loginPage");
};

exports.login = async (req, res) => {
  let user = new User(req.body);

  user
    .login()
    .then(() => {
      req.session.user = {
        email: user.data.email,
        firstName: "Gosite"
      };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch(err => {
      req.flash("errors", err);
      req.session.save(() => {
        res.redirect("/login");
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
      res.render("404");
    });
};

exports.profileScreen = (req, res) => {
  if (req.session.user) {
    const visitorIsOwner = User.isVisitorOwner(
      req.session.user.email,
      req.profileUser.email
    );

    if (visitorIsOwner) {
      res.render("profileLoggedInUser", { profile: req.profileUser });
    } else {
      res.render("profileGuest", { profile: req.profileUser });
    }
  } else {
    res.render("profileGuest", { profile: req.profileUser });
  }
};

exports.viewEditScreen = async function(req, res) {
  try {
    let profile = await User.findByEmail(req.session.user.email);

    let isVisitorOwner = User.isVisitorOwner(
      req.session.user.email,
      req.params.email
    );
    if (isVisitorOwner) {
      res.render("editProfilePage", {
        profile: profile
      });
    } else {
      req.flash(
        "errors",
        "You did not have permission to  perform that action."
      );
      res.session.save(() => res.redirect("/"));
    }
  } catch {
    res.render("404");
  }
};

exports.edit = async function(req, res) {
  if (req.session.user) {
    let userInfo = await User.findByEmail(req.session.user.email);
    let imageUrl = userInfo.photo;
    let profile;

    if (req.file) {
      profile = new User(
        req.body,
        req.file.location,
        req.session.user.email,
        req.params.email
      );
    } else {
      profile = new User(
        req.body,
        imageUrl,
        req.session.user.email,
        req.params.email
      );
    }

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
          req.session.save(() => {
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

exports.account = function(req, res) {
  if (req.session.user) {
    let visitorIsOwner = User.isVisitorOwner(
      req.session.user.email,
      req.params.email
    );
    if (visitorIsOwner) {
      res.render("account");
    } else {
      req.flash("errors", "You do not have permission to perform that action.");
      req.session.save(() => res.redirect("/"));
    }
  } else {
    res.render("404");
  }
};

exports.delete = function(req, res) {
  User.delete(req.params.email, req.session.user.email)
    .then(() => {
      req.flash("success", "Account successfully deleted.");
      req.session.destroy(() => res.redirect("/"));
    })
    .catch(() => {
      req.flash("errors", "You do not have permission to perform that action.");
      req.session.save(() => res.redirect("/"));
    });
};

exports.search = async (req, res) => {
  try {
    console.log("controler 217 " + req.body.q);
    let searchResultsArray = await User.search(req.body.q);

    res.render("homePage", {
      profiles: searchResultsArray,
      statsByYear: helpers.statsByYear(searchResultsArray)
    });
  } catch {
    req.flash("errors", "Invalid search term.");
    req.session.save(() => res.redirect("/"));
  }
};

exports.privacy = function(req, res) {
  res.render("privacy");
};

exports.changePasswordPage = function(req, res) {
  res.render("changePasswordPage");
};

exports.changePassword = function(req, res) {
  let user = new User(req.body, null, req.session.user.email, req.params.email);

  user
    .updatePassword()
    .then(successMessage => {
      req.flash("success", successMessage);
      req.session.save(() =>
        res.redirect(`/account/${req.params.email}/change-password`)
      );
    })
    .catch(errors => {
      errors.forEach(error => {
        req.flash("errors", error);
      });
      req.session.save(() =>
        res.redirect(`/account/${req.params.email}/change-password`)
      );
    });
};

exports.resetPasswordPage = function(req, res) {
  res.render("resetPasswordPage");
};

exports.resetPassword = function(req, res) {
  let user = new User(req.body);

  user
    .resetPassword(req.headers.host)
    .then(successMessage => {
      req.flash("success", successMessage);
      res.redirect("/reset-password");
    })
    .catch(errors => {
      errors.forEach(error => {
        req.flash("errors", error);
      });

      res.redirect("/reset-password");
    });
};

exports.resetPasswordTokenPage = function(req, res) {
  let user = User.resetTokenExpiryTest(req.params.token);

  user
    .then(() => {
      res.render("resetTokenPage", {
        token: req.params.token
      });
    })
    .catch(error => {
      req.flash("errors", error);
      res.redirect("/reset-password");
    });
};

exports.resetPasswordToken = function(req, res) {
  let user = new User(req.body);

  user
    .resetToken(req.params.token)
    .then(message => {
      req.flash("success", message);
      res.redirect("/");
    })
    .catch(error => {
      req.flash("errors", error);
      res.redirect(`/reset-password/${req.params.token}`);
    });
};
// AXIOS
exports.doesEmailExists = async (req, res) => {
  let emailBool = await User.doesEmailExists(req.body.email);
  res.json(emailBool);
};

//FACEBOOK LOGIN
exports.facebookLogin = async (req, res) => {
  if (req.user.returningUser) {
    req.session.user = {
      email: req.user.email
    };
    req.session.save(async () => {
      await res.redirect("/");
    });
  } else {
    await User.addSocialUser(req.user)
      .then(successMessage => {
        req.flash("success", successMessage);
        req.session.user = {
          email: req.user.email
        };
        req.session.save(async () => {
          await res.redirect("/");
        });
      })
      .catch(error => {
        req.flash("errors", error);
        req.session.save(async () => {
          await res.redirect("/register");
        });
      });
  }
};

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  if (req.user.returningUser) {
    req.session.user = {
      email: req.user.email
    };
    req.session.save(async () => {
      await res.redirect("/");
    });
  } else {
    await User.addSocialUser(req.user)
      .then(successMessage => {
        req.flash("success", successMessage);
        req.session.user = {
          email: req.user.email
        };
        req.session.save(async _ => {
          await res.redirect("/");
        });
      })
      .catch(error => {
        req.flash("errors", error);
        req.session.save(async _ => {
          await res.redirect("/register");
        });
      });
  }
};

exports.twitterLogin = async (req, res) => {
  if (req.user.returningUser) {
    req.session.user = {
      email: req.user.email
    };
    req.session.save(async () => {
      await res.redirect("/");
    });
  } else {
    await User.addSocialUser(req.user)
      .then(successMessage => {
        req.flash("success", successMessage);
        req.session.user = {
          email: req.user.email
        };
        req.session.save(async _ => {
          await res.redirect("/");
        });
      })
      .catch(error => {
        req.flash("errors", error);
        req.session.save(async _ => {
          await res.redirect("/register");
        });
      });
  }
};

exports.sort = (req, res) => {
  User.sortProfiles(req.body.q)
    .then(profiles => {
      res.render("homePage", {
        profiles: profiles,
        statsByYear: helpers.statsByYear(profiles)
      });
    })
    .catch(errorMessage => {
      req.flash("errors", errorMessage);
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

// IF USER VISITS ANY URL THAT DON'T EXISTS ON THIS APP.
// REDIRECT TO 404 PAGE
exports.notFound = (req, res) => {
  res.status(404).render("404");
};
