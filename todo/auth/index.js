var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models').User;

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({user_id:username}, function(err, user) {
    if (err) {
      return done(err);
    }
    
    if (!user) {
      return done(null, false, {message: 'Invalid username or password.'});
    }
    
    if (!user.validPassword(password)) {
      return done(null, false, {message: 'Invalid username or password.'});
    }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({_id:id}, function(err, user) {
    done(err, user);
  });
});

exports.passport = passport;
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};