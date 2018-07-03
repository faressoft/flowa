/**
 * Throw exceptions by using `throw` with one task
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that
 * calls its callback with an error
 * 
 * @return {Function}
 */
function generateDummyErroredTask() {
  
  return function(context, callback) {
    throw module.exports.hints.error;
  };

}

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'series',
  
  task1: generateDummyErroredTask()

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
