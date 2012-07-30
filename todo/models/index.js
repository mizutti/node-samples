var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/todo');
var Schema = mongoose.Schema;

var Todo = new Schema({
  title: { type: String, required: true }
  , finished: { type: Boolean, default: false }
  , created_at: { type:Date, defualt: Date.now }
});

var User = new Schema({
  user_id:String
  , password:String
  , admin: {type:Boolean, default:false}
});
User.methods.validPassword = function(password) {
  return this.password === password;
}

mongoose.model('todo', Todo);
mongoose.model('user', User);
exports.Todo = db.model('todo');
exports.User = db.model('user');