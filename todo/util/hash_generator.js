var crypto = require('../auth/crypto');

var password = process.argv[2];
if (typeof password !== 'undefined') {
  console.log(crypto.toHash(password));
}