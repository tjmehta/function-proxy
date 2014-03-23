module.exports = {
  exists: function (v) {
    return v !== null && v !== undefined;
  },
  pick: function (/* keys */) {
    var keys = Array.isArray(arguments[0]) ? arguments[0] :
      Array.prototype.slice.call(arguments);
    return function (obj) {
      var out = {};
      keys.forEach(function (key) {
        out[key] = obj[key];
      });
      return out;
    };
  },
  omit: function (/* omitKeys */) {
    var omitKeys = Array.prototype.slice.call(arguments);
    return function (obj) {
      var out = {};
      Object.keys(obj).forEach(function (key) {
        if (!~omitKeys.indexOf(key)) {
          out[key] = obj[key];
        }
      });
      return out;
    };
  },
  pluck: function (key) {
    return function (obj) {
      return obj[key];
    };
  },
  set: function (key, val) {
    var keyIsObj = (typeof key === 'object');
    var updateSet = keyIsObj ? key : {};
    if (!keyIsObj) updateSet[key] = val;
    return function (obj) {
      Object.keys(updateSet).forEach(function (key) {
        obj[key] = updateSet[key];
      });
      return obj;
    };
  },
  unset: function (/* keys */) {
    var keys = Array.prototype.slice.call(arguments);
    return function (obj) {
      keys.forEach(function (key) {
        delete obj[key];
      });
      return obj;
    };
  }
};