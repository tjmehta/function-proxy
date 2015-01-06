var proxy = module.exports = {
  spy: function (fn, spy) {
    return function () {
      spy.apply(this, arguments);
      return fn.apply(this, arguments);
    };
  },
  spyOnMethod: function (obj, key, spy) {
    obj[key] = proxy.spy(obj[key], spy);
  },
  spyOnClassMethod: function (Class, methodName, spy) {
    Class.prototype[methodName] = proxy.spy(Class.prototype[methodName], spy);
  },
  intercept: function (fn, onError, dontSliceError) {
    return function (err) {
      if (err !== null && err !== undefined) {
        onError(err);
      }
      else {
        var sliceIndex = dontSliceError ? 0 : 1;
        var args = Array.prototype.slice.call(arguments, sliceIndex);
        fn.apply(this, args);
      }
    };
  },
  sliceArgs: function (fn, start, end) {
    return function () {
      var args = Array.prototype.slice.call(arguments, start, end);
      fn.apply(this, args);
    };
  },
  spliceArgs: function (fn, index, howMany/*[, elements...]*/) {
    var spliceArgs = Array.prototype.slice.call(arguments, 1);
    return function () {
      var args = Array.prototype.slice.apply(arguments);
      args.splice.apply(args, spliceArgs);
      fn.apply(this, args);
    };
  }
};

// inherited array methods
// mapArgs(fn, mapFn, includeError:false)
proxy.mapArgs = applyArrayMethodToArgs('map');
proxy.map = proxy.mapArgs;
// filterArgs(fn, filterFn, includeError:false)
proxy.filterArgs = applyArrayMethodToArgs('filter');
proxy.filter = proxy.filterArgs;

// inherited map utils
// pickArgs, pluckArgs, setArgs, unsetArgs, omitArgs,
// pick, pluck, set, unset, omit
var mapUtils = require('map-utils');
Object.keys(mapUtils).forEach(function (mapFnName) {
  proxy[mapFnName+'Args'] = proxyMap(mapUtils[mapFnName]);
  proxy[mapFnName] = proxy[mapFnName+'Args'];
});

// aliases
proxy.mux = proxy.spy;
proxy.int = proxy.intercept;
proxy.slice = proxy.sliceArgs;
proxy.splice = proxy.spliceArgs;
proxy.pluck = proxy.pluckArgs;

// helpers

function applyArrayMethodToArgs (arrayMethod) {
  return function (fn /*, arrayMethodArgs... , includeError*/) {
    var arrayMethodArgs = Array.prototype.slice.call(arguments, 1);
    var includeError = (typeof last(arrayMethodArgs) === 'boolean') ?
      arrayMethodArgs.pop() :  // none of the inherited method expect a boolean
      false;
    return function () {
      var sliceIndex = includeError ? 0 : 1;
      var args = Array.prototype.slice.call(arguments, sliceIndex);
      args = Array.prototype[arrayMethod].apply(args, arrayMethodArgs);
      if (!includeError) args.unshift(arguments[0]); // readd error after transform
      fn.apply(this, args);
    };
  };
}

function proxyMap (mapFn) {
  return function (fn /*, mapFnArgs... , includeError*/) {
    var mapFnArgs = Array.prototype.slice.call(arguments, 1);
    var includeError = (typeof last(mapFnArgs) === 'boolean') ?
      mapFnArgs.pop() :  // none of the mapFns expect a boolean
      false;
    return proxy.map(fn, mapFn.apply(null, mapFnArgs), includeError);
  };
}

function exists (val) {
  return val !== null && val !== undefined;
}
function last (arr) {
  return arr[arr.length-1];
}