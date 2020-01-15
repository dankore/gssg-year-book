const express  = require('express');
const app = express();
const port = 8080;
const router = require('./router');

// app.use(express.json());
app.set("views", "view")
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(router)
app.listen(port, ()=> console.log("Listening on port " + port))