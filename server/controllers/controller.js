const User = require("../models/model"),
  helpers = require("../misc/helpers"),
  sanitizeHMTL = require("sanitize-html"),
  ObjectId = require("mongodb").ObjectID;

exports.home = async (req, res) => {
  let profiles = await User.allProfiles();
  // SORT BY TOTAL NUMBER OF COMMENTS AND LIKES
  profiles = helpers.sortProfiles(profiles);
  res.render("homePage", {
    profiles: profiles,
    statsByYear: helpers.statsByYear(profiles)
  });
};

exports.registrationPage = async (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("registrationPage", {
      reqErrors: req.flash("reqError")
    });
  }
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
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("loginPage");
  }
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
        res.redirect("/login");
      });
    });
};

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect("/");
  });
};

exports.getProfile = async (req, res) => {
  const profileEmail = helpers.getEmailFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL
  await User.findByEmail(profileEmail)
    .then(userDoc => {
      res.json(userDoc.likes_received_from);
    })
    .catch(() => {
      res.render("404");
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

exports.mustBeLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("errors", "Must be login to perform that action.");
    req.session.save(_ => {
      res.redirect("/");
    });
  }
};

exports.isVisitorOwner = (req, res, next) => {
  const visitorIsOwner = User.isVisitorOwner(
    req.session.user.email,
    req.params.email
  );
  if (visitorIsOwner) {
    next();
  } else {
    req.flash("errors", "You do not have permission to perform that action.");
    req.session.save(_ => res.redirect("/"));
  }
};

exports.profileScreen = (req, res) => {
  if (req.session.user) {
    // FILTER ONLY likes_received_from BELONGING TO THE SESSION USER
    const propExists = req.profileUser.likes_received_from
      ? req.profileUser.likes_received_from.filter(
          prop => prop.visitorEmail == req.session.user.email
        )
      : [];
    if (propExists.length > 0) {
      req.profileUser.color = propExists[0].color;
    }
    // FILTER ONLY likes_received_from BELONGING TO THE SESSION USER ENDS
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
  let profile = await User.findByEmail(req.session.user.email);
  res.render("editProfilePage", { profile: profile });
};

exports.edit = async (req, res) => {
  const userInfo = await User.findByEmail(req.session.user.email);
  const imageUrl = userInfo.photo;
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
    .then(async status => {
      if (status == "success") {
        req.flash("success", "Profile successfully updated.");
        req.session.save(async _ => {
          await res.redirect(`/profile/${req.params.email}/edit`);
        });
        // UPDATE USER COMMENTS INFO ACROSS ALL COMMENTS
        const userInfo = await User.findByEmail(req.session.user.email);
        User.updateCommentFirtName(userInfo.email, userInfo.firstName);
        // UPDATE USER COMMENTS END
      } else {
        profile.errors.forEach(error => {
          req.flash("errors", error);
        });
        req.session.save(async _ => {
          await res.redirect(`/profile/${req.params.email}/edit`);
        });
      }
    })
    .catch(() => {
      req.flash("errors", "You do not have permission to perform that action.");
      res.redirect("/");
    });
};

// NOT FOUND PAGE
exports.notFound = (req, res) => {
  res.status(404).render("404");
};

exports.account = (req, res) => {
  res.render("account");
};

exports.account.delete = (req, res) => {
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
    let searchResultsArray = await User.search(req.body.q);
    // SORT BY TOTAL NUMBER OF COMMENTS AND LIKES
    searchResultsArray = helpers.sortProfiles(searchResultsArray);
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

exports.resetPasswordPage = (req, res) => {
  req.session.user ? res.redirect("/") : res.render("resetPasswordPage");
};

exports.resetPassword = (req, res) => {
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

exports.resetPasswordTokenPage = (req, res) => {
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

exports.resetPasswordToken = (req, res) => {
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

// REDIRECT TO HOME IF USERS TRY TO LOAD '/SORT' PAGE SINCE IT DOEN NOT EXISTS
exports.sortGet = (req, res) => {
  res.redirect("/");
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
// COMMENTS
exports.addComment = async (req, res) => {
  const profileEmail = helpers.getEmailFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL
  const userDoc = await User.findByEmail(req.session.user.email);
  const commentDate = helpers.getMonthDayYear() + ", " + helpers.getHMS();
  // GET RID OF BOGUS AND SANITIZE DATA
  const data = {
    commentId: new ObjectId(),
    comment: req.body.comment,
    visitorEmail: req.session.user.email,
    visitorFirstName: userDoc.firstName,
    profileEmail: profileEmail,
    photo: userDoc.photo,
    commentDate: commentDate
  };

  User.saveComment(data)
    .then(response => {
      res.json(response);
    })
    .catch(errorMessage => {
      req.flash("errors", errorMessage);
      req.session.save(async _ => {
        await res.redirect(`profile/${profileEmail}`);
      });
    });
};

// UPDATE A COMMENT
exports.editComment = (req, res) => {
  const profileEmail = helpers.getEmailFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL
  // GET RID OF BOGUS AND SANITIZE DATA
  const data = {
    commentId: req.body.commentId,
    comment: req.body.comment,
    profileEmail: profileEmail
  };
console.log(data);
  User.updateComment(data)
    .then(response => {
      res.json(response);
    })
    .catch(errorMessage => {
      req.flash("errors", errorMessage);
      req.session.save(async _ => {
        await res.redirect(`profile/${profileEmail}`);
      });
    });
};

// DELETE A COMMENT
exports.deleteComment = (req, res) => {
  const profileEmail = helpers.getEmailFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL

  User.deleteComment(req.body.commentId, profileEmail)
    .then(successMessage => {
      req.flash("success", successMessage);
      req.session.save(async _ => {
        await res.redirect(`profile/${profileEmail}`);
      });
    })
    .catch(errorMessage => {
      req.flash("errors", errorMessage);
      req.session.save(async _ => {
        await res.redirect(`profile/${profileEmail}`);
      });
    });
};

// LIKES
exports.likes = async (req, res) => {
  const profileEmail = helpers.getEmailFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL
  const userDoc = await User.findByEmail(req.session.user.email);
  // TODO: ADD _ID TO EACH LIKE
  const data = {
    like: req.body.like,
    color: req.body.color,
    visitorEmail: req.session.user.email,
    visitorName: `${userDoc.firstName} ${userDoc.lastName}`,
    profileEmail: profileEmail
  };
  User.storeLikes(data)
    .then(response => {
      res.json(response);
    })
    .catch(_ => {
      req.flash(
        "errors",
        "Sorry, we are having issues with the Like button. Please try again."
      );
      req.session.save(
        async _ => await res.redirect(`profile/${profileEmail}`)
      );
    });
};
