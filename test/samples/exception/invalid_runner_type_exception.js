/**
 * A flow with an invalid runner type
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
module.exports.hints.errorMessage = 'The type invalidRunner is not a valid runner type';

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'serial',
  
  task1: generators.generateDummyTask(1),

  group1: {

    type: 'invalidRunner',

    task2: generators.generateDummyTask(1)

  }

};
