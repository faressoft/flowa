/**
 * Flow with forward jumping and promises
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The state of the context object in each event loop tick
 * @type {Array}
 */
module.exports.hints.timeline = [
  {},
  {task1: 1},
  {task11: 1},
  {task12: 1}
];

/**
 * The debug logs for each executed task
 * ordered as per the execution order
 * @type {Array}
 */
module.exports.hints.debugLogs = [
  'task1',
  'task11',
  'task12'
];

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'series',
  
  task1: generators.generateJumperPromiseTask(1, 'task11'),

  group1: {

    type: 'parallel',

    task2: generators.generateDummyPromiseTask(2),

    task3: generators.generateDummyPromiseTask(3),

    group2: {

      type: 'series',

      task4: generators.generateDummyPromiseTask(4),

      task5: generators.generateDummyPromiseTask(5)

    },

    group3: {

      task6: generators.generateDummyPromiseTask(6),

      task7: generators.generateDummyPromiseTask(7),

      group4: {

        type: 'parallel',

        task8: generators.generateDummyPromiseTask(8),

        task9: generators.generateDummyPromiseTask(9)

      },

      task10: generators.generateDummyPromiseTask(10)

    }

  },

  task11: generators.generateDummyPromiseTask(11),

  task12: generators.generateDummyPromiseTask(12)

};
