<p align="center"><img src="/logo.png?raw=true" alt="Flowa Logo"/></p>

# Flowa

[![npm](https://img.shields.io/npm/v/flowa.svg)](https://www.npmjs.com/package/flowa)
[![npm](https://img.shields.io/npm/l/flowa.svg)](https://github.com/faressoft/flowa/blob/master/LICENSE)
[![Gitter](https://badges.gitter.im/join_chat.svg)](https://gitter.im/flowa-control-flow/Lobby)
[![Build Status](https://travis-ci.org/faressoft/flowa.svg?branch=master)](https://travis-ci.org/faressoft/flowa)
[![Coverage Status](https://coveralls.io/repos/github/faressoft/flowa/badge.svg?branch=master)](https://coveralls.io/github/faressoft/flowa?branch=master)

> Service level control flow for Node.js

One execution flow that runs mixed sync and async functions that uses either promises or callbacks running in parallel, sequentially or mixed. 🔥 **It can't be easier and more readable !**

# Hint

Check the [suggested way](#use-it-with-express) to use `Flowa` with `Express.js`.

# Demo

<p align="center"><img width="100%" src="/demo.gif?raw=true" alt="Flowa Demo"/></p>

# Table of Contents

* [Features](#features)
* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
  * [Shorthand Method](#shorthand-method)
  * [Mixed Runners Types](#mixed-runners-types)
  * [Promises](#promises)
  * [Sync Tasks](#sync-tasks)
  * [Terminating The Flow](#terminating-the-flow)
  * [Jumping Between Tasks](#jumping-between-tasks)
  * [Error Handling](#error-handling)
  * [Factory Method](#factory-method)
  * [ES6 Coding Style](#es6-coding-style)
  * [Use It With Express](#use-it-with-express)
* [Best Practices](#best-practices)
* [Debugging Mode](#debugging-mode)
* [API](#api)
  * [Flowa(flow[, name])](#constructor)
  * [Flowa.create(flow[, name])](#create)
  * [run(context, options)](#run)
* [License](#license)

## Features

* Writing more readable code for complex logic.
* Works with promises or callbacks.
* Works with sync or async tasks.
* Serial or parallel execution.
* No more callback hells.
* Jumping between tasks.
* Proper error handling.
* Timeouts.

## Introduction

Each `flow` is a set of `tasks`. It starts by a `compound task` which is basically a task that groups a set of `single` or other `compound` tasks. Single tasks are either async or sync functions that are executed and called by passing an object called `context` to allow sharing data between tasks and an optional `callback` function for async tasks that use callbacks instead of promises. Each compound task's sub tasks are executed by a `runner` that can be a `serial` execution (default type) or a `parallel` execution.

## Installation

```
npm install --save flowa
```

## Usage

We need to create a new Flowa object with our flow using `new Flowa(flow[, name])`, `Flowa.create(flow[, name])`, or just use the [Shorthand Method](#shorthand-method) it is much easier and recommended if you are not planning to execute the same flow again and again.

```js
var Flowa = require('flowa');

// Define the flow
var flowa = new Flowa({

  // Runner type
  type: 'serial',

  // A task that uses a callback
  asyncTaskWithCallback: asyncTaskWithCallback,

  // A task that returns a promise
  asyncTaskWithPromise: asyncTaskWithPromise,

  // A sync task
  syncTask: syncTask

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
// A task that uses a callback
function asyncTaskWithCallback(context, callback) {

  setTimeout(callback.bind(null, null, 'DummyValue1'), 500);

}

// A task that returns a promise
function asyncTaskWithPromise(context) {

  return Promise.resolve('DummyValue2');

}

// A sync task
function syncTask(context) {

  return 'DummyValue3';

}
```

Just put the 3 blocks of code together in one script and they will run smoothly.

### Shorthand Method

Is it possible to create a flow and execute it using a single function `.run()` that belongs to the Flowa class.

```js
Flowa.run({

  // Runner type
  type: 'serial',

  // Do task1
  task1: task1,

  // Do task2
  task2: task2

}).then(function(result) {

  console.log(result);

}).catch(function(error) {

  console.error(error);
  
});
```

### Mixed Runners Types

There are no limitations about mixing the runners types. Add `type` to the compound tasks to specify the runner type. But remember, it is not a good idea to make things too complex.


```js
var flowa = new Flowa({

  // Runner type
  type: 'serial',
  
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
      type: 'serial',

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

### Promises

You can return promises from your tasks instead of using callbacks. The callbacks will be called internally.

```js
function task1(context) {

  return new Promise(function(resolve, reject) {

    resolve();

  });

}
```

### Sync Tasks

You can use sync tasks that doesn't return a promise and doesn't take a second callback argument.

```js
function task1(context) {

  // Do something !!

}
```

### Terminating The Flow

You can terminate the flow (skip executing the remaining tasks) by calling the `done` method.

```js
function task1(context, callback) {

  this.done();
  callback();

}
```

### Jumping Between Tasks

You can jump forward and backward between tasks that belong to the same parent task and the runner type is `serial` by calling the `jump` method with the task name as first argument to jump into it after executing the current task completely. You can jump into a compound task too.

```js
function task1(context, callback) {

  this.jump('task6');
  callback();

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
  this.jump('task1');
  callback();
  
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

### Factory Method

Is it possible to create a new Flowa object by calling `.create()` method instead of using `new Flowa`.

```js
Flowa.create({

  // Runner type
  type: 'serial',

  // Do task1
  task1: task1,

  // Do task2
  task2: task2

}).run(context).then(function(result) {

  console.log(result);

}).catch(function(error) {

  console.error(error);
  
});
```

### ES6 Coding Style

You can use the shorthand syntax for naming the tasks by their functions names.

```js
var flowa = new Flowa({

  // Runner type
  type: 'serial',
  
  // Shorthand format for task1: task1
  task1,

  // Shorthand format for task2:task2
  task2,

  // Shorthand format for task3:task3
  task3,

  // Shorthand format for task4:task4
  task4,

  // Shorthand format for task5:task5
  task5,

  // Shorthand format for task6:task6
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
 * @param {Object} context
 */
function incrementGreetingCounter(context) {

  context.counterValue = ++counter;

}

/**
 * Generate a greeting message
 * 
 * @param {Object} context
 */
function generateGreetingMessage(context) {

  context.res.send({
    message: 'Hello ' + context.req.params.name,
    counter: context.counterValue
  });

}

module.exports = {

  // Runner type
  type: 'serial',

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
<dt><a href="#flowa-create">Flowa.create(flow[, name])</a> ⇒ <code>Flowa</code></dt>
<dd><p>A factory method to create Flowa objects</p></dd>
<dt><a href="#flowa-run">Flowa.run(flow[, context, options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Create a flow and execute it</p></dd>
<dt><a href="#flowa-instance-run">flowa.run(context[, options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Execute the flow</p></dd>
<dt><a href="#task-done">task.done()</a></dt>
<dd><p>Skip the remaining tasks</p></dd>
<dt><a href="#task-jump">task.jump(taskName)</a></dt>
<dd><p>Jump into another task under the same parent after executing the current task</p></dd>
</dl>

### Note

> A new instance from the class `Task` is created for each execution for each task.

<a name="constructor"></a>

## Flowa(flow[, name])

To create Flowa objects.

| Param | Type                | Description                    |
|-------|---------------------|--------------------------------|
| flow  | <code>Object</code> | A compound task                |
| name  | <code>String</code> | A name for the flow (Optional) |

<a name="flowa-create"></a>

## Flowa.create(flow[, name]) ⇒ <code>Flowa</code>

A factory method to create Flowa objects.

**Returns**: <code>Flowa</code> - a new Flowa object

| Param | Type                | Description                    |
|-------|---------------------|--------------------------------|
| flow  | <code>Object</code> | A compound task                |
| name  | <code>String</code> | A name for the flow (Optional) |

<a name="flowa-run"></a>

## Flowa.run(flow[, context, options]) ⇒ <code>Promise</code>

Create a flow and execute it.

**Returns**: <code>Promise</code> - resolve with the passed context object

| Param   | Type                | Description                                                |
|---------|---------------------|------------------------------------------------------------|
| flow    | <code>Object</code> | A compound task                                            |
| context | <code>Object</code> | A shared object between the tasks (Optional) (default: {}) |
| options | <code>Object</code> | (Optional)                                                 |

<a name="flowa-instance-run"></a>

## flowa.run(context, options) ⇒ <code>Promise</code>

Execute the flow. The Flowa object can be defined once and executed as many as you need.

**Returns**: <code>Promise</code> - resolve with the passed context object

| Param   | Type                | Description                                                |
|---------|---------------------|------------------------------------------------------------|
| context | <code>Object</code> | A shared object between the tasks (Optional) (default: {}) |
| options | <code>Object</code> | (Optional)                                                 |

#### Options:

* **timeout**: a timeout for the flow in milliseconds. The promise will be rejected with an error object that has (code: `ETIMEDOUT`) if the timeout is exeeded (type: `Number`).
* **taskTimeout**: a timeout for the single tasks in milliseconds. The promise will be rejected with an error object that has (code: `ETIMEDOUT`) if the timeout is exeeded (type: `Number`).
* **autoInjectResults**: Inject the result of each task into the context automatically (type: `Boolean`) (default: `true`).
* **debug**: log the tasks' names in realtime (type: `Boolean`) (default: `false`).
* **debugCallback**: the debug logging function (type: `Boolean`) (default: `console.log`).

<a name="task-done"></a>

## task.done()

Skip the remaining tasks. Check [Terminating The Flow](#terminating-the-flow).

<a name="task-jump"></a>

## task.jump(taskName)

Jump into another task under the same parent after executing the current task. Check [Jumping Between Tasks](#jumping-between-tasks).

| Param    | Type                | Description                    |
|----------|---------------------|--------------------------------|
| taskName | <code>String</code> | The name of the sibling task   |

# License

This project is under the MIT license.
