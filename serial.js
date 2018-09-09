/**
 * Serial Runner
 * Executes a compound task in sequence
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var async = require('async'),
    is = require('is_js');
var Task = require('./task');

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

      var flowaTask = new Task(taskName, runVariables, flowa);

      if (jumpToTask && jumpToTask != taskName) {
        return callback();
      }

      if (jumpToTask && jumpToTask == taskName) {
        jumpToTask = null;        
      }

      flowa.runTask(flowaTask, function(error, result) {

        // Something wrong
        if (error) {
          return callback(error);
        }

        // The jump method is called
        if (flowaTask._jumpToTask) {
          jumpToTask = flowaTask._jumpToTask;
        }

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
