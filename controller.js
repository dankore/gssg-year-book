const User = require("./model");

exports.home = async (req, res) => {
  let profiles = await User.allProfiles();

  res.render("homePage", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.session.user,
    profiles: profiles
  });
};

exports.registrationPage = (req, res) => {
  const registrationErrors = req.flash("reqError");
  res.render("registrationPage", {
    reqErrors: registrationErrors,
    user: req.session.user
  });
};

exports.registrationSubmission = async (req, res) => {
  let user = new User(req.body);

  user
    .register()
    .then(successMessage => {
      req.session.user = {
        email: user.data.email
      };
      req.flash("success", successMessage);
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

exports.login = async (req, res) => {
  let user = new User(req.body);

  user
    .login()
    .then(() => {
      req.session.user = {
        email: user.data.email
      };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch(err => {
      req.flash("errors", err);
      req.session.save(() => {
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
    const visitorIsOwner = User.isVisitorOwner(
      req.session.user.email,
      req.profileUser.email
    );

    if (visitorIsOwner) {
      res.render("profileLoggedInUser", {
        profile: req.profileUser,
        user: req.session.user
      });
    } else {
      res.render("profileGuest", {
        profile: req.profileUser,
        user: req.session.user
      });
    }
  } else {
    res.render("profileGuest", {
      profile: req.profileUser,
      user: req.session.user
    });
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
        user: req.session.user,
        errors: req.flash("errors"),
        profile: profile,
        success: req.flash("success")
      });
    } else {
      req.flash(
        "errors",
        "You did not have permission to  perform that action."
      );
      res.session.save(() => res.redirect("/"));
    }
  } catch {
    res.render("404", { user: req.session.user });
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
      res.render("account", { user: req.session.user });
    } else {
      req.flash("errors", "You do not have permission to perform that action.");
      req.session.save(() => res.redirect("/"));
    }
  } else {
    res.render("404", { user: req.session.user });
  }
};

exports.confirm = function(req, res) {
  if (req.session.user) {
    let visitorIsOwner = User.isVisitorOwner(
      req.session.user.email,
      req.params.email
    );
    if (visitorIsOwner) {
      res.render("confirmDeletePage", { user: req.session.user });
    } else {
      req.flash("errors", "You do not have permission to perform that action.");
      req.session.save(() => res.redirect("/"));
    }
  } else {
    res.render("404", { user: req.session.user });
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

exports.search = async function(req, res) {
  try {
    let searchResultsArray = await User.search(req.body.q);

    res.render("homePage", {
      errors: req.flash("errors"),
      success: req.flash("success"),
      user: req.session.user,
      profiles: searchResultsArray
    });
  } catch {
    req.flash("errors", "Invalid search term.");
    req.session.save(() => res.redirect("/"));
  }
};

exports.privacy = function(req, res) {
  res.render("privacy", { user: req.session.user });
};

exports.changePassword = function(req, res) {
  res.render("changePasswordPage", { user: req.session.user });
};
