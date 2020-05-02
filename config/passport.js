const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');


module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'userName' }, (uName, password, done) => {
      // Check username
      User.findOne({
          userName: uName,
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect Credentials' });
        }
        // check password
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
              console.log(err);
          }
          if (match) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect Credentials' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};