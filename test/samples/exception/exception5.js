/**
 * Throw exceptions by using promise rejection
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

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

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'serial',
  
  task1: generators.generateDummyRejectedPromiseTask(module.exports.hints.error)

};
