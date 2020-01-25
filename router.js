const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/", controller.home);
router.get("/register", controller.registrationPage);
router.post("/register", controller.registrationSubmission);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

router.get("/profile/:email", controller.ifUserExists, controller.profileScreen);
router.get('/profile/:email/edit', controller.viewEditScreen)
router.post("/profile/:email/edit", controller.edit);

router.get("/account/:email", controller.account)
router.post("/account/:email/delete", controller.delete);

// SEARCH
router.post("/", controller.search);
module.exports = router;
