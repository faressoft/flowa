/**
 * Tests for the run() output
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var chai = require('chai'),
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
  var runOptions = {};

  if (typeof sample.hints.options != 'undefined') {
    _.defaults(runOptions, sample.hints.options);
  }

  var runResult = flowa.run(context, runOptions);
  var runWithoutContextResult = flowa.run(undefined, runOptions);

  describe('Output', function() {

    it('Should be resolved with the same passed context', function() {

      return expect(runResult).to.eventually.equal(context).deep.equal(sample.hints.context);

    });
    
    it('Should provide a default context if no context is passed', function() {

      return expect(runWithoutContextResult).to.eventually.be.an('object');

    });

    it('Should return a promise', function() {
      
      expect(runResult).to.be.a('promise');
      expect(runWithoutContextResult).to.be.a('promise');

    });

  });

};
