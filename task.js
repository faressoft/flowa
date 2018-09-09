/**
 * Task
 * A temporary task object
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * A temporary task object
 * 
 * @param {String} taskName
 * @param {Object} runVariables
 * @param {Flowa}  flowa
 */
function Task(taskName, runVariables, flowa) {

  /**
   * The name of the task
   * @type {String}
   */
  this.name = taskName;

  /**
   * Variables needed for the current run
   * @type {Object}
   */
  this._runVariables = runVariables;

  /**
   * The Flowa object
   * @type {Flowa}
   */
  this._flowa = flowa;

  /**
   * A sibling task to jump to after executing the task
   * @type {String}
   */
  this._jumpToTask = null;

  /**
   * The task
   * @type {Function|Object}
   */
  this._task = flowa._getTask(taskName);

  /**
   * Is a single task
   * @type {Boolean}
   */
  this._isSingleTask = flowa._isSingleTask(taskName);

  /**
   * The task's runner type
   * @type {String}
   */
  this.runnerType = flowa._tasksRunnersTypes[taskName];

  /**
   * The task's depth
   * @type {Number}
   */
  this.depth = flowa._tasksDepths[taskName];

  /**
   * The task's parent
   * @type {String}
   */
  this.parent = flowa._tasksParents[taskName];

}

/**
 * Set the execution as terminated to skip the remaining tasks
 */
Task.prototype.done = function() {

  this._runVariables.terminated = true;
  
};

/**
 * Jump into another task under the same parent
 * after executing the current task
 *
 * @param {String} taskName
 */
Task.prototype.jump = function(taskName) {

  // Check exists
  if (!this._flowa._isTask(taskName)) {
    throw new Error('Jumping into an invalid task name `' + taskName + '` is not allowd');
  }

  // Check same group
  if (this.parent != this._flowa._getTaskParent(taskName)) {
    throw new Error('Jumping into a task that doesn\'t belong to the same parent task is not allowed');
  }

  this._jumpToTask = taskName;

};

module.exports = Task;
