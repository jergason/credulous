#credulous.js

`credulous.js` is a simple implementation of a [Naive Bayes](http://en.wikipedia.org/wiki/Naive_Bayes_classifier)
classifer in JavaScript. You train it with a corpus of strings, and then classify
new strings.


##Isn't There Already A Naive Bayes Classifier For JavaScript?
Yes, but then I wouldn't get to write this one myself!

Also, this one implements some nice trickyness. It lets you classify on multiple
attirbutes, does Laplace correction to better handle infrequently found words, does
calculations in log-space to avoid underflow, and has a few other improvements.

##Installation

###node.js

`credulous.js` is a CommonJS module, so it will work out of the box for node.js. Install
like so:

```bash
npm install credulous
```

###Browser
credulous.js was tested in modern browsers, and relies upon ECMAScript 5 features. That means IE 9 and
above, Chrome, FireFox, and Safai.

If you want to use credulous.js in the browser, [pakmanager](https://github.com/coolaj86/pakmanager.git),
[Ender.js](http://ender.no.de), [browserify](https://github.com/substack/node-browserify) or
[OneJS](https://github.com/azer/onejs) all let you use CommonJS packages in client-side code. See their
documentation for details.

You can also just download a standalone version [here](#some_link_to_standalone_version).

##How To Use It

Enough talk about usage. Get to the codes!

```javascript
var Credulous = require('credulous')
  , model
  , result
  ;

model = new Credulous();
// .train can take a single object or an array of objects
// The objects must be of the form { data: 'some data', class: 'a string representing the class name' }
model.train({ data: 'Great viagra for you!', class: 'spam' });
model.train([{ data: 'UTOSC is the best conference ever!', class: 'not spam'},
             { data: 'Some more strings that are not spam!', class: 'not spam'}]);

result = model.classify('Great opportunity in Nigeria!');
console.log('result is', result);
// 'result is spam'

```

###Advice For Better Results


