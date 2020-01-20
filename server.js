const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const server = express();

let sessionOptions = session({
  secret: "JavaScript is soooo cool",
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

server.use(sessionOptions);
server.use(flash());
const router = require("./router");

// app.use(function(req, res, next) {
//   if(req.session.user){
//       req.visitorId = req.session.user._id
//   }  else {
//       req.visitorId = 0
//   }
//   res.locals.user = req.session.user;
//   next();
// });
server.set("views", "view");
server.set("view engine", "ejs");
server.use(express.static("./public"));

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use(router);

module.exports = server;
