const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const server = express();
const bodyParser = require("body-parser");
const router = require("./router");
const compression = require("compression");

let sessionOptions = session({
  secret: "JavaScript is soooo cool",
  store: new MongoStore({ client: require("../db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

server.use(sessionOptions);
server.use(flash());
server.use(compression());
server.use('/favicon.ico', express.static('public/favicon.ico'));
server.use((req, res, next) => {
  // Make all error and success flash messsages available from all templates
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  // Make user session data from within view templates
  res.locals.user = req.session.user;
  next();
});

server.use(bodyParser.urlencoded({ extended: true }));

server.set("views", "view");
server.set("view engine", "ejs");
server.use(express.static("public"));

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use(router);

module.exports = server;
