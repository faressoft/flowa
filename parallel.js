/**
 * Parallel Runner
 * Executes a compound task in parallel
 *  
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var async = require('async');

/**
 * Execute a compound task in parallel
 * 
 * @param {Flowa}    flowa
 * @param {String}   taskName
 * @param {Object}   runVariables
 * @param {Function} callback
 */
module.exports = function(flowa, taskName, runVariables, callback) {

  var tasks = [];

  // Foreach child task
  flowa.forEachTask(taskName, function(task, taskName) {

    tasks.push(function(callback) {

      flowa.runTask(taskName, runVariables, callback);
      
    });

  });

  async.parallel(tasks, function(error, result) {

    if (error) {
      return callback(error);
    }

    callback();

  });

};
