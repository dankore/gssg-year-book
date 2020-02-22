const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

module.exports = function GoogleStrategyMiddleware(req, res, next){
    passport.use(
      new GoogleStrategy(
        {
          clientID: `${process.env.GOOGLE_CLIENT_ID}`,
          clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
          callbackURL: "https://www.gssgcontactbook.com/google-login/callback"
        },
        function(accessToken, refreshToken, user, cb) {
          User.doesEmailExists(user._json.email)
            .then(userBool => {
              console.log("Server 29. New user: " + userBool);
              if (userBool) {
                // USER EXISTS. LOG IN
                // CLEAN UP
                user = {
                  email: user._json.email,
                  returningUser: true
                };
                return cb(null, user);
              } else {
                // NEW USER. REGISTER
                // CLEAN UP
                user = {
                  google_id: user._json.sub,
                  firstName: user._json.given_name,
                  lastName: user._json.family_name,
                  email: user._json.email,
                  year: "1988?",
                  photo: user._json.picture // END
                };
                return cb(null, user);
              }
            })
            .catch(err => {
              console.log("Server 58 " + err);
            });
        }
      )
    );
    next();
}
