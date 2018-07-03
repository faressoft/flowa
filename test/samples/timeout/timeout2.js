/**
 * Only parallel runner type
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that adds
 * a key `task${id}` = `true` into the context
 * and calls its callback using a timer
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyTask(id) {
  
  return function(context, callback) {
    context['task' + id] = true;
    setTimeout(callback.bind(null, null), 1000);
  };

}

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'parallel',
  
  task1: generateDummyTask(1),

  task2: generateDummyTask(2),

  task3: generateDummyTask(3),

  task4: generateDummyTask(4),

  task5: generateDummyTask(5),

  task6: generateDummyTask(6),

  task7: generateDummyTask(7),

  task8: generateDummyTask(8)

};

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
module.exports.hints.flowExecutionTime = 1000;
