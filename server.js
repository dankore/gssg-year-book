const express = require('express');
const server = express();
const router = require('./router');


server.set("views", "view");
server.set("view engine", "ejs");

server.use(express.urlencoded({ extended: false }))
server.use(express.json());

server.use(router);

module.exports = server;
