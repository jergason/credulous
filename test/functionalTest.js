(function () {
  "use strict";
  var fs = require('fs')
    , assert = require('assert')
    , testData = JSON.parse(fs.readFileSync(__dirname + '/weather.json', 'utf8'))
    , Credulous = require('../credulous')
    ;

  describe('credulous training', function () {
    var credulous = new Credulous({ dataLength: 4, labels: ['high', 'low', 'moderate']});
    testData.forEach(function (trainingExample) {
      // Pass in the array as an arguments list
      credulous.train.apply(credulous, trainingExample);
    });

    it('results in sensible probabilities', function () {
      var predictedLabel = credulous.classify('bad', 'high', 'none', 'low')
        ;

      assert.equal(predictedLabel, 'high');
      predictedLabel = credulous.classify('bad', 'low', 'adequate', 'medium');
      assert.equal(predictedLabel, 'moderate');
    });
  });
}());
