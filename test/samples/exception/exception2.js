/**
 * Throw exceptions by using `throw`
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The error object
 * @type {Object}
 */
module.exports.hints.error = new Error('Unexpected thrown error !!!');

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

        task8: generators.generateDummyErroredTask(module.exports.hints.error),

        task9: generators.generateDummyTask(9)

      },

      task10: generators.generateDummyTask(10)

    }

  },

  task11: generators.generateDummyTask(11),

  task12: generators.generateDummyTask(12)

};
