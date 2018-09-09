/**
 * Tests for the static methods
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

  var flowa = Flowa.create(sample.flow, 'ping');
  var flowaWithoutName = Flowa.create(sample.flow);

  describe('Static Methods', function() {

    describe('.create()', function() {

      describe('Returned Value', function() {

        it('Should be instance of Flowa', function() {

          expect(flowa).to.be.an.instanceof(Flowa);

        });
        
      });
      
      describe('name', function() {

        it('Should store the task flow name if passed', function() {

          expect(flowa.name).to.equal('ping');

        });
        
        it('Should store null as the flow name if not passed', function() {

          expect(flowaWithoutName.name).to.be.a('null');

        });
        
      });

      describe('_root', function() {

        it('Should be a reference to the passed flow', function() {

          expect(flowa._root).to.be.equal(sample.flow);

        });
        
      });
      
    });

    describe('.run()', function() {

      describe('Returned Value', function() {

        it('Should a promise', function() {

          expect(Flowa.run(sample.flow)).to.be.an.instanceof(Promise);

        });
        
      });
      
    });

  });

};
