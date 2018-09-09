/**
 * Only parallel runner type
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * Flowa options
 * @type {Object}
 */
module.exports.hints.options = {
  autoInjectResults: false
};

/**
 * A mapping between tasks names and runners types
 * @type {Object}
 */
module.exports.hints.tasksRunnersTypes = {
  '__root__': 'parallel',
  group1: 'parallel',
  group2: 'parallel',
  group3: 'parallel',
  group4: 'parallel',
  task1: 'parallel',
  task2: 'parallel',
  task3: 'parallel',
  task4: 'parallel',
  task5: 'parallel',
  task6: 'parallel',
  task7: 'parallel',
  task8: 'parallel',
  task9: 'parallel',
  task10: 'parallel',
  task11: 'parallel',
  task12: 'parallel'
};

/**
* A mapping between tasks names and their depth
* @type {Object}
*/
module.exports.hints.tasksDepths = {
  '__root__': 0,
  group1: 1,
  group2: 2,
  group3: 2,
  group4: 3,
  task1: 1,
  task2: 2,
  task3: 2,
  task4: 3,
  task5: 3,
  task6: 3,
  task7: 3,
  task8: 4,
  task9: 4,
  task10: 3,
  task11: 1,
  task12: 1
};

/**
 * A mapping between tasks names and their parent task's name
 * @type {Object}
 */
module.exports.hints.tasksParents = {
  '__root__': null,
  group1: '__root__',
  group2: 'group1',
  group3: 'group1',
  group4: 'group3',
  task1: '__root__',
  task2: 'group1',
  task3: 'group1',
  task4: 'group2',
  task5: 'group2',
  task6: 'group3',
  task7: 'group3',
  task8: 'group4',
  task9: 'group4',
  task10: 'group3',
  task11: '__root__',
  task12: '__root__'
};

/**
 * The context
 * @type {Object}
 */
module.exports.hints.context = {
  _task1: 1,
  _task2: 1,
  _task3: 1,
  _task4: 1,
  _task5: 1,
  _task6: 1,
  _task7: 1,
  _task8: 1,
  _task9: 1,
  _task10: 1,
  _task11: 1,
  _task12: 1
};

/**
 * The state of the context object in each event loop tick
 * @type {Array}
 */
module.exports.hints.timeline = [
  {},
  {
    _task1: 1,
    _task2: 1,
    _task3: 1,
    _task4: 1,
    _task5: 1,
    _task6: 1,
    _task7: 1,
    _task8: 1,
    _task9: 1,
    _task10: 1,
    _task11: 1,
    _task12: 1
  }
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
  '....task5',
  '....task6',
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

  type: 'parallel',
  
  task1: generators.generateDummyTask(1),

  group1: {

    type: 'parallel',

    task2: generators.generateDummyTask(2),

    task3: generators.generateDummyTask(3),

    group2: {

      type: 'parallel',

      task4: generators.generateDummyTask(4),

      task5: generators.generateDummyTask(5)

    },

    group3: {

      type: 'parallel',

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

  task11: generators.generateDummyTask(11),

  task12: generators.generateDummyTask(12)

};

/**
 * Tasks indexed by their names
 * @type {Object}
 */
module.exports.hints.tasks = {
  '__root__': module.exports.flow,
  group1: module.exports.flow.group1,
  group2: module.exports.flow.group1.group2,
  group3: module.exports.flow.group1.group3,
  group4: module.exports.flow.group1.group3.group4,
  task1: module.exports.flow.task1,
  task2: module.exports.flow.group1.task2,
  task3: module.exports.flow.group1.task3,
  task4: module.exports.flow.group1.group2.task4,
  task5: module.exports.flow.group1.group2.task5,
  task6: module.exports.flow.group1.group3.task6,
  task7: module.exports.flow.group1.group3.task7,
  task8: module.exports.flow.group1.group3.group4.task8,
  task9: module.exports.flow.group1.group3.group4.task9,
  task10: module.exports.flow.group1.group3.task10,
  task11: module.exports.flow.task11,
  task12: module.exports.flow.task12
};
