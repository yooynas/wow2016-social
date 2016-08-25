var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../../app/models/user');

module.exports = function() {
  
  // The serialize function is used to return the ID of the user
  passport.serializeUser(function(user, done) {
    done(null, user.profile.username);
  });
  
  // The deserialize function is used to find the profile of the user by the passed in id
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, profile) {
        done(null, profile);
    });
  });

  // Specify the name attributes of the login form here
  passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: true
    },
    function(username, password, done) {
      // This function will be called once the id is actually found
      // There are 4 options, error, no user, incorrect password or authenticated.  
      User.findById(username, function(err, user) {
        if (err) { return done(null, false, { message: err }); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.checkPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
}