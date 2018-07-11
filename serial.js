/**
 * Serial Runner
 * Executes a compound task in sequence
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var async = require('async'),
    is    = require('is_js');

/**
 * Execute a compound task in sequence
 * 
 * @param {Flowa}    flowa
 * @param {String}   taskName
 * @param {Object}   runVariables
 * @param {Function} callback
 */
module.exports = function(flowa, taskName, runVariables, callback) {

  var tasks = [];
  var loopCounter = 0;
  var jumpToTask = null;

  // Foreach child task
  flowa.forEachTask(taskName, function(task, taskName) {
    
    tasks.push(function(callback) {

      if (jumpToTask && jumpToTask != taskName) {
        return callback();
      }

      if (jumpToTask && jumpToTask == taskName) {
        jumpToTask = null;        
      }

      flowa.runTask(taskName, runVariables, function(error, result) {

        // Something wrong
        if (error) {
          return callback(error);
        }

        // No jumpToTask
        if (typeof result == 'undefined' || is.not.string(result)) {
          return callback();
        }

        // Check exists
        if (!flowa._isTask(result)) {
          return callback(new Error('Jumping into an invalid task name `' + result + '` is not allowd'));
        }

        // Check same group
        if (flowa._getTaskParent(taskName) != flowa._getTaskParent(result)) {
          return callback(new Error('Jumping into a task that doesn\'t belong to the same parent task is not allowed'));
        }

        jumpToTask = result;

        callback();
        
      });
      
    });

  });

  async.until(function(params) {

    return jumpToTask == null && loopCounter > 0;

  }, function(callback) {

    loopCounter++;
    async.series(tasks, callback);

  }, function(error, result) {

    if (error) {
      return callback(error);
    }

    callback();
    
  });

};
