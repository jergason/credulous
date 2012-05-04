(function () {
  "use strict";
  var assert = require('assert')
    , Credulous = require('../credulous')
    ;

  describe('Credulous', function () {
    describe('constructor', function () {
      it('accepts an options object', function () {
        var credulous
          , opts
          ;
        opts = {
            labels: ['spam', 'not spam']
          , dataLength: 3
        };
        credulous = new Credulous(opts)
      });

      it('throws an error when no options are passed in', function () {
        assert.throws(function () { var foo = new Credulous(); });
      });
    });

    describe('#train', function () {
      var credulous
        ;
      before(function () {
        credulous = new Credulous({labels: ['spam', 'not spam'], dataLength: 2});
      });


      it('takes the required number of arguments', function () {
        assert.doesNotThrow(function () { credulous.train('hurp', 'durp', 'spam'); });
      });

      it('throws an error when it is trained with less than the required number of args', function () {
        assert.throws(function () { credulous.train('One of the things I want to do is train this thing'); });
      });

      it('accepts some data and a class', function () {
        assert.doesNotThrow(function () { credulous.train('hurp durp fooobar', 'jamison', 'spam'); });
      });

      it('errors if the class is not in the labels', function () {
        assert.throws(function () { credulous.train('what it is yo', 'jamison', 'foobar'); }, 'Training with a missing label should throw');
      });
    });

    describe('#classify', function () {
      var credulous
        ;
      before(function () {
        credulous = new Credulous({labels: ['spam', 'not spam'], dataLength: 2});
        credulous.train('hurp dupr sf absdfjf asqdkj', 'qwerqwer asfdhlk', 'spam');
      });

      it('classifies new data without errors', function () {
        credulous.classify('hurp durp durp foobar', 'a hill of beans aint a thing');
      });
    });

    describe('to and from JSON', function () {
      var credulous
        ;
      before(function () {
        credulous = new Credulous({labels: ['spam', 'not spam'], dataLength: 2});
        credulous.train('hurp dupr sf absdfjf asqdkj', 'qwerqwer asfdhlk', 'spam');
      });

      it('saves and loads to and from json correctly', function () {
        var json = credulous.toJSON()
          , newModel = new Credulous({labels: ['foo']})
          ;
        newModel.fromJSON(json);
        assert.equal(credulous.labels, newModel.labels);
        assert.equal(credulous.instancesTrained, newModel.instancesTrained);
        assert.equal(credulous.dataLength, newModel.dataLength);
        assert.equal(credulous.trainArgumentsLength, newModel.trainArgumentsLength);
        assert.equal(credulous.dataStore, newModel.dataStore);
      });
    });
  });
}());
