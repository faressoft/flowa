/**
 * Tests for the flow and runners types
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var chai = require('chai'),
    TicksTracer = require('ticks-tracer'),
    sinon = require('sinon'),
    _ = require('lodash');
var Flowa = require('../../index.js');
var expect = chai.expect;

/**
 * Run tests
 * 
 * @param {Object} sample
 */
module.exports = function(sample) {

  var flowa = new Flowa(sample.flow, 'ping');
  
  var context = {};
  var ticksTracer = null;
  var debugCallback = sinon.spy();

  // The context status at each tick
  var actualTimeline = [];

  var runOptions = {
    debug: true,
    debugCallback: debugCallback
  };

  if (typeof sample.hints.options != 'undefined') {
    _.defaults(runOptions, sample.hints.options);
  }

  describe('Flow', function() {

    before(function() {

      // Start tracing the context object
      ticksTracer = new TicksTracer(context);

      // Execute the flow
      return flowa.run(context, runOptions).then(function(result) {

        // Stop the tracing
        ticksTracer.stop();

        // Get the context status at each tick
        actualTimeline = ticksTracer.getSnapshotsDiffs();

      }).catch(function(error) {

        // Stop the tracing
        ticksTracer.stop();

        throw error;
        
      });
      
    });

    describe('Execution Timeline', function() {

      // Foreach tick in the expected timeline
      sample.hints.timeline.forEach(function(expectedContextState, index) {

        describe('At tick ' + index, function() {

          // Foreach task
          _.forIn(expectedContextState, function(callsCounter, taskName) {

            it('Should execute the task "' + taskName + '"', function() {

              expect(actualTimeline[index]).to.have.property(taskName);
              expect(actualTimeline[index][taskName]).to.equal(callsCounter);

            });
            
          });

          it('Should not execute more tasks', function() {

            var actualExecutedTasks = Object.keys(actualTimeline[index]);
            var expectedExecutedTasks = Object.keys(expectedContextState);

            // Not expected actually executed tasks
            var tasksDiff = _.difference(actualExecutedTasks, expectedExecutedTasks);

            return expect(tasksDiff).to.be.empty;
            
          });

        });
        
      });

    });

    describe('Execution Debugging', function() {
      
      it('Should call the debugCallback ' + sample.hints.debugLogs.length + ' times', function() {

        expect(debugCallback.callCount).to.equal(sample.hints.debugLogs.length);
        
      });

      // Foreach debug log in the expected debugLogs
      sample.hints.debugLogs.forEach(function(expectedDebugLog, index) {

        var taskName = _.trimStart(expectedDebugLog, '.');

        describe('Debug the task "' + taskName + '" when it is executed', function() {
          
          it('Should call the debugCallback with "' + expectedDebugLog + '"', function() {

            return expect(expectedDebugLog).to.equal(debugCallback.getCall(index).args[0]);

          });

        });
        
      });

    });
      
  });

};
