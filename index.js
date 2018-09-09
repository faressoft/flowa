/**
 * Flowa
 * Flow control for Node.js
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var is = require('is_js'),
    async = require('async'),
    _ = require('lodash');
var Task = require('./task'),
    serial = require('./serial'),
    parallel = require('./parallel');

/**
 * Flowa
 * 
 * @param {Object} flow
 * @param {String} name (Optional)
 */
function Flowa(flow, name) {

  /**
   * A name for the flow
   * @type {String}
   */
  this.name = typeof name == 'undefined' ? null : name;

  /**
   * The root task
   * @type {Object}
   */
  this._root = flow;

  /**
   * Tasks indexed by their names
   * @type {Object}
   */
  this._tasks = {};

  /**
   * Runners types and their handlers
   * @type {Object}
   */
  this._runners = {serial: serial, parallel: parallel};

  /**
   * The name of the root task
   * @type {Symbol}
   */
  this._rootName = Symbol('__root__');

  /**
   * A mapping between tasks names and runners types
   * @type {Object}
   */
  this._tasksRunnersTypes = {};

  /**
   * A mapping between tasks names and their depth
   * @type {Object}
   */
  this._tasksDepths = {};

  /**
   * A mapping between tasks names and their parent task's name
   * @type {Object}
   */
  this._tasksParents = {};

  /**
   * The default runner type
   * @type {String}
   */
  this._defaultRunnerType = 'serial';

  /**
   * Initialize the Flowa object
   */
  this._init();

}

/**
 * Create a Flowa object
 * 
 * @param  {Object} flow
 * @param  {String} name (Optional)
 * @return {Flowa}
 */
Flowa.create = function(flow, name) {

  if (typeof name == 'undefined') {
    return new Flowa(flow);
  }

  return new Flowa(flow, name);

};

/**
 * Create a flow and execute it
 * 
 * @param  {Object}  flow
 * @param  {Object}  context a shared object between the tasks (default: {})
 * @param  {Object}  options
 * @return {Promise}
 */
Flowa.run = function(flow, context, options) {

  return Flowa.create(flow).run(context, options);

};

/**
 * Initialize the Flowa object
 *
 * - Call _setDefaultType
 * - Call _indexTasks
 */
Flowa.prototype._init = function() {

  this._setDefaultType(this._root);
  this._indexTasks(this._root, this._rootName, this._root.type, 0, null);

};

/**
 * Set the default type for the compound task if their type is not defined
 * 
 * @param {Object} task
 */
Flowa.prototype._setDefaultType = function(task) {

  var self = this;

  // Is not a compound task, nothing to do
  if (!is.json(task)) {
    return;
  }

  // The type is not defined
  if (typeof task.type == 'undefined') {
    task.type = this._defaultRunnerType;
  }

  // Foreach task
  _.forIn(task, function(task) {

    self._setDefaultType(task);
    
  });
  
};

/**
 * Set _tasks, _tasksRunnersTypes, _tasksDepths, _tasksParents member variables recursivly
 * 
 * @param {Object|Function} task
 * @param {String}          taskName
 * @param {String}          runnerType
 * @param {Number}          depth
 * @param {String}          parentTaskName
 */
Flowa.prototype._indexTasks = function(task, taskName, runnerType, depth, parentTaskName) {

  // The current property is not a task
  if (is.not.function(task) && is.not.json(task)) {
    return;
  }

  // Duplicated task name
  if (is.propertyDefined(this._tasks, taskName)) {
    throw new Error('The task ' + taskName + ' is duplicated. Tasks names should be unique');
  }

  // Invalid runner type
  if (is.not.propertyDefined(this._runners, runnerType)) {
    throw new Error('The type ' + runnerType + ' is not a valid runner type');
  }

  this._tasks[taskName] = task;
  this._tasksDepths[taskName] = depth;
  this._tasksParents[taskName] = parentTaskName;
  this._tasksRunnersTypes[taskName] = runnerType;

  // Is a compound task
  if (this._isCompoundTask(taskName)) {

    // Foreach subtask
    _.forIn(task, _.bind(this._indexTasks, this, _, _, task.type, depth + 1, taskName));

  }
  
};

