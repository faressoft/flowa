/**
 * Require directories recursively
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var requireDir = require('require-dir'),
    _          = require('lodash');

/**
 * Require directories recursively
 *
 * - A wrapper around `requireDir` package.
 * - Requires directories recursively by default.
 * - Converts keys into camelCase.
 * 
 * For the returned object representation check:
 * https://github.com/aseemk/requireDir
 * 
 * @param  {String} path
 * @return {Object}
 */
module.exports = function(path) {

  var options = {
    recurse: true,
    mapKey: function(value, baseName) {
      return _.camelCase(baseName);
    }
  };

  return requireDir(path, options);
  
};
