/**
 * Mixed runner types flow with promises
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that adds
 * a key `task${id}` = `true` into the context
 * and returns a promise that gets resolved on the
 * next event loop tick using `setImmediate`
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyPromiseTask(id) {
  
  return function(context) {

    context['task' + id] = true;

    return new Promise(function(resolve, reject) {
      
      setImmediate(resolve);

    });

  };

}

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'series',
  
  task1: generateDummyPromiseTask(1),

  group1: {

    type: 'parallel',

    task2: generateDummyPromiseTask(2),

    task3: generateDummyPromiseTask(3),

    group2: {

      type: 'series',

      task4: generateDummyPromiseTask(4),

      task5: generateDummyPromiseTask(5)

    },

    group3: {

      task6: generateDummyPromiseTask(6),

      task7: generateDummyPromiseTask(7),

      group4: {

        type: 'parallel',

        task8: generateDummyPromiseTask(8),

        task9: generateDummyPromiseTask(9)

      },

      task10: generateDummyPromiseTask(10)

    }

  },

  task11: generateDummyPromiseTask(11),

  task12: generateDummyPromiseTask(12)

};

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

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

/**
 * A mapping between tasks names and runners types
 * @type {Object}
 */
module.exports.hints.tasksRunnersTypes = {
  '__root__': 'series',
  group1: 'series',
  group2: 'parallel',
  group3: 'parallel',
  group4: 'series',
  task1: 'series',
  task2: 'parallel',
  task3: 'parallel',
  task4: 'series',
  task5: 'series',
  task6: 'series',
  task7: 'series',
  task8: 'parallel',
  task9: 'parallel',
  task10: 'series',
  task11: 'series',
  task12: 'series'
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
  task1: true,
  task2: true,
  task3: true,
  task4: true,
  task5: true,
  task6: true,
  task7: true,
  task8: true,
  task9: true,
  task10: true,
  task11: true,
  task12: true
};

/**
 * The state of the context object in each event loop tick
 * @type {Array}
 */
module.exports.hints.timeline = [
  {},
  {task1: true},
  {task2: true, task3: true, task4: true, task6: true},
  {task5: true, task7: true},
  {task8: true, task9: true},
  {task10: true},
  {task11: true},
  {task12: true}
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
  'task12'
];
