/**
 * Require directories recursively
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var requireDir = require('require-dir'),
    path       = require('path'),
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
 * @param  {String} dir
 * @return {Object}
 */
module.exports = function(dir) {

  var parentDir = path.dirname(module.parent.filename);

  // Resolve the path to an absolute path
  dir = path.resolve(parentDir, dir);

  var options = {
    recurse: true,
    mapKey: function(value, baseName) {
      return _.camelCase(baseName);
    }
  };

  return requireDir(dir, options);
  
};
