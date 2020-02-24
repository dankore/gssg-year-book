const express = require("express");
const router = express.Router();
const controller = require("./controllers/controller");
const upload = require("./misc/file-upload");
const singleUpload = upload.single("photo");
const photoUrls = require("./middlewares/photo_urls");
const passport = require('passport');

// HOME, REGISTER, LOGIN
router.get("/", controller.home);
router.get("/register", photoUrls, controller.registrationPage);
router.post("/register", controller.registrationSubmission);
router.get("/login", controller.loginPage)
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
router.post("/account/:email/delete", controller.delete);
router.get("/account/:email/change-password", controller.changePasswordPage);
router.post("/account/:email/change-password", controller.changePassword);

// RESET PASSWORD
router.get("/reset-password", controller.resetPasswordPage);
router.post("/reset-password", controller.resetPassword);
router.get("/reset-password/:token", controller.resetPasswordTokenPage)
router.post("/reset-password/:token", controller.resetPasswordToken);

// SEARCH
router.post("/", controller.search);
router.post("/sort", controller.sort)

// PRIVACY
router.get("/privacy", controller.privacy);

// AXIOS
router.post("/doesEmailExists", controller.doesEmailExists);

//FACEBOOK
router.get('/fb-login', passport.authenticate('facebook', {scope:"email"}));
router.get('/fb-login/callback', passport.authenticate('facebook', {failureRedirect: '/register' }), controller.facebookLogin);

// GOOGLE
router.get("/google-login", passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']}));
router.get("/google-login/callback", passport.authenticate('google', {failureRedirect: '/register' }), controller.googleLogin)

// TWITTER
router.get("/twitter-login", passport.authenticate('twitter'));
router.get('/twitter-login/callback', passport.authenticate('twitter', {failureRedirect: '/register' }), controller.twitterLogin);

router.get("*", controller.notFound)
// EXPORT CODE
module.exports = router;
