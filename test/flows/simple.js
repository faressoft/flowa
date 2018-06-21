function task1(context, callback) {

  context.task1 = 'task1';
  callback();

}

function task2(context, callback) {

  context.task2 = 'task2';
  setTimeout(callback, 3000);

}

function task3(context, callback) {

  context.task3 = 'task3';
  callback();

}

module.exports = {

  type: 'series',

  task1: task1,

  task2: task2,

  task3: task3

};
