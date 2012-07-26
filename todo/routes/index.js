
/*
 * GET home page.
 */
var todos = [{id:1, title:'Todo1'}, {id:2, title:'Todo2'}, {id:3, title:'Todo3'}];

exports.index = function(req, res) {
  res.render('list', { title:'Todo List', todos:todos});
};

exports.create = function(req, res) {
  console.log(req.body.todo);
  res.redirect('/');
};

exports.finish = function(req, res) {
  var id = req.param('id');
  console.log('finish id=' + id);
  res.redirect('/');
};

exports.delete = function(req, res) {
  var id = req.param('id');
  console.log('delete id=' + id);
  res.redirect('/');
};