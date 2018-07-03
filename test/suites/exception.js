/**
 * Tests for exceptions handling
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var chai   = require('chai'),
    sinon  = require('sinon');
var Flowa  = require('../../index.js');
var expect = chai.expect;

/**
 * Run tests
 * 
 * @param {Object} sample
 */
module.exports = function(sample) {

  var flowa = new Flowa(sample.flow, 'ping');
  var runResult = null;

  before(function() {

    runResult = flowa.run();

    // To (unhandled promise rejection) prevent warnings
    runResult.catch(noop);

  });

  describe('Error Handling', function() {

    it('Should be rejected', function() {
      
      return expect(runResult).to.be.rejected;

    });

    it('Should be rejected with the thrown exception', function() {
      
      return expect(runResult).to.be.rejectedWith(sample.hints.error);

    });

  });

};
