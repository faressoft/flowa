/**
 * Tests for exceptions handling
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
  var runResult = null;

  describe('Error Handling', function() {

    before(function() {

      runResult = flowa.run();

      // To (unhandled promise rejection) prevent warnings
      runResult.catch(noop);

    });

    it('Should be rejected', function() {
      
      return expect(runResult).to.be.rejected;

    });

    it('Should be rejected with the same thrown error object', function() {
      
      // the error hint is defined
      if (typeof sample.hints.error !== 'unhandled') {
        return expect(runResult).to.be.rejectedWith(sample.hints.error);
      }

    });

    it('Should be rejected with the same thrown error message', function() {
      
      // The errorMessage hint is defined
      if (typeof sample.hints.errorMessage !== 'unhandled') {
        return expect(runResult).to.be.rejectedWith(Error, sample.hints.errorMessage);
      }

    });

  });

};
