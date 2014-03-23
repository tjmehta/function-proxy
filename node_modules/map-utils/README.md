map-utils [![Build Status](https://travis-ci.org/tjmehta/map-utils.png)](https://travis-ci.org/tjmehta/map-utils)
========

### works with great with Array.map

## exists
### return true for any value other than ull or undefined
```js
var utils = require('map-utils');

utils.exists(null);      // false
utils.exists(undefined); // false
utils.exists('foo');     // true
```

## pick
### accepts keys and returns a function which accepts an object and return a new object with the keys specified
```js
var utils = require('map-utils');
var arr = [
  {
    foo: 1,
    bar: 1,
    qux: 1
  },
  {
    foo: 2,
    bar: 2,
    qux: 2
  }
];

arr.map(utils.pick('foo', 'bar'));
/*
  [
    {
      foo: 1,
      bar: 1
    },
    {
      foo: 2,
      bar: 2
    }
  ]
*/
```

## omit
### accepts keys and returns a function which accepts an object and returns a new object without the keys specified
```js
var utils = require('map-utils');
var arr = [
  {
    foo: 1,
    bar: 1,
    qux: 1
  },
  {
    foo: 2,
    bar: 2,
    qux: 2
  }
];

arr.map(utils.omit('foo', 'bar'));
/*
  [
    {
      qux: 1
    },
    {
      qux: 2
    }
  ]
*/
```

## pluck
### accepts keys and returns a function which accepts an object and returns the value of the key specified
```js
var utils = require('map-utils');
var arr = [
  {
    foo: 1,
    bar: 1,
    qux: 1
  },
  {
    foo: 2,
    bar: 2,
    qux: 2
  }
];

arr.map(utils.pluck('foo')); // [1, 2]
```

## set
### accepts obj or key val arguments and returns a function which accepts an object which those key/values will be set on
```js
var utils = require('map-utils');
var arr1 = [
  {
    foo: 1,
    bar: 1
  },
  {
    foo: 2,
    bar: 1
  }
];
var arr2 = [
  {
    foo: 1
  },
  {
    foo: 2
  }
];

arr1.map(utils.set('qux', 1));
arr2.map(utils.set({ bar:1, qux:1 }));
/* both arr and arr2 becom:
  [
    {
      foo: 1,
      bar: 1,
      qux: 1
    },
    {
      foo: 2,
      bar: 1,
      qux: 1
    }
  ]
*/
```

## unset
### accepts keys and returns a function which accepts an object which those keys will be deleted from
```js
var utils = require('map-utils');
var arr = [
  {
    foo: 1,
    bar: 1,
    qux: 1
  },
  {
    foo: 2,
    bar: 2,
    qux: 2
  }
];

arr.map(utils.unset('foo', 'bar'));
/* arr becomes:
  [
    {
      foo: 1,
      bar: 1
    },
    {
      foo: 2,
      bar: 2
    }
  ]
*/
```