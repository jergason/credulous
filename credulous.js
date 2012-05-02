(function () {
  "use strict";

  /**
   * Constructor for the Naive Bayes learner.
   * It takes a list of strings, which represent the different
   * groups of strings to train on, followed by an array of possible
   * classes.
   *
   * @param options: object of options that set up the naive bayes model.
   * It *must* have a `label` property that is an array of possible labels to assign
   * to things we are classifying.
   * It can optionally have a `dataLength` that specifies how many groups of strings
   * we are classifying. This is useful if we are classifying things that have several
   * separate attributes that we want to compute probabilities for separately. For
   * example, when calssifying an email, we might have three separate things to classify
   * on: the text of the email, the text of the subject, and the country of origin in
   * the sender's address. In this case, we would set `dataLength` to 3, and pass these
   * in as three separate arguments to the `train()` method.
   */
  function Credulous(options) {
    var i
      ;
    if (!this) {
      return new Credulous(options);
    }

    options = validateOptions(options);

    this.labels = options.labels;
    this.dataLength = options.dataLength;
    // For the label
    this.trainArgumentsLength = this.dataLength + 1;

    // TODO: make the data store more modular
    this.dataStore = [];
    for (i = 0; i < this.dataLength; i++) {
      this.dataStore[i] = {};
    }
    this.instancesTrained = 0;
  }

  function validateOptions(opts) {
    if (!opts || !opts.labels) {
      throw new Error('Constructor needs options object with "labels" and "dataLength" attributes.');
    }
    if (!opts.dataLength) {
      opts.dataLength = 1;
    }
    return opts;
  }

  // TODO: need a count for each word given a label, and a count for each label
  function initializeWordInDatastore(datastore, word, labels) {
    datastore.labels = {}
    datastore.words = {};
    datastore.words[word] = {};
    labels.forEach(function (label) {
      datastore.words[word][label] = 0;
      datastore.labels[label] = 0;
    });
  }

  function labelIsInPossibleLabels(label, labels) {
    return labels.indexOf(label) !== -1;
  }

  /**
   * Train the model with the given parameters.
   * @parameters - a list of strings that represents the attributes of the instance to classify.
   * The last parameter in the list is the label of the instance (ie 'spam', 'not spam', etc.
   */
  // TODO: handle laplacian correction
  Credulous.prototype.train = function() {
    // TODO: fix this awfulness
    var args = argsToArray(arguments)
      , length = args.length
      , label = popOffLabel(args)
      , self = this
      ;
    if (length != this.trainArgumentsLength) {
      throw new Error('Wrong number of training arguments! Did you forget the class?')
    }

    if (!labelIsInPossibleLabels(label, this.labels)) {
      throw new Error('Trained label not in possible labels!');
    }

    args.forEach(function (element, i, collection) {
      var elements = processString(element);
      // have a section for each word.
      // have a label as well
      // for this word, when the label was this, the count was this
      elements.forEach(function (word) {
        if (!self.dataStore[i][word]) {
          initializeWordInDatastore(self.dataStore[i], word, self.labels);
        }

        self.dataStore[i].words[word][label]++
        self.dataStore[i].labels[label]++;
      });
    });

    this.instancesTrained++;
  };

  Credulous.prototype.classify = function() {
    var args = argsToArray(argments)
      , processedDataItems
      , labelScores = []
      ;

    if (args.length != this.dataLength) {
      throw new Error('Wrong number of classifying arguments!');
    }

    processedDataItems = processDataItems(args);

    // For each possible label:
    //   For each data item:
    //     For each word in the data item:
    //       Look up the probability of a class give this word appears
    this.labels.forEach(function (label, i) {
      labelScores[i] = getProbabilityForLabel(label, this.dataStore);
    });

    return this.labels[argMax(labelScores)];
  };

  /**
   * Return the index of the maximum value in the array.
   * @param array - an array of numerical values
   * @return the index of the largest value in the array.
   */
  function argMax(array) {
    var maxIndex = 0
     , i
     ;
    for (i = 0; i < array.length; i++) {
      if (array[i] > array[maxIndex]) {
        maxIndex = i;
      }
    }
    return i;
  }

  function getProbabilityForLabel(label, dataStore) {
    var processedProbabilities = []
      , n
      ;
    dataStore.forEach(function (dataItem, dataItemIndex) {
      processDataItems[dataItemIndex].forEach(function (word, j) {
        processedProbabilities.push(getProbabilityOfWordGivenLabel(word, label, dataItem));
      });
    });

    return combineProbabilitiesIntoMAP(processedProbabilities);
  }

  function combineProbabilitiesIntoMAP(probabilities) {
    // calculate probability in log space to avoid underflow
    // see http://en.wikipedia.org/wiki/Bayesian_spam_filtering#Other_expression_of_the_formula_for_combining_individual_probabilities
    n = probabilities.reduce(function (runningSum, probability) {
      return runningSum + (Math.log(1 - probability) - Math.log(probability))
    }, 0.0);

    return (1 / (1 + Math.exp(n)));
  }

  function getProbabilityOfWordGivenLabel(word, label, dataStore) {
    // the probability of this word given the given class is the count of the word
    // for that class / the count of all words of the given class
    // TODO: where to do laplacian correction?
    var count = dataStore.words[word][label]
      , totalOfGivenClass = dataStore.labels[label]
      ;

    return count / totalOfGivenClass;
  }

  /**
   * This is terribly named. Process the array of strings into an
   * array of arrays of words, with them stemmed, etc.
   */
  function processDataItems(items) {
    var processedItems = []
      ;

    // TODO: do stemming here
    items.forEach(function (item, i) {
      processedItems[i] = processString(item);
    });
  }

  /**
   * Convert the arguments object into an
   * actual array.
   */
  function argsToArray(args) {
    return Array.prototype.slice.call(args);
  }

  /**
   * Split the string and return the array of words.
   * This is a turrible name.
   */
  function processString(str) {
    // TODO: add stemming
    var words = str.split(/\s+/)
      ;
    return words;
  }

  /**
   * Add to the count of classes seen. Instantiate a new object to hold the
   * classes and counts if it has not been seen yet.
   */
  function addLabel(label, self) {
    if (!(label in self.labels)) {
      self.labels[label] = 1;
    }
    else {
      self.labels[label]++;
    }
  }

  function popOffLabel(args) {
    return args.pop();
  }

  module.exports = Credulous;
}());
