function-proxy [![Build Status](https://travis-ci.org/tjmehta/function-proxy.png)](https://travis-ci.org/tjmehta/function-proxy)
==============

Proxy functions with functions for modifying arguments, intercepting errors, or spying

# Spies

### spy(fn, spyFn) aka mux

useful for tests, to ensure a function is invoked

```js
var spy = require('function-proxy').spy;

request.get('http://google.com', spy(cb, spyFn));
function cb (err, res) {
  console.log(res.statusCode); // 200
}
function spyFn (err, res) {
  console.log(res.statusCode); // 200
}
```

### spyOnMethod(obj, methodName, spyFn)

useful for tests, to ensure an object method is invoked

```js
var spyOnMethod = require('function-proxy').spyOnMethod;
var utils = {
  exists: function (val) {...}
}
spyOnMethod(utils, 'exists', spy);
utils.exists('test'); // returns true like normal

function spy (val) {
  console.log(val); // test
}
```

### spyOnClassMethod(obj, methodName, spyFn)

useful for tests, to ensure a Class method is invoked

```js
var spyOnClassMethod = require('function-proxy').spyOnClassMethod;
var Animal = require('./Animal');
var animal = new Animal();

spyOnMethod(Animal, 'setIsMammal', spy);

animal.setIsMammal(true);
console.log(animal.isMammal); // true, method worked like normal

function spy (val) {
  console.log(val); // true, spy was also invoked
}
```

# Error Intercept

### intercept(fn, onError) aka int

useful for calling back a common onError function

only invokes onError if error exists

```js
var intercept = require('function-proxy').intercept;
var newFn = intercept(fn, onError)
newFn(new Error('boom'));

function onError (err) {
  console.error(err.message); // boom
}
function fn (...) {...}; // was never invoked
```

only invokes fn if error does not exist, also does not pass error to fn

```js
var intercept = require('function-proxy').intercept;
var newFn = intercept(fn, onError)
newFn(null, 'hello');

function fn (str) { // notice no error arg
  console.log(str); // hello
}
function onError (...) {...}; // was never invoked
```

invokes fn with error if dontSliceError arg is true

```js
var intercept = require('function-proxy').intercept;
var dontSliceError = true;
var newFn = intercept(fn, onError, dontSliceError) // true indicates pass on error to fn
newFn(null, 'hello');

function fn (err, str) { // notice HAS error arg
  // err will always not exist here.
  console.log(str); // hello
}
function onError (...) {...}; // was never invoked
```

# Transform Args like Arrays

### sliceArgs(fn, start, end) aka slice

allows you to slice off arguments you dont care for (Array.prototype.slice for arguments)

```js
var sliceArgs = require('function-proxy').sliceArgs;
var newFn = sliceArgs(fn, 0, 1)
newFn('foo', 'bar', 'baz');

function fn (a, b, c) {
  console.log(arguments); // { 0:'foo' } , 'bar' and 'baz' were not passed
};
```

### spliceArgs(fn, index, howMany /*, elementsToInsert.. */) aka splice

allows you to splice arguments (remove and/or add add args), (Array.prototype.splice for arguments)

```js
var spliceArgs = require('function-proxy').spliceArgs;
var newFn = spliceArgs(fn, 0, 1, 'inserted')
newFn('foo', 'bar');

function fn (a, b, c) {
  console.log(arguments); // { 0:'inserted', 1:'bar' }, overrode foo with splice
};
```

### mapArgs(fn, mapFn [, includeError]) aka map

allows you to map arguments to new values before passing them along

```js
var mapArgs = require('function-proxy').mapArgs;
var newFn = mapArgs(fn, parseToInt)
newFn(null, '1', '2');

function fn (err, a, b) {
  console.log(arguments); // { 0:null, 1:1, 2:2 }, args were parsed from Strings to Integers
};
```

```js
var mapArgs = require('function-proxy').mapArgs;
var includeError = true; // includeError specifies not to skip the error arg (args[0])
var newFn = mapArgs(fn, parseToInt, includeError)
newFn('1', '2');

function fn (a, b) {
  console.log(arguments); // { 0:1, 1:2 }, args were parsed from Strings to Integers
};
```

### filterArgs(fn, filterFn [, includeError]) aka filter

allows you to filter (remove) arguments passed

```js
var filterArgs = require('function-proxy').filterArgs;
var newFn = filterArgs(fn, exists)
newFn(null, 'foo', null, 'bar');

function fn (err, a, b) {
  console.log(arguments); // { 0:null, 1:'foo', 2:'bar' }, null args were ignored
};
```

```js
var filterArgs = require('function-proxy').filterArgs;
var newFn = filterArgs(fn, exists)
newFn('foo', null, 'bar');

function fn (err, a, b) {
  console.log(arguments); // { 0:'foo', 1:'bar' }, null args were ignored
};
```

# Map Args Transforms (inherited from [tjmehta/map-utils](http://github.com/tjmehta/map-utils))

### pickArgs(fn, keys..., includeError) aka pick

picks keys off each arg before passing

### omitArgs(fn, keys..., includeError) aka omit

omits keys off each arg before passing

### setArgs(fn, setObj, includeError) aka set
### setArgs(fn, key, value, includeError)

sets keys and values on each arg before passing

### unsetArgs(fn, key, value, includeError) aka unset

unsets keys on each arg before passing

### pluckArgs(fn, key, includeError) aka pluck

allows you map each arg to a key on the arg

# mixed example

```js
var pluckArgs = require('function-proxy').pluckArgs;
var sliceArgs = require('function-proxy').sliceArgs;
request.get('http://google.com', pluckArgs(sliceArgs(cb, 0, 1), 'statusCode'));

function cb (err, statusCode) {
  console.log(statusCode); // 200, yay google is up
};
```

# License
MIT