/**
 * Jumping into an invalid task
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that adds
 * a key `task${id}_${callsCounter}` = `true` into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate`
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyTask(id) {

  var callsCounter = 1;
  
  return function(context, callback) {
    context['task' + id + '_' + callsCounter++] = true;
    setImmediate(callback);
  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}_${callsCounter}` = `true` into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate` with the arguments (null, jumpToTask)
 * when it's called for the first time, otherwise without jumping
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateJumperTask(id, jumpToTask) {

  var called = false;
  var callsCounter = 1;

  return function(context, callback) {

    context['task' + id + '_' + callsCounter++] = true;

    if (!called) {
      called = true;
      return setImmediate(callback.bind(null, null, jumpToTask));
    }

    setImmediate(callback);

  };

}

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'series',
  
  task1: generateDummyTask(1),

  task2: generateJumperTask(2, 'task!')

};

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The error message
 * @type {String}
 */
module.exports.hints.errorMessage = 'Jumping into an invalid task name `task!` is not allowd';
