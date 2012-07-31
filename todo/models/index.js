var config = require('config');
var mongoose = require('mongoose');
var db = mongoose.connect(config.db.url);
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var crypto = require('../auth/crypto');

var Todo = new Schema({
  title: { type: String, required: true }
  , finished: { type: Boolean, default: false }
  , created_at: { type:Date, defualt: Date.now }
  , user_id: ObjectId
});

var User = new Schema({
  user_id:String
  , password:String
  , admin: {type:Boolean, default:false}
});
User.methods.validPassword = function(password) {
  return this.password === crypto.toHash(password);
}

mongoose.model('todo', Todo);
mongoose.model('user', User);
exports.Todo = db.model('todo');
exports.User = db.model('user');