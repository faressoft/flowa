/**
 * Jumping into an invalid task
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

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

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'serial',
  
  task1: generators.generateDummyTask(1),

  task2: generators.generateJumperTask(2, 'task!')

};
