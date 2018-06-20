<p align="center">
<img src="/logo.png?raw=true" alt="Flowa Logo"/>
</p>

# Flowa

[![npm](https://img.shields.io/npm/v/flowa.svg)](https://www.npmjs.com/package/flowa)
[![npm](https://img.shields.io/npm/l/flowa.svg)](https://github.com/faressoft/flowa/blob/master/LICENSE)
[![Gitter](https://badges.gitter.im/join_chat.svg)](https://gitter.im/flowa-control-flow/Lobby)
[![Build Status](https://travis-ci.org/faressoft/flowa.svg?branch=master)](https://travis-ci.org/faressoft/flowa)
[![Coverage Status](https://coveralls.io/repos/github/faressoft/flowa/badge.svg?branch=master)](https://coveralls.io/github/faressoft/flowa?branch=master)

> Flow control for Node.js

# Hint

Check the [suggested way](#use-it-with-express) to use `Flowa` with `Express.js`.

# Table of Contents  

* [Features](#features)
* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
  * [Mixed Runners Types](#mixed-runners-types)
  * [Jumping Between Tasks](#jumping-between-tasks)
  * [Error Handling](#error-handling)
  * [ES6 Coding Style](#es6-coding-style)
  * [Use It With Express](#use-it-with-express)
* [Best Practices](#best-practices)
* [Debugging Mode](#debugging-mode)
* [API](#api)
  * [Flowa(flow[, name])](#constructor)
  * [run(context, options)](#run)
* [License](#license)

## Features

* Writing more readable code for complex logic.
* No more callback hells.
* Jumping between tasks.
* Proper error handling.
* Setting timeouts.
* Reusability.

## Introduction

Each `flow` is a set of `tasks`. It starts by a `compound task` which is basically a task that groups a set of `single tasks`. Single tasks are async functions that are executed and called by passing an object called `context` to allow sharing data between tasks and a `callback` function. Each compound task's sub tasks are executed by a `runner` that can be a `series` execution (default type) or a `parallel` execution.

## Installation

```
npm install --save flowa
```

## Usage

At the first you need to define our flow.

```js
var Flowa = require('flowa');

// Define the flow
var flowa = new Flowa({

  // Runner type
  type: 'series',

  // Do task1
  task1: task1,

  // Do task2
  task2: task2

});
```

Then we need to execute the flow.

```js
// To be used to share data between the tasks
var context = {};

// Execute the tasks
flowa.run(context).then(function(result) {

  console.log(result);

}).catch(function(error) {

  console.error(error);
  
});
```

And don't forget to write the code for your tasks.

```js
// Do task1
function task1(context, callback) {
  context.task1 = 1;
  console.log('Executing task 1');
  setTimeout(callback, 500);
}

// Do task2
function task2(context, callback) {
  context.task2 = 1;
  console.log('Executing task 2');
  setTimeout(callback, 500);
}
```

Just put the 3 blocks of code together in one script and they will run smoothly.

### Mixed Runners Types

There are no limitations about mixing the runners types. Add `type` to the compound tasks to specify the runner type. But remember, it is not a good idea to make things too complex.


```js
var flowa = new Flowa({

  // Runner type
  type: 'series',
  
  // Do task1
  task1: task1,

  // Do task2 and task3 in parallel
  group1: {

    // Runner type
    type: 'parallel',

    // Do task2
    task2: task2,

    // Do task3
    task3: task3,

    // Do task4 and task5 in parallel
    group2: {

      // Runner type
      type: 'series',

      // Do task4
      task4: task4,

      // Do task5
      task5: task5

    }

  },

  // Do task6
  task6: task6

});
```

### Jumping Between Tasks

You can jump forward and backward between tasks that belong to the same parent task and the runner type is series by passing the name of the task as the second argument to the callback function that is passed to each task. You can jump into a compound task too.

```js
function task1(context, callback) {
  callback(null, 'task6');
}
```

### Loop and Retry

Since we have the ability to jump backward and forward, we can implement a task to try something and another task to check the result to decide either to jump back to the previous task or continue.

```js
function task1(context, callback) {

  // We are just generating a random boolean value here
  context.checkSomething = Math.random() >= 0.5;
  callback();

}

/**
 * Task
 * 
 * @param {Object}   context
 * @param {Function} callback
 */
function task2(context, callback) {

  if (context.checkSomething) {
    return callback();
  }

  // Retry
  callback(null, 'task1');
  
}
```

### Error Handling

The thrown errors and the errors passed as a first argument to the callback function can be handled by attaching a `.catch()` to the returend promise from `run()` method.


```js
// Using callbacks (Recommended)
function checkUser(context, callback) {
  callback(new Error('User is not found'));
}

// Using the `throw` operator
function checkUser(context, callback) {
  throw new Error('User is not found');
}
```

### ES6 Coding Style

You can use the shorthand syntax for naming the tasks by their functions names.

```js
var flowa = new Flowa({

  // Runner type
  type: 'series',
  
  // Do task1
  task1,

  // Do task2
  task2,

  // Do task3
  task3,

  // Do task4
  task4,

  // Do task5
  task5,

  // Do task6
  task6

});
```

### Use It With Express

You can use `Flowa` to make more readable and maintainable `express.js` services.

#### App.js

To initilize your web server and load your services.

**Note**: No need to change the code, just add more services at the line 16.

```js
var express = require('express');
var Flowa   = require('./index.js');
var app     = express();

/**
 * A mapping between services names and their handlers
 * @type {Object}
 */
var handlers = {};

/**
 * RESTful API services
 * @type {Array}
 */
var services = [
  {name: 'greeting.get', path: '/greeting/:name', method: 'get'}
];

/**
 * Get a function to handle a specific service
 * 
 * @param  {String}   name the name of the service
 * @return {Function}
 */
function getServiceHandler(name) {

  return function(req, res) {

    var handler = handlers[name];
    var context = {req: req, res: res};

    handler.run(context).then(function() {

      res.end();

    }).catch(function(error) {

      if (res.headersSent) {
        return res.end();
      }

      res.status(500).send({
        error: 'Something went wrong !'
      });

      console.error(error);

    });
    
  };

}

// Foreach service, define its route and attach a handler
services.forEach(function(route) {

  handlers[route.name] = new Flowa(require('./' + route.name)),
  app[route.method](route.path, getServiceHandler(route.name));
  
});

app.listen(3000, console.log.bind(null, 'listening ...'));
```

#### Greeting.get.js

An example of a service.

```js
/**
 * Generate a greeting message
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var counter = 0;

/**
 * Increment the greeting counter
 * 
 * @param {Object}   context
 * @param {Function} callback
 */
function incrementGreetingCounter(context, callback) {

  context.counterValue = ++counter;

  callback();

}

/**
 * Generate a greeting message
 * 
 * @param {Object}   context
 * @param {Function} callback
 */
function generateGreetingMessage(context, callback) {

  context.res.send({
    message: 'Hello ' + context.req.params.name,
    counter: context.counterValue
  });

  callback();

}

module.exports = {

  // Runner type
  type: 'series',

  // Increment the greeting counter
  incrementGreetingCounter: incrementGreetingCounter,

  // Generate a greeting message
  generateGreetingMessage: generateGreetingMessage

};

```

## Best Practices

* Stick with one coding style.
* Define your flow object in a separated object or better in a separated module.
* Add comments for each task to get a quick overview about all the tasks at one place.
* Each single task should do literally only one task.
* Specifiy the runners types.

## Debugging Mode

To watch how the tasks being executed in realtime, you can activate the debug logging via the `debug` option.

```js
flowa.run(context, {debug: true});
```

## API

<dl>
<dt><a href="#constructor">Flowa(flow[, name])</a></dt>
<dd><p>To create Flowa objects</p></dd>
<dt><a href="#run">run(context[, options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Execute the flow</p></dd>
</dl>

<a name="constructor"></a>

## Flowa(flow[, name])

To create Flowa objects.

| Param | Type                | Description                    |
|-------|---------------------|--------------------------------|
| flow  | <code>Object</code> | A compound task                |
| name  | <code>String</code> | A name for the flow (Optional) |

<a name="run"></a>

## run(context, options) ⇒ <code>Promise</code>

Execute the flow. The Flowa object can be defined once and executed as many as you need.

**Returns**: <code>Promise</code> - resolve with the passed context object

| Param   | Type   | Description                                                |
|---------|--------|------------------------------------------------------------|
| context | Object | A shared object between the tasks (Optional) (default: {}) |
| options | Object | (Optional)                                                 |

#### Options:

* **timeout**: a timeout for the flow in milliseconds. The promise will be rejected with an error object that has (code: `ETIMEDOUT`) if the timeout is exeeded (type: `Number`).
* **taskTimeout**: a timeout for the single tasks in milliseconds. The promise will be rejected with an error object that has (code: `ETIMEDOUT`) if the timeout is exeeded (type: `Number`).
* **debug**: log the tasks' names in realtime (type: `Boolean`).

# License

This project is under the MIT license.
