var crypto = require('crypto');

exports.toHash = function(str) {
  var shasum = crypto.createHash('sha256');
  return shasum.update(str).digest('hex');
}