/**
 * Flow with backward jumping
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
  {task2: 1, task3: 1, task4: 1, task6: 1},
  {task5: 1, task7: 1},
  {task8: 1, task9: 1},
  {task10: 1},
  {task11: 1},
  {task1: 2},
  {task2: 2, task3: 2, task4: 2, task6: 2},
  {task5: 2, task7: 2},
  {task8: 2, task9: 2},
  {task10: 2},
  {task11: 2},
  {task12: 1}
];

/**
 * The debug logs for each executed task
 * ordered as per the execution order
 * @type {Array}
 */
module.exports.hints.debugLogs = [
  'task1',
  '..task2',
  '..task3',
  '....task4',
  '....task6',
  '....task5',
  '....task7',
  '......task8',
  '......task9',
  '....task10',
  'task11',
  'task1',
  '..task2',
  '..task3',
  '....task4',
  '....task6',
  '....task5',
  '....task7',
  '......task8',
  '......task9',
  '....task10',
  'task11',
  'task12'
];

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'serial',
  
  task1: generators.generateDummyTask(1),

  group1: {

    type: 'parallel',

    task2: generators.generateDummyTask(2),

    task3: generators.generateDummyTask(3),

    group2: {

      type: 'serial',

      task4: generators.generateDummyTask(4),

      task5: generators.generateDummyTask(5)

    },

    group3: {

      task6: generators.generateDummyTask(6),

      task7: generators.generateDummyTask(7),

      group4: {

        type: 'parallel',

        task8: generators.generateDummyTask(8),

        task9: generators.generateDummyTask(9)

      },

      task10: generators.generateDummyTask(10)

    }

  },

  task11: generators.generateJumperTask(11, 'task1'),

  task12: generators.generateDummyTask(12)

};
