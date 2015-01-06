var proxy = require('../index');
var createCount = require('callback-count');
var should = require('should');
var clone = require('clone');
var mapUtils = require('map-utils');
var exists = mapUtils.exists;

describe('{spy, mux}', function() {
  before(function () {
    this.fn = function (count) {
      process.nextTick(function () {
        count.next();
      });
      return 100;
    };
    this.spy = function (count) {
      process.nextTick(function () {
        count.next();
      });
    };
  });
  it('should call the spy with the same args when the function is invoked', function(done) {
    var count = createCount(2, done);

    var newFn = proxy.spy(this.fn, this.spy);
    var retVal = newFn(count);
    should(retVal).equal(100);
  });
});

describe('{intercept, int}', function() {
  it('should only invoke intercept function if an error exists', function(done) {
    var err = new Error('boom');
    var newFn = proxy.intercept(fn, onError);
    newFn(err);

    function onError (error) {
      should(error).equal(err);
      done();
    }
    function fn () {
      throw new Error('fn should not be invoked if an error occurs');
    }
  });
  it('should act only invoke fn with non error args if no error exists', function(done) {
    var val = 'foo';
    var newFn = proxy.intercept(fn, onError);
    newFn(null, val);

    function fn (arg) {
      arg.should.equal(val);
      done();
    }
    function onError (error) {
      throw new Error('onError should not be invoked if no error occurs');
    }
  });
  it('should act like normal if no error exists and dontSliceError arg is true', function(done) {
    var val = 'foo';
    var dontSliceError = true;
    var newFn = proxy.intercept(fn, onError, true);
    newFn(null, val);

    function fn (err, arg) {
      arg.should.equal(val);
      done();
    }
    function onError (error) {
      throw new Error('onError should not be invoked if no error occurs');
    }
  });
});

describe('{sliceArgs, slice}', function() {
  before(function () {
    this.args = [1,2,3,4,5];
    this.start = 1;
    this.end = 2;
    this.sliced = this.args.slice(this.start, this.end);
  });
  it('should slice the arguments before passing it to the fn', function(done) {
    var sliced = this.sliced;
    var newFn = proxy.sliceArgs(fn, this.start, this.end);
    newFn.apply(null, this.args);
    function fn () {
      var args = Array.prototype.slice.call(arguments);
      args.should.eql(sliced);
      done();
    }
  });
});

describe('{spliceArgs, splice}', function() {
  before(function () {
    this.args = [1,2,3,4,5];
    this.index = 1;
    this.howMany = 1;
    this.els = [6,7];
    this.spliced = clone(this.args);
    this.spliced.splice(this.index, this.howMany, this.els[0], this.els[1]);
  });
  it('should splice the arguments before passing it to the fn', function(done) {
    var spliced = this.spliced;
    var newFn = proxy.spliceArgs(fn, this.index, this.howMany, this.els[0], this.els[1]);
    newFn.apply(null, this.args);
    function fn () {
      var args = Array.prototype.slice.call(arguments);
      args.should.eql(spliced);
      done();
    }
  });
});

describe('{mapArgs, map}', function() {
  describe('default (skip error arg)', function() {
    before(function () {
      this.args = [null, '1','2','3','4','5'];
      this.mapFn = function (v) { return parseInt(v); };
      this.mapped = this.args.slice(1).map(this.mapFn);
      this.mapped.unshift(this.args[0]); // add back error
    });
    it('should map the arguments before passing it to the fn', function(done) {
      var mapped = this.mapped;
      var newFn = proxy.mapArgs(fn, this.mapFn);
      newFn.apply(null, this.args);
      function fn () {
        var args = Array.prototype.slice.call(arguments);
        args.should.eql(mapped);
        done();
      }
    });
  });
  describe('include error arg', function() {
    before(function () {
      this.args = ['1','2','3','4','5'];
      this.mapFn = function (v) { return parseInt(v); };
      this.mapped = this.args.map(this.mapFn);
    });
    it('should map the arguments before passing it to the fn', function(done) {
      var mapped = this.mapped;
      var includeError = true;
      var newFn = proxy.mapArgs(fn, this.mapFn, includeError);
      newFn.apply(null, this.args);
      function fn () {
        var args = Array.prototype.slice.call(arguments);
        args.should.eql(mapped);
        done();
      }
    });
  });
});

describe('{filterArgs, filter}', function() {
  describe('default (skip error arg)', function() {
    before(function () {
      this.args = [null, '1','2','3','4','5'];
      this.filterFn = exists;
      this.filtered = this.args.slice(1).filter(this.filterFn);
      this.filtered.unshift(this.args[0]); // add back error
    });
    it('should filter the arguments before passing it to the fn', function(done) {
      var filtered = this.filtered;
      var newFn = proxy.filterArgs(fn, this.filterFn);
      newFn.apply(null, this.args);
      function fn () {
        var args = Array.prototype.slice.call(arguments);
        args.should.eql(filtered);
        done();
      }
    });
  });
  describe('include error arg', function() {
    before(function () {
      this.args = ['1','2','3','4','5'];
      this.filterFn = exists;
      this.filtered = this.args.filter(this.filterFn);
    });
    it('should filter the arguments before passing it to the fn', function(done) {
      var filtered = this.filtered;
      var includeError = true;
      var newFn = proxy.filterArgs(fn, this.filterFn, includeError);
      newFn.apply(null, this.args);
      function fn () {
        var args = Array.prototype.slice.call(arguments);
        args.should.eql(filtered);
        done();
      }
    });
  });
});

describe('{pluckArgs, pluck}', testMapArgsHelper('pluck', ['foo']));

describe('{pickArgs, pick}', testMapArgsHelper('pick', ['foo']));

describe('{omitArgs, omit}', testMapArgsHelper('omit', ['foo']));

describe('{setArgs, set}', testMapArgsHelper('set', ['foo', 'baz']));

describe('{unsetArgs, unset}', testMapArgsHelper('unset', ['foo', 'baz']));

function testMapArgsHelper (mapFnName, mapFnArgs) {
  return function () {
    describe('default (skip error arg)', function() {
      before(function () {
        this.args = [null, {foo:1, bar:1}, {foo:2, bar:1}, {foo:3, bar:1}];
        this.mapped = this.args.slice(1).map(mapUtils[mapFnName].apply(mapUtils, mapFnArgs));
        this.mapped.unshift(this.args[0]); // add back error
      });
      it('should '+mapFnName+' the arguments before passing it to the fn', function(done) {
        var mapped = this.mapped;
        var newFn = proxy[mapFnName].apply(proxy, [fn].concat(mapFnArgs));
        newFn.apply(null, this.args);
        function fn () {
          var args = Array.prototype.slice.call(arguments);
          args.should.eql(mapped);
          done();
        }
      });
    });
    describe('include error arg', function() {
      before(function () {
        this.args = [{foo:1, bar:1}, {foo:2, bar:1}, {foo:3, bar:1}];
        this.mapped = this.args.map(mapUtils[mapFnName].apply(mapUtils, mapFnArgs));
      });
      it('should '+mapFnName+' the arguments before passing it to the fn', function(done) {
        var mapped = this.mapped;
        var includeError = true;
        var newFn = proxy[mapFnName].apply(proxy, [fn].concat(mapFnArgs).concat(true));
        newFn.apply(null, this.args);
        function fn () {
          var args = Array.prototype.slice.call(arguments);
          args.should.eql(mapped);
          done();
        }
      });
    });
  };
}