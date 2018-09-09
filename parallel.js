/**
 * Parallel Runner
 * Executes a compound task in parallel
 *  
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var async = require('async');
var Task = require('./task');

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

      var flowaTask = new Task(taskName, runVariables, flowa);
      flowa.runTask(flowaTask, callback);
      
    });

  });

  async.parallel(tasks, function(error, result) {

    if (error) {
      return callback(error);
    }

    callback();

  });

};
