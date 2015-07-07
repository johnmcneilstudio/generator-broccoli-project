var crypto = require('crypto');

module.exports = {
  sha1: function(pwd) {
    var hash = crypto.createHash('sha1');
    hash.update(pwd);
    return hash.digest('base64');
  }
};
