const express = require("express"),
      session = require("express-session"),
      MongoStore = require("connect-mongo")(session),
      flash = require("connect-flash"),
      server = express(),
      bodyParser = require("body-parser"),
      router = require("./router"),
      compression = require("compression"),
      User = require("./models/model");

let sessionOptions = session({
  secret: "Mental Model Programming",
  store: new MongoStore({ client: require("../db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
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
server.use('/favicon.ico', express.static('public/favicon.ico'));
server.use((req, res, next) => {
  // Make all available from all templates
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  
  next();
});
// SEO
server.use("/profile/:email", (req, res, next)=>{
  User.findByEmail(req.params.email).then((userDoc)=>{
      userDoc.url = "https://www.gssgcontactbook.com" + req.originalUrl
      res.locals.seo = userDoc
  }).catch((err)=>{
      console.log(err);
  });
  next()
})
// SEO ENDS

server.use("/register", async (req, res, next)=>{
    let allProfiles = await User.allProfiles();
    console.log(allProfiles.length)
    var m = allProfiles.length,
      t,
      i;
    // GET PHOTO URLs
    const photoUrlArray = allProfiles
                        .filter(profile => profile.photo !='')
    console.log(photoUrlArray.length)

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = photoUrlArray[m];
      photoUrlArray[m] = photoUrlArray[i];
      photoUrlArray[i] = t;
    }
    // RETURN ONLY THE FIRST 20 URLs
    res.locals.photoUrl = photoUrlArray.slice(0, 10);
    next()
})


server.use(router);

module.exports = server;
