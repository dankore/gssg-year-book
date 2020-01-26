const express = require("express");
const router = express.Router();
const controller = require("./controller");

// IMAGE UPLOAD \\

const multer = require("multer");
const path = require("path");


var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/static");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

var upload = multer({
  storage: storage
});


// IMAGE UPLOAD ENDS \\


router.get("/", controller.home);
router.get("/register", controller.registrationPage);
router.post("/register", controller.registrationSubmission);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

router.get("/profile/:email", controller.ifUserExists, controller.profileScreen);
router.get('/profile/:email/edit', controller.viewEditScreen)
router.post("/profile/:email/edit", upload.single('photo'), controller.edit);

router.get("/account/:email", controller.account)
router.post("/account/:email/delete", controller.delete);

// SEARCH
router.post("/", controller.search);
module.exports = router;
