
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var auth = require('./auth');
var passport = auth.passport;
var ensureAuthenticated = auth.ensureAuthenticated;

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
  app.use(express.session({secret:'your secret here', store:auth.sessionStore}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.csrf());
  app.use(function(req, res, next) {
    res.locals.csrf_token = req.session._csrf;
    next();
  });
  app.use(app.router);
  app.use(function(err, req, res, next) {
    console.log('error 500');
    console.log(err);
    res.status(err.status || 500);
    res.render('error/500', {title:err.message, error:err});
  });
  app.use(express.static(path.join(__dirname, 'public')));
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
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});