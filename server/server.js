// require('dotenv').config();
const express = require("express"),
  session = require("express-session"),
  MongoStore = require("connect-mongo")(session),
  flash = require("connect-flash"),
  server = express(),
  bodyParser = require("body-parser"),
  router = require("./router"),
  compression = require("compression"),
  User = require("./models/model"),
  controller = require("./controllers/controller"),
  passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy,
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// PASSPORT

// GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: "https://www.gssgcontactbook.com/google-login/callback"
    },
    function(accessToken, refreshToken, user, cb) {
      User.doesEmailExists(user._json.email)
        .then(userBool => {
          console.log("Server 29. New user: " + userBool);
          if (userBool) {
            // USER EXISTS. LOG IN
            // CLEAN UP
            user = {
              email: user._json.email,
              returningUser: true
            };
            return cb(null, user);
          } else {
            // NEW USER. REGISTER
            // CLEAN UP
            user = {
              google_id: user._json.sub,
              firstName: user._json.given_name,
              lastName: user._json.family_name,
              email: user._json.email,
              year: "1988?",
              photo: user._json.picture // END
            };
            return cb(null, user);
          }
        })
        .catch(err => {
          console.log("Server 58 " + err);
        });
    }
  )
);

// FACEBOOK
passport.use(
  new FacebookStrategy(
    {
      clientID: `${process.env.FB_CLIENT_ID}`,
      clientSecret: `${process.env.FB_CLIENT_SECRET}`,
      callbackURL: "https://www.gssgcontactbook.com/fb-login/callback",
      profileFields: ["id", "first_name", "last_name", "email", "profile_pic"],
      enableProof: true
    },

    function(accessToken, refreshToken, user, cb) {
      // CHECK IF fbUser exist in database
      User.doesEmailExists(user._json.email)
        .then(userBool => {
          if (userBool) {
            // USER EXISTS IN DB. LOG IN
            // CLEAN UP DATA
            user = {
              email: user._json.email,
              returningUser: true
            };
            return cb(null, user);
          } else {
            // NEW USER. REGISTER
            // CLEAN UP DATA
            user = {
              facebook_id: user._json.id,
              firstName: user._json.first_name,
              lastName: user._json.last_name,
              email: user._json.email,
              class: "1984?",
              photo: user._json.profile_pic // INITIALIZE PHOTO WITH EMPTY. OTHERWISE BUG HAPPENS
            };
            return cb(null, user);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

server.use(passport.initialize());
server.use(passport.session());
//PASSPORT ENDS

// EXPRESS SESSIONS
let sessionOptions = session({
  secret: "Mental Model Programming",
  store: new MongoStore({ client: require("../db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true } // COOKIES EXPIRES IN 14 DAYS
});

server.set("views", "view");
server.set("view engine", "ejs");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(sessionOptions);
server.use(flash());
server.use(compression());
server.use("/favicon.ico", express.static("public/favicon.ico"));
server.use(async (req, res, next) => {
  // Make all available from all templates
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  // IF PATH IS HOMEPAGE SHOW SCROLL-TO-TOP
  res.locals.path = req.originalUrl;
  // GET FIRST NAME
  if (req.session.user) {
    User.findByEmail(req.session.user.email)
      .then(userDoc => {
        res.locals.first_name_welcome = userDoc.firstName;
      })
      .catch(err => {
        console.log("Server line 153 " + err);
      });
  }
  next();
});

// SEO
server.use("/profile/:email", (req, res, next) => {
  User.findByEmail(req.params.email)
    .then(userDoc => {
      userDoc.url = "https://www.gssgcontactbook.com" + req.originalUrl;
      res.locals.seo = userDoc;
    })
    .catch(err => {
      console.log("Server line 167 " + err);
    });
  next();
});
// SEO ENDS

server.use(router);

module.exports = server;
