
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var SessionMongoose = require('session-mongoose');
var mongooseSessionStore = new SessionMongoose({
  url:'mongodb://localhost:27017/todo'
  , interval: 6000
});
var User = require('./models').User;

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


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({secret:'your secret here', store:mongooseSessionStore}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use(function(err, req, res, next) {
    console.log('error 500');
    console.log(err);
    res.status(err.status || 500);
    res.render('error/500', {title:err.message, error:err});
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', ensureAuthenticated, routes.index);
app.post('/create', ensureAuthenticated, routes.create);
app.get('/finish/:id', ensureAuthenticated, routes.finish);
app.get('/delete/:id', ensureAuthenticated, routes.delete);

app.get('/login', routes.login);
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info){
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', {title:'Login', username:req.body.username, message:'Invalid username or password.'});
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});
app.get('/logout', function(req, res) {
  req.logOut();
  req.session.destroy();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};