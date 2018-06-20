/**
 * Flowa
 * Flow control for Node.js
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var is       = require('is_js'),
    async    = require('async'),
    _        = require('lodash');
var series   = require('./series'),
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
  this._runners = {series: series, parallel: parallel};

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
  this._defaultType = 'series';

  /**
   * Initialize the Flowa object
   */
  this._init();

}

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
    task.type = this._defaultType;
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
 * Get the runner type for a specific task
 *
 * @param  {String}  taskName
 * @return {String}
 */
Flowa.prototype._getTaskRunnerType = function(taskName) {

  return this._tasksRunnersTypes[taskName];
  
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
 * @param  {String}   taskName
 * @param  {Function} callback called with (task, taskName)
 */
Flowa.prototype.forEachTask = function(taskName, callback) {

  var self = this;

  // Not a compound task
  if (!this._isCompoundTask(taskName)) {
    return;
  }

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
 * Log a specific task
 * 
 * @param {String} taskName
 */
Flowa.prototype._log = function(taskName) {

  // Is the root task
  if (taskName == this._rootName) {
    return;
  }

  // Not a single task
  if (!this._isSingleTask(taskName)) {
    return;
  }

  console.log(_.repeat('..', this._tasksDepths[taskName] - 1) + taskName);
  
};

/**
 * Execute a task
 * 
 * @param {String}   taskName
 * @param {Object}   runVariables
 * @param {Function} callback
 */
Flowa.prototype.runTask = function(taskName, runVariables, callback) {

  var self = this;
  var task = self._tasks[taskName];
  var timeout = runVariables.options.taskTimeout;

  // Timeout is exeeded
  if (runVariables.timedout) {
    return;
  }

  // Debugging is on
  if (runVariables.options.debug) {
    this._log(taskName);
  }

  // Is a single task
  if (self._isCompoundTask(taskName)) {

    // Invalid runner type
    if (is.not.propertyDefined(self._runners, task.type)) {
      throw new Error('The type ' + task.type + ' is not a valid runner type');
    }

    return self._runners[task.type](self, taskName, runVariables, callback);

  }

  self._timeout(task, timeout, runVariables, taskName)(runVariables.context, callback);

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

    try {

      // Execute the function
      asyncFunction.apply(null, args);

    } catch (error) {

      callbackWrapper(error);

    }

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
    timedout: false
  };

  // Set default options
  _.defaults(runVariables.options, {
    timeout: null,
    taskTimeout: null,
    debug: false
  });

  return new Promise(function(resolve, reject) {

    var timeout = runVariables.options.timeout;
    var runTask = self._timeout(self.runTask.bind(self), timeout, runVariables);

    runTask(self._rootName, runVariables, function(error, result) {

      if (error) {
        return reject(error);
      }

      resolve(runVariables.context);
      
    });

  });

};

module.exports = Flowa;
