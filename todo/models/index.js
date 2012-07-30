var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/todo');
var Schema = mongoose.Schema;

var Todo = new Schema({
  title: { type: String, required: true }
  , finished: { type: Boolean, default: false }
  , created_at: { type:Date, defualt: Date.now }
});

mongoose.model('todo', Todo);
exports.Todo = db.model('todo');