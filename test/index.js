/**
 * The main tests for Flowa
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var chai       = require('chai'),
    sinon      = require('sinon'),
    requireDir = require('require-dir');
var plugins    = require('./plugins.js'),
    suites     = requireDir('./suites'),
    samples    = requireDir('./samples', {recurse: true});

describe('Sample: Basic/Basic1', function(callback) {
  suites.properties(samples.basic.basic1);
  suites.output(samples.basic.basic1);
});

describe('Sample: Basic/Basic2', function(callback) {
  suites.properties(samples.basic.basic2);
  suites.output(samples.basic.basic2);
});

describe('Sample: Basic/Basic3', function(callback) {
  suites.properties(samples.basic.basic3);
  suites.output(samples.basic.basic3);
});

describe('Sample: Basic/Basic4', function(callback) {
  suites.properties(samples.basic.basic4);
  suites.output(samples.basic.basic4);
});

describe('Sample: Basic/Basic5', function(callback) {
  suites.properties(samples.basic.basic5);
  suites.output(samples.basic.basic5);
});

describe('Sample: Timeout/Timeout1', function(callback) {
  suites.timeout(samples.timeout.timeout1);
});

describe('Sample: Timeout/Timeout2', function(callback) {
  suites.timeout(samples.timeout.timeout2);
});

describe('Sample: Exception/Exception1', function(callback) {
  suites.exception(samples.exception.exception1);
});

describe('Sample: Exception/Exception2', function(callback) {
  suites.exception(samples.exception.exception2);
});

describe('Sample: Exception/Exception3', function(callback) {
  suites.exception(samples.exception.exception3);
});

describe('Sample: Exception/Exception4', function(callback) {
  suites.exception(samples.exception.exception4);
});
