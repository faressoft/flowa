/**
 * Tests for essential internal properties
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var chai = require('chai');
var Flowa = require('../../index.js');
var expect = chai.expect;

/**
 * Run tests
 * 
 * @param {Object} sample
 */
module.exports = function(sample) {

  var flowa = new Flowa(sample.flow, 'ping');

  describe('Properties', function() {

    describe('name', function() {

      it('Should store the task flow name if passed', function() {

        expect(flowa.name).to.equal('ping');

      });
      
      it('Should store null as the flow name if not passed', function() {

        expect(new Flowa(sample.flow).name).to.be.a('null');

      });
      
    });

    describe('_root', function() {

      it('Should be a reference to the passed flow', function() {

        expect(flowa._root).to.be.equal(sample.flow);

      });
      
    });

    describe('_tasks', function() {
      
      it('Should index tasks by their names', function() {

        expect(flowa._tasks).to.be.an('object').and.deep.equal(sample.hints.tasks);

      });

    });

    describe('_runners', function() {
      
      it('Should be an object', function() {

        expect(flowa._runners).to.be.an('object');

      });

    });

    describe('_tasksRunnersTypes', function() {
      
      it('Should be a mapping between tasks names and their runners types', function() {

        expect(flowa._tasksRunnersTypes).to.be.an('object').and.deep.equal(sample.hints.tasksRunnersTypes);

      });

    });

    describe('_tasksDepths', function() {

      it('Should be a mapping between tasks names and their depths', function() {

        expect(flowa._tasksDepths).to.be.an('object').and.deep.equal(sample.hints.tasksDepths);
    
      });

    });

    describe('_tasksParents', function() {

      it('Should be a mapping between tasks names and their parents tasks\' names', function() {

        expect(flowa._tasksParents).to.be.an('object').and.deep.equal(sample.hints.tasksParents);
    
      });

    });
    
    describe('_defaultRunnerType', function() {

      it('Should be the serial runner type', function() {

        expect(flowa._defaultRunnerType).to.equal('serial');
    
      });

    });
    
  });

};
