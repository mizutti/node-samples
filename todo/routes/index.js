var Todo = require('../models').Todo;

exports.index = function(req, res, next) {
  Todo.find({user_id:req.user._id, finished:false}, function(err, todos) {
    if (err) {
      return next(err);
    }
    res.render('list', { title:'Todo List', todos:todos});
  });
};

exports.create = function(req, res, next) {
  var todo = new Todo(req.body.todo);
  todo.user_id = req.user._id;
  todo.save(function(err) {
    if (err) {
      if (err.name !== 'ValidationError') {
        return next(err);
      }
      Todo.find({finished:false}, function(error, todos) {
        if (error) {
          return next(error);
        }
        return res.render('list', { title:'Todo List', todos:todos, errors:err.errors});
      });
    } else {
      // elseにしておかないと、Todo.find()の実行時にif文の外側を通ってしまう。
      res.redirect('/');
    }
  });
};

exports.finish = function(req, res, next) {
  var id = req.param('id');
  if (!id) {
    res.redirect('/');
  }
  Todo.update({_id:id, user_id:req.user._id}, {$set:{finished:true}}, {upsert:false, multi:true}, function(err){
    if (err) {
      return next(err);
    }
    console.log('finish success! id=' + id);
    res.redirect('/');
  });
};

exports.delete = function(req, res, next) {
  var id = req.param('id');
  if (!id) {
    res.redirect('/');
  }
  Todo.remove({_id:id, user_id:req.user._id}, function(err){
    if (err) {
      return next(err);
    }
    console.log('delete success! id=' + id);
    res.redirect('/');
  });
};

exports.login = function(req, res, next) {
  var username = req.param('username');
  if (!username) {
    username = '';
  }
  res.render('login', { title: 'Login', username:username});
};