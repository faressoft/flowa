/**
 * Throw exceptions by using callbacks
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that adds
 * a key `task${id}` = `true` into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate`
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyTask(id) {
  
  return function(context, callback) {
    context['task' + id] = true;
    setImmediate(callback);
  };

}
/**
 * Generate a dummy task that
 * calls its callback with an error
 * 
 * @return {Function}
 */
function generateDummyErroredTask() {
  
  return function(context, callback) {
    callback(module.exports.hints.error);
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

      task4: generateDummyTask(4),

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

  task11: generateDummyErroredTask(),

  task12: generateDummyTask(12)

};

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The error object
 * @type {Object}
 */
module.exports.hints.error = new Error('Something wrong !!!');
