const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function FacebookStrategyMiddleware(req, res, next) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: `${process.env.FB_CLIENT_ID}`,
        clientSecret: `${process.env.FB_CLIENT_SECRET}`,
        callbackURL: "https://www.gssgcontactbook.com/fb-login/callback",
        profileFields: ["id", "first_name", "last_name", "email"],
        enableProof: true
      },

      function(accessToken, refreshToken, user, cb) {
        // CHECK IF fbUser exist in database
        User.doesEmailExists(user._json.email)
          .then(userBool => {
            if (userBool) {
              // USER EXISTS IN DB. LOG IN
              // CLEAN UP DATA
              user = {
                email: user._json.email,
                returningUser: true
              };
              return cb(null, user);
            } else {
              // NEW USER. REGISTER
              // CLEAN UP DATA
              user = {
                firstName: user._json.first_name,
                lastName: user._json.last_name,
                email: user._json.email,
                year: "1984?",
                photo: "" // INITIALIZE PHOTO WITH EMPTY. OTHERWISE BUG HAPPENS
              };
              return cb(null, user);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    )
  );
  next();
};
