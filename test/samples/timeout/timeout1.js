/**
 * Only serial runner type
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The time needed to execute a task
 * @type {Number}
 */
module.exports.hints.taskExecutionTime = 1000;

/**
 * The time needed to execute the flow
 * @type {Number}
 */
module.exports.hints.flowExecutionTime = 8000;

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'serial',
  
  task1: generators.generateDummyTimerTask(1, module.exports.hints.taskExecutionTime),

  task2: generators.generateDummyTimerTask(2, module.exports.hints.taskExecutionTime),

  task3: generators.generateDummyTimerTask(3, module.exports.hints.taskExecutionTime),

  task4: generators.generateDummyTimerTask(4, module.exports.hints.taskExecutionTime),

  task5: generators.generateDummyTimerTask(5, module.exports.hints.taskExecutionTime),

  task6: generators.generateDummyTimerTask(6, module.exports.hints.taskExecutionTime),

  task7: generators.generateDummyTimerTask(7, module.exports.hints.taskExecutionTime),

  task8: generators.generateDummyTimerTask(8, module.exports.hints.taskExecutionTime)

};
