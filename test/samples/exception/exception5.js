/**
 * Throw exceptions by using promise rejection
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that
 * returns a rejected promise an error
 * 
 * @return {Function}
 */
function generateDummyRejectedPromiseTask() {
  
  return function(context) {
    return Promise.reject(module.exports.hints.error);
  };

}

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'series',
  
  task1: generateDummyRejectedPromiseTask()

};

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The error object
 * @type {Object}
 */
module.exports.hints.error = new Error('Something wrong !!!');
