function task1(context, callback) {

  context.task1 = 'task1';
  setTimeout(callback, 300);

}

function task2(context, callback) {

  context.task2 = 'task2';
  setTimeout(callback, 300);

}

function task3(context, callback) {

  context.task3 = 'task3';
  setTimeout(callback, 300);

}

function task4(context, callback) {

  context.task4 = 'task4';
  setTimeout(callback, 300);

}

function task5(context, callback) {

  context.task5 = 'task5';
  setTimeout(callback, 300);

}

function task6(context, callback) {

  context.task6 = 'task6';
  setTimeout(callback, 300);

}

function task7(context, callback) {

  context.task7 = 'task7';
  setTimeout(callback, 300);

}

function task8(context, callback) {

  context.task8 = 'task8';
  setTimeout(callback, 300);

}

function task9(context, callback) {

  context.task9 = 'task9';
  setTimeout(callback, 300);

}

function task10(context, callback) {

  context.task10 = 'task10';
  setTimeout(callback, 300);

}

function task11(context, callback) {

  context.task11 = 'task11';
  setTimeout(callback, 300);

}

function task12(context, callback) {

  context.task12 = 'task12';
  setTimeout(callback, 300);

}

module.exports = {

  type: 'series',
  
  task1: task1,

  group1: {

    type: 'parallel',

    task2: task2,

    task3: task3,

    group2: {

      type: 'series',

      task4: task4,

      task5: task5

    },

    group3: {

      task6: task6,

      task7: task7,

      group4: {

        type: 'parallel',

        task8: task8,

        task9: task9

      },

      task10: task10,

    }

  },

  task11: task11,

  task12: task12

};
