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
  passport = require('passport'),
  Strategy = require('passport-facebook').Strategy

// PASSPORT 
passport.use(new Strategy({
    clientID: `${process.env.FB_CLIENT_ID}`,
    clientSecret: `${process.env.FB_CLIENT_SECRET}`,
    callbackURL: "https://gssg-contact-book.dankore.repl.co/fb-login/callback",
    profileFields: ['id', 'first_name', 'last_name', 'email'],
    enableProof: true
  },
  
  async function (accessToken, refreshToken, user, cb) {
    // CHECK IF fbUser exist in database
    let userBool = await User.doesEmailExists(user._json.email)
    if(userBool){
      // CLEAN UP DATA
      user = {
        firstName: user._json.first_name,
        lastName: user._json.last_name,
        email: user._json.email,
        returningUser: true
      }
      return cb(null, user);
    } else {
      // CLEAN UP DATA
      user = {
        firstName: user._json.first_name,
        lastName: user._json.last_name,
        email: user._json.email,
        photo: ""
      }
      return cb(null, user)
    }
  }
));

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
server.use((req, res, next) => {
  // Make all available from all templates
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  // IF PATH IS HOMEPAGE SHOW SCROLL-TO-TOP
  res.locals.path = req.originalUrl;
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
      console.log(err);
    });
  next();
});
// SEO ENDS

server.use(router);

module.exports = server;