/**
 * Is a task
 *
 * @param  {String}  taskName
 * @return {Boolean}
 */
Flowa.prototype._isTask = function(taskName) {

  return is.propertyDefined(this._tasks, taskName);
  
};

/**
 * Is a compound task
 *
 * @param  {String} taskName
 * @return {Boolean}
 */
Flowa.prototype._isCompoundTask = function(taskName) {

  return is.json(this._tasks[taskName]);
  
};

/**
 * Is a single task
 *
 * @param  {String} taskName
 * @return {Boolean}
 */
Flowa.prototype._isSingleTask = function(taskName) {

  return is.function(this._tasks[taskName]);
  
};

/**
 * Get the parent task name for a specific task
 *
 * @param  {String}        taskName
 * @return {String|Symbol}
 */
Flowa.prototype._getTaskParent = function(taskName) {

  return this._tasksParents[taskName];
  
};

/**
 * Iterate through child tasks for a specific parent task
 * 
 * @param {String}   taskName
 * @param {Function} callback called with (task, taskName)
 */
Flowa.prototype.forEachTask = function(taskName, callback) {

  var self = this;

  // Foreach sub task
  _.forIn(this._tasks[taskName], function(task, taskName) {

    // Not a task property
    if (!self._isTask(taskName)) {
      return;
    }

    callback(task, taskName);

  });
  
};

/**
 * Get a task by its name
 * 
 * @param  {String}          taskName
 * @return {Function|Object}
 */
Flowa.prototype._getTask = function(taskName) {
  
  return this._tasks[taskName];

};

/**
 * Debug a specific task
 *
 * Calls the `debugCallback` with one string
 * argument in the format: `..TaskName`.
 *
 * Where `..` is repeated n times based on
 * the depth of the task.
 * 
 * @param {String}   taskName
 * @param {Function} debugCallback
 */
Flowa.prototype._debugTask = function(taskName, debugCallback) {

  // Is the root task
  if (taskName == this._rootName) {
    return;
  }

  // Not a single task
  if (!this._isSingleTask(taskName)) {
    return;
  }

  debugCallback(_.repeat('..', this._tasksDepths[taskName] - 1) + taskName);
  
};

/**
 * Execute a task
 *
 * - If the task returns a promise: The callback will
 *   be called manually with the resolved with value
 *   or the rejected with error.
 * - If the task doesn't return a promise and doesn't
 *   take a callback argument: The callback will
 *   be called manually with the returned value as a result.
 * - If the execution is terminated the callback will
 *   be called manually without executing the task.
 * - Inject the result of the task in the context with
 *   a key equal to the task's name if
 *   `runVariables.options.autoInjectResults` = `true`
 * 
 * @param {Task} flowaTask
 * @param {Function}  callback
 */
Flowa.prototype.runTask = function(flowaTask, callback) {

  var self = this;
  var runVariables = flowaTask._runVariables;
  var timeout = runVariables.options.taskTimeout;
  var taskName = flowaTask.name;
  var returnedValue = null;

  // Is the execution terminated
  if (runVariables.terminated) {
    return callback(null);
  }

  // Automatically inject the result of the single tasks
  // into the context object
  if (runVariables.options.autoInjectResults && flowaTask._isSingleTask) {

    var runTaskCallback = callback;

    callback = function(error, result) {

      if (typeof result != 'undefined') {
        runVariables.context[taskName] = result;
      }

      runTaskCallback(error, result);

    };

  }

  // Debugging is on
  if (runVariables.options.debug) {
    this._debugTask(taskName, runVariables.options.debugCallback);
  }

  // Is a compound task
  if (!flowaTask._isSingleTask) {
    return self._runners[flowaTask._task.type](self, taskName, runVariables, callback);
  }

  // Execute the task
  try {

    returnedValue = self._timeout(flowaTask._task.bind(flowaTask), timeout, runVariables, taskName)(runVariables.context, callback);

  } catch (error) {

    return callback(error);

  }

  // Does it return a promise
  if (is.object(returnedValue) && 'then' in returnedValue && 'catch' in returnedValue) {

    return returnedValue.then(callback.bind(null, null)).catch(callback.bind(null));

  }

  // Doesn't return a promise and doesn't take a callback argument
  if (flowaTask._task.length < 2) {

    return callback(null, returnedValue);

  }

};

