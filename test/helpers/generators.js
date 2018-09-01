/**
 * Generate dummy tasks
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that adds
 * a key `task${id}` = callsCounter into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate`
 *
 * - The `callsCounter` is incremented for each call
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyTask(id) {

  var callsCounter = 1;
  
  return function(context, callback) {
    context['task' + id] = context['task' + id] ? context['task' + id] + 1 : 1;
    setImmediate(callback);
  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}` = callsCounter into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate` with the arguments (null, jumpToTask)
 * when it's called for the first time, otherwise without jumping
 *
 * - The `callsCounter` is incremented for each call
 * 
 * @param  {Number}   id
 * @param  {String}   jumpToTask
 * @return {Function}
 */
function generateJumperTask(id, jumpToTask) {

  var called = false;
  var callsCounter = 1;

  return function(context, callback) {

    context['task' + id] = context['task' + id] ? context['task' + id] + 1 : 1;

    if (!called) {
      called = true;
      return setImmediate(callback.bind(null, null, jumpToTask));
    }

    setImmediate(callback);

  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}` = callsCounter into the context
 * and returns a promise that gets resolved on the
 * next event loop tick using `setImmediate`
 *
 * - The `callsCounter` is incremented for each call
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyPromiseTask(id) {

  var callsCounter = 1;
  
  return function(context) {

    context['task' + id] = context['task' + id] ? context['task' + id] + 1 : 1;

    return new Promise(function(resolve, reject) {
      
      setImmediate(resolve);

    });

  };

}

/**
 * Generate a dummy async task that adds
 * a key `task${id}` = callsCounter into the context
 *
 * - The `callsCounter` is incremented for each call
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummySyncTask(id) {

  var callsCounter = 1;
  
  return function(context) {

    context['task' + id] = context['task' + id] ? context['task' + id] + 1 : 1;

  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}` = callsCounter into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate` and terminiates the flow
 * by calling `this.done()`
 *
 * - The `callsCounter` is incremented for each call
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyTerminatingTask(id) {

  var callsCounter = 1;
  
  return function(context, callback) {
    context['task' + id] = context['task' + id] ? context['task' + id] + 1 : 1;
    this.done();
    setImmediate(callback);
  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}` = callsCounter into the context
 * and returns a promise that gets resolved on the next event loop tick
 * using `setImmediate` with the arguments (null, jumpToTask)
 * when it's called for the first time, otherwise without jumping
 *
 * - The `callsCounter` is incremented for each call
 * 
 * @param  {Number}   id
 * @param  {String}   jumpToTask
 * @return {Function}
 */
function generateJumperPromiseTask(id, jumpToTask) {

  var called = false;
  var callsCounter = 1;

  return function(context) {

    context['task' + id] = context['task' + id] ? context['task' + id] + 1 : 1;

    return new Promise(function(resolve, reject) {

      if (!called) {
        called = true;
        return setImmediate(resolve.bind(null, jumpToTask));
      }

      setImmediate(resolve);

    });


  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}` = callsCounter into the context
 * and calls its callback using a timer
 *
 * - The `callsCounter` is incremented for each call
 * 
 * @param  {Number}   id
 * @param  {Number}   delay
 * @return {Function}
 */
function generateDummyTimerTask(id, delay) {
  
  return function(context, callback) {

    context['task' + id] = context['task' + id] ? context['task' + id] + 1 : 1;

    setTimeout(callback.bind(null, null), delay);

  };

}

/**
 * Generate a dummy task that
 * calls its callback with an error
 *
 * @param  {Error}    error
 * @return {Function}
 */
function generateDummyErroredTask(error) {
  
  return function(context, callback) {

    throw error;

  };

}

/**
 * Generate a dummy task that
 * returns a rejected promise an error
 *
 * @param  {Error}    error
 * @return {Function}
 */
function generateDummyRejectedPromiseTask(error) {
  
  return function(context) {

    return Promise.reject(error);

  };

}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  generateDummyTask: generateDummyTask,
  generateJumperTask: generateJumperTask,
  generateDummyPromiseTask: generateDummyPromiseTask,
  generateDummySyncTask: generateDummySyncTask,
  generateDummyTerminatingTask: generateDummyTerminatingTask,
  generateJumperPromiseTask: generateJumperPromiseTask,
  generateDummyTimerTask: generateDummyTimerTask,
  generateDummyErroredTask: generateDummyErroredTask,
  generateDummyRejectedPromiseTask: generateDummyRejectedPromiseTask
};
