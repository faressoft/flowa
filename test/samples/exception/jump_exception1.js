/**
 * Jumping into a task that doesn't belong to the same parent task
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that adds
 * a key `task${id}_${callsCounter}` = `true` into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate`
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyTask(id) {

  var callsCounter = 1;
  
  return function(context, callback) {
    context['task' + id + '_' + callsCounter++] = true;
    setImmediate(callback);
  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}_${callsCounter}` = `true` into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate` with the arguments (null, jumpToTask)
 * when it's called for the first time, otherwise without jumping
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateJumperTask(id, jumpToTask) {

  var called = false;
  var callsCounter = 1;

  return function(context, callback) {

    context['task' + id + '_' + callsCounter++] = true;

    if (!called) {
      called = true;
      return setImmediate(callback.bind(null, null, jumpToTask));
    }

    setImmediate(callback);

  };

}

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'series',
  
  task1: generateDummyTask(1),

  group1: {

    type: 'parallel',

    task2: generateDummyTask(2),

    task3: generateDummyTask(3),

    group2: {

      type: 'series',

      task4: generateJumperTask(4, 'task6'),

      task5: generateDummyTask(5)

    },

    group3: {

      task6: generateDummyTask(6),

      task7: generateDummyTask(7),

      group4: {

        type: 'parallel',

        task8: generateDummyTask(8),

        task9: generateDummyTask(9)

      },

      task10: generateDummyTask(10)

    }

  },

  task11: generateDummyTask(11),

  task12: generateDummyTask(12)

};

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The error message
 * @type {String}
 */
module.exports.hints.errorMessage = 'Jumping into a task that doesn\'t belong to the same parent task is not allowed';
