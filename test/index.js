/**
 * The main tests for Flowa
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var expect                 = require('chai').expect,
    deepcopy               = require('deepcopy');
var Flowa                  = require('../index.js'),
    nestedFlow             = require('./flows/nested.js'),
    simpleWithoutTypesFlow = require('./flows/simple_without_types.js');
    nestedWithoutTypesFlow = require('./flows/nested_without_types.js');

describe('Properties', function() {

  var flowa = new Flowa(nestedFlow);
  var flowaWithName = new Flowa(nestedWithoutTypesFlow, 'ping');

  describe('name', function() {

    it('Should store the task flow name if passed', function() {

      expect(flowaWithName.name).to.equal('ping');

    });
    
    it('Should store null as the flow name if not passed', function() {

      expect(flowa.name).to.be.null;

    });
    
  });

  describe('_root', function() {

    it('Should be a reference to the passed flow', function() {

      expect(flowa._root).to.be.equal(nestedFlow);

    });
    
  });

  describe('_tasks', function() {
    
    it('Should index tasks by their names', function() {

      expect(flowa._tasks).to.be.an('object').and.deep.equal({
        group1: nestedFlow.group1,
        group2: nestedFlow.group1.group2,
        group3: nestedFlow.group1.group3,
        group4: nestedFlow.group1.group3.group4,
        task1: nestedFlow.task1,
        task2: nestedFlow.group1.task2,
        task3: nestedFlow.group1.task3,
        task4: nestedFlow.group1.group2.task4,
        task5: nestedFlow.group1.group2.task5,
        task6: nestedFlow.group1.group3.task6,
        task7: nestedFlow.group1.group3.task7,
        task8: nestedFlow.group1.group3.group4.task8,
        task9: nestedFlow.group1.group3.group4.task9,
        task10: nestedFlow.group1.group3.task10,
        task11: nestedFlow.task11,
        task12: nestedFlow.task12,
      });

    });

  });

  describe('_runners', function() {
    
    it('Should be an object', function() {

      expect(flowa._runners).to.be.an('object');

    });

  });

  describe('_tasksRunnersTypes', function() {
    
    it('Should be a mapping between tasks names and their runners types', function() {

      expect(flowa._tasksRunnersTypes).to.be.an('object').and.deep.equal({
        group1: 'series',
        group2: 'parallel',
        group3: 'parallel',
        group4: 'series',
        task1: 'series',
        task2: 'parallel',
        task3: 'parallel',
        task4: 'series',
        task5: 'series',
        task6: 'series',
        task7: 'series',
        task8: 'parallel',
        task9: 'parallel',
        task10: 'series',
        task11: 'series',
        task12: 'series'
      });

    });

  });

  describe('_tasksDepths', function() {

    it('Should be a mapping between tasks names and their depths', function() {

      expect(flowa._tasksDepths).to.be.an('object').and.deep.equal({
        group1: 1,
        group2: 2,
        group3: 2,
        group4: 3,
        task1: 1,
        task2: 2,
        task3: 2,
        task4: 3,
        task5: 3,
        task6: 3,
        task7: 3,
        task8: 4,
        task9: 4,
        task10: 3,
        task11: 1,
        task12: 1
      });
  
    });

  });

  describe('_tasksParents', function() {

    it('Should be a mapping between tasks names and their parents tasks\' names', function() {

      expect(flowa._tasksParents).to.be.an('object').and.deep.equal({
        group1: flowa._rootName,
        group2: 'group1',
        group3: 'group1',
        group4: 'group3',
        task1: flowa._rootName,
        task2: 'group1',
        task3: 'group1',
        task4: 'group2',
        task5: 'group2',
        task6: 'group3',
        task7: 'group3',
        task8: 'group4',
        task9: 'group4',
        task10: 'group3',
        task11: flowa._rootName,
        task12: flowa._rootName
      });
  
    });

  });
  
  describe('_defaultType', function() {

    it('Should be the series runner type', function() {

      expect(flowa._defaultType).to.equal('series');
  
    });

  });
  
});

describe('Methods', function(callback) {
  
  describe('_setDefaultType()', function() {

    var simpleFlow = deepcopy(simpleWithoutTypesFlow);
    var simpleFlowParallell = deepcopy(simpleWithoutTypesFlow);
    var nestedFlow = deepcopy(nestedWithoutTypesFlow);

    simpleFlowParallell.type = 'parallel';
    nestedFlow.group1.type = 'parallel';

    var simpleFlowa = new Flowa(simpleFlow);
    var simpleFlowaParallel = new Flowa(simpleFlowParallell);
    var nestedFlowa = new Flowa(nestedFlow);

    it('Should not set the default type if the type is already set', function() {

      expect(simpleFlowaParallel._tasksRunnersTypes).to.be.an('object').and.deep.equal({
        task1: 'parallel',
        task2: 'parallel',
        task3: 'parallel'
      });

    });
    
    it('Should set the default type for a flow with no nested tasks if not set', function() {

      expect(simpleFlowa._tasksRunnersTypes).to.be.an('object').and.deep.equal({
        task1: 'series',
        task2: 'series',
        task3: 'series'
      });

    });
    
    it('Should set the default type for all nested tasks if not set', function() {

      expect(nestedFlowa._tasksRunnersTypes).to.be.an('object').and.deep.equal({
        group1: 'series',
        group2: 'parallel',
        group3: 'parallel',
        group4: 'series',
        task1: 'series',
        task2: 'parallel',
        task3: 'parallel',
        task4: 'series',
        task5: 'series',
        task6: 'series',
        task7: 'series',
        task8: 'series',
        task9: 'series',
        task10: 'series',
        task11: 'series',
        task12: 'series'
      });

    });
    
  });

});

