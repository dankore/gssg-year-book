const express = require('express');
const session = require('express-session');
const server = express();


let sessionOptions = session({
    secret: "JavaScript is soooo cool",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

server.use(sessionOptions);
const router = require('./router');


server.set("views", "view");
server.set("view engine", "ejs");

server.use(express.urlencoded({ extended: false }))
server.use(express.json());

server.use(router);

module.exports = server;