/**
 * Wrap an asyncFunction with a timer for timeout
 *
 * - If the asyncFunction does not call its callback within the specified timeout:
 *   - Call the callback with an error (code: ETIMEDOUT).
 *   - Set runVariables.timedout to `true`.
 * - Prevent multiple callback calling.
 * - Catch exceptions and throw them via the callback of the asyncFunction.
 * - Don't set a timeout if the passed value is null.
 * 
 * @param  {Function}    asyncFunction
 * @param  {Number|Null} timeout
 * @param  {Object}      runVariables
 * @param  {String|Null} taskName
 * @return {Function}
 */
Flowa.prototype._timeout = function(asyncFunction, timeout, runVariables, taskName) {

  var self = this;
  var timer = null;
  var callbackCalled = false;

  // No timeout
  if (!timeout) {
    return asyncFunction;
  }

  return function() {

    var args = Array.prototype.slice.call(arguments);    
    var callback = args[args.length - 1];
    
    /**
     * A wrapper for the callback to consider the timeout
     * and prevent multiple callback calling
     */
    var callbackWrapper = function() {

      if (callbackCalled) {
        return;
      }

      clearTimeout(timer);
      callbackCalled = true;
      callback.apply(null, arguments);
      
    };

    // Replace the original callback with the callbackWrapper
    args[args.length - 1] = callbackWrapper;

    // Timeout timer
    timer = setTimeout(function() {

      var error = new Error('Timeout exeeded');
      
      error.code = 'ETIMEDOUT';
      runVariables.timedout = true;

      // Append flow name and taskName if set
      if (self.name && taskName) {

        error.message = 'Timeout exeeded for `' + self.name + '`.`' + taskName + '`';

      // Append flow name if set
      } else if (self.name) {

        error.message = 'Timeout exeeded for `' + self.name + '`';

      } else if (taskName) {
        
        error.message = 'Timeout exeeded for `' + taskName + '`';

      }

      callbackWrapper(error);

    }, timeout);

    // Execute the function
    asyncFunction.apply(null, args);

  };

};

/**
 * Execute the flow
 *
 * @param  {Object}  context a shared object between the tasks (default: {})
 * @param  {Object}  options
 * @return {Promise}
 */
Flowa.prototype.run = function(context, options) {

  var self = this;

  // Variables needed for the current run
  var runVariables = {
    context: typeof context == 'undefined' ? {} : context,
    options: typeof options == 'undefined' ? {} : options,
    terminated: false,
    timedout: false
  };

  // Set default options
  _.defaults(runVariables.options, {
    timeout: null,
    taskTimeout: null,
    autoInjectResults: true, // Inject the result of each task into the context
    debug: false,
    debugCallback: console.log
  });

  return new Promise(function(resolve, reject) {

    var timeout = runVariables.options.timeout;
    var runTask = self._timeout(self.runTask.bind(self), timeout, runVariables);
    var flowaTask = new Task(self._rootName, runVariables, self)

    runTask(flowaTask, function(error, result) {

      if (error) {
        return reject(error);
      }

      resolve(runVariables.context);
      
    });

  });

};

module.exports = Flowa;
