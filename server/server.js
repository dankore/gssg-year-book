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
  passport = require("passport"),
  GoogleStrategyMiddleware = require("./middlewares/google.passport"),
  FacebookStrategyMiddleware = require("./middlewares/facebook.passport");

// PASSPORT
server.use(GoogleStrategyMiddleware); // GOOGLE

server.use(FacebookStrategyMiddleware); // FACEBOOK

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
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true } // COOKIES EXPIRE2 IN 14 DAYS
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
