const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/", controller.home);
router.get("/register", controller.registrationPage);
router.post("/register", controller.registrationSubmission);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

router.get("/profile/:id", controller.ifUserExists, controller.profileScreen);

module.exports = router;
