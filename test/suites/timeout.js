/**
 * Tests for the timeout options
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var chai = require('chai'),
    sinon = require('sinon');
var Flowa = require('../../index.js');
var expect = chai.expect;

/**
 * Run tests
 * 
 * @param {Object} sample
 */
module.exports = function(sample) {

  var flowa = new Flowa(sample.flow, 'ping');
  var flowaWithoutName = new Flowa(sample.flow);
  var runResult = null;
  var runResultWithoutName = null;
  var clock = null;

  describe('Timeout', function() {

    before(function() {

      clock = sinon.useFakeTimers();

    });

    after(function() {

      clock.restore();

    });
    
    describe('Flow Timeout Exeeded', function() {
      
      before(function() {

        runResult = flowa.run({}, {timeout: sample.hints.flowExecutionTime - 1});
        runResultWithoutName = flowaWithoutName.run({}, {timeout: sample.hints.flowExecutionTime - 1});

        // To (unhandled promise rejection) prevent warnings
        runResult.catch(noop);
        runResultWithoutName.catch(noop);

        clock.tick(sample.hints.flowExecutionTime - 1);
        
      });

      it('Should be rejected', function() {

        return expect(runResult).to.be.rejected;

      });

      it('Should be rejected with an Error object', function() {

        return expect(runResult).to.be.rejectedWith(Error);

      });

      it('Should be rejected with an Error object with the message "Timeout exeeded for `ping`"', function() {

        return expect(runResult).to.be.rejectedWith(Error, 'Timeout exeeded for `ping`');

      });

      it('Should be rejected with an Error object with the message "Timeout exeeded" if no flow name', function() {

        return expect(runResultWithoutName).to.be.rejectedWith(Error, 'Timeout exeeded');

      });

      it('Should be rejected with an Error object with the code "ETIMEDOUT"', function() {

        return runResult.catch(function(error) {

          expect(error).to.have.a.property('code');
          expect(error.code).to.equal('ETIMEDOUT');

        });

      });

    });

    describe('Flow Timeout Not Exeeded', function() {

      before(function() {

        runResult = flowa.run({}, {timeout: sample.hints.flowExecutionTime + 1});

        // To (unhandled promise rejection) prevent warnings
        runResult.catch(noop);

        clock.tick(sample.hints.flowExecutionTime);
        
      });

      it('Should be resolved', function() {

        return expect(runResult).to.be.fulfilled;

      });

    });

    describe('Task Flow Timeout Exeeded', function() {
      
      before(function() {

        runResult = flowa.run({}, {taskTimeout: sample.hints.taskExecutionTime - 1});
        runResultWithoutName = flowaWithoutName.run({}, {taskTimeout: sample.hints.taskExecutionTime - 1});

        // To (unhandled promise rejection) prevent warnings
        runResult.catch(noop);
        runResultWithoutName.catch(noop);

        clock.tick(sample.hints.taskExecutionTime);
        
      });

      it('Should be rejected', function() {

        return expect(runResult).to.be.rejected;

      });

      it('Should be rejected with an Error object', function() {

        return expect(runResult).to.be.rejectedWith(Error);

      });

      it('Should be rejected with an Error object with the message "Timeout exeeded for `ping`.`task1`"', function() {

        return expect(runResult).to.be.rejectedWith(Error, 'Timeout exeeded for `ping`.`task1`');

      });

      it('Should be rejected with an Error object with the message "Timeout exeeded for `task1`" if no flow name', function() {

        return expect(runResultWithoutName).to.be.rejectedWith(Error, 'Timeout exeeded for `task1`');

      });

      it('Should be rejected with an Error object with the code "ETIMEDOUT"', function() {

        return runResult.catch(function(error) {

          expect(error).to.have.a.property('code');
          expect(error.code).to.equal('ETIMEDOUT');

        });

      });

    });

    describe('Task Flow Timeout Not Exeeded', function() {

      before(function() {

        runResult = flowa.run({}, {taskTimeout: sample.hints.taskExecutionTime + 1});

        // To (unhandled promise rejection) prevent warnings
        runResult.catch(noop);

        clock.tick(sample.hints.flowExecutionTime);
        
      });

      it('Should be resolved', function() {

        return expect(runResult).to.be.fulfilled;

      });

    });

  });

};
