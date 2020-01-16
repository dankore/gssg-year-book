const express = require('express');
const server = express();
const router = require('./router');

// server.use(express.json());
server.set("views", "view")
server.set("view engine", "ejs")
server.use(express.urlencoded({ extended: true }))
server.use(router)

module.exports = server;
