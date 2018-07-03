/**
 * Deeply nested compound tasks
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
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'parallel',
  
  task1: generateDummyTask(1),

  group1: {

    type: 'parallel',

    task2: generateDummyTask(2),

    group2: {

      type: 'parallel',

      group3: {

        type: 'parallel',

        task3: generateDummyTask(3),

        group4: {

          type: 'parallel',
          
          task4: generateDummyTask(4)

        }

      }

    }

  }

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
  group3: module.exports.flow.group1.group2.group3,
  group4: module.exports.flow.group1.group2.group3.group4,
  task1: module.exports.flow.task1,
  task2: module.exports.flow.group1.task2,
  task3: module.exports.flow.group1.group2.group3.task3,
  task4: module.exports.flow.group1.group2.group3.group4.task4
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
  task4: 'parallel'
};

/**
* A mapping between tasks names and their depth
* @type {Object}
*/
module.exports.hints.tasksDepths = {
  '__root__': 0,
  group1: 1,
  group2: 2,
  group3: 3,
  group4: 4,
  task1: 1,
  task2: 2,
  task3: 4,
  task4: 5
};

/**
 * A mapping between tasks names and their parent task's name
 * @type {Object}
 */
module.exports.hints.tasksParents = {
  '__root__': null,
  group1: '__root__',
  group2: 'group1',
  group3: 'group2',
  group4: 'group3',
  task1: '__root__',
  task2: 'group1',
  task3: 'group3',
  task4: 'group4'
};

/**
 * The context
 * @type {Object}
 */
module.exports.hints.context = {
  task1: true,
  task2: true,
  task3: true,
  task4: true
};
