
/**
 * To attach Chai plugins
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var chai           = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    _              = require('lodash');

// Plugins
chai.use(chaiAsPromised);

// Replace symbols with strings
global.Symbol = _.nthArg(0);

// Just an empty function
global.noop = function() {};
