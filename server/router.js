const express = require("express");
const router = express.Router();
const controller = require("./controllers/controller");
const upload = require("./file-upload");
const singleUpload = upload.single("photo");

// HOME, REGISTER, LOGIN
router.get("/", controller.home);
router.get("/register", controller.registrationPage);
router.post("/register", controller.registrationSubmission);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

// PROFILE
router.get(
  "/profile/:email",
  controller.ifUserExists,
  controller.profileScreen
);
router.get("/profile/:email/edit", controller.viewEditScreen);
router.post("/profile/:email/edit", singleUpload, controller.edit);

// ACCOUNT
router.get("/account/:email", controller.account);
router.get("/account/:email/confirm", controller.confirm);
router.post("/account/:email/delete", controller.delete);
router.get("/account/:email/change-password", controller.changePasswordPage);
router.post("/account/:email/change-password", controller.changePassword);

// RESET PASSWORD
router.get("/reset-password", controller.resetPasswordPage);
router.post("/reset-password", controller.resetPassword);

// SEARCH
router.post("/", controller.search);

// PRIVACY
router.get("/privacy", controller.privacy);

// EXPORT CODE
module.exports = router;
