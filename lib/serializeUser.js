const passport = require("passport");

const serializeUser = () => {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
};

module.exports = serializeUser;
