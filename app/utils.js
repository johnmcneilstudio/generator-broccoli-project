'use strict';

module.exports = {
  isKebabCase: function(input) {
    var pattern = /([a-z0-9\-])+/g;
    var matches = input.match(pattern);
    return matches !== null && input === matches[0];
  }
};

