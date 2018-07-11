/**
 * A flow with a duplicated task name
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'serial',
  
  task1: generators.generateDummyTask(1),

  group1: {

    type: 'parallel',

    task1: generators.generateDummyTask(1)

  }

};

/**
 * The error message
 * @type {String}
 */
module.exports.hints.errorMessage = 'The task task1 is duplicated. Tasks names should be unique';
