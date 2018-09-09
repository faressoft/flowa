/**
 * Tests for initialization exceptions throwing
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

  describe('Init Error Throwing', function() {

    it('Should throw an exception with the same thrown error message', function() {

      expect(function() {

        new Flowa(sample.flow);
        
      }).to.throw(sample.hints.errorMessage);
      
    });

    it('Should throw an exception with the same thrown error message if initialized with a name', function() {

      expect(function() {

        new Flowa(sample.flow, 'ping');
        
      }).to.throw(sample.hints.errorMessage);

    });

  });

};
