/**
 * Jumping into a task that doesn't belong to the same parent task
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

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

      task4: generators.generateJumperTask(4, 'task6'),

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

  task11: generators.generateDummyTask(11),

  task12: generators.generateDummyTask(12)

};
