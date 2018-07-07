/**
 * Flow with backward jumping and promises
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that adds
 * a key `task${id}_${callsCounter}` = `true` into the context
 * and returns a promise that gets resolved on the
 * next event loop tick using `setImmediate`
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyPromiseTask(id) {

  var callsCounter = 1;
  
  return function(context) {

    context['task' + id + '_' + callsCounter++] = true;

    return new Promise(function(resolve, reject) {
      
      setImmediate(resolve);

    });

  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}_${callsCounter}` = `true` into the context
 * and returns a promise that gets resolved on the next event loop tick
 * using `setImmediate` with the arguments (null, jumpToTask)
 * when it's called for the first time, otherwise without jumping
 * 
 * @param  {Number}   id
 * @param  {String}   jumpToTask
 * @return {Function}
 */
function generateJumperPromiseTask(id, jumpToTask) {

  var called = false;
  var callsCounter = 1;

  return function(context) {

    context['task' + id + '_' + callsCounter++] = true;

    return new Promise(function(resolve, reject) {

      if (!called) {
        called = true;
        return setImmediate(resolve.bind(null, jumpToTask));
      }

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

  task11: generateJumperPromiseTask(11, 'task1'),

  task12: generateDummyPromiseTask(12)

};

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
  {task1_1: true},
  {task2_1: true, task3_1: true, task4_1: true, task6_1: true},
  {task5_1: true, task7_1: true},
  {task8_1: true, task9_1: true},
  {task10_1: true},
  {task11_1: true},
  {task1_2: true},
  {task2_2: true, task3_2: true, task4_2: true, task6_2: true},
  {task5_2: true, task7_2: true},
  {task8_2: true, task9_2: true},
  {task10_2: true},
  {task11_2: true},
  {task12_1: true}
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
