var utils = require('../index.js');

describe('exists', function () {
  it('should return true for a real value', function () {
    utils.exists(0).should.equal(true);
  });
  it('should return false for null', function () {
    utils.exists(null).should.equal(false);
  });
  it('should return false for undefined', function () {
    utils.exists(undefined).should.equal(false);
  });
});

describe('pick', function () {
  it('should pick a key from an object', function () {
    var obj = {
      foo: 1,
      bar: 2,
      qux: 3
    };
    utils.pick('foo')(obj).should.eql({ foo: 1 });
  });
  it('should pick multiple keys from an object', function () {
    var obj = {
      foo: 1,
      bar: 2,
      qux: 3
    };
    utils.pick('foo', 'qux')(obj).should.eql({
      foo: 1,
      qux: 3
    });
  });
  it('should pick multiple keys from an object (as an array)', function () {
    var obj = {
      foo: 1,
      bar: 2,
      qux: 3
    };
    utils.pick(['foo', 'qux'])(obj).should.eql({
      foo: 1,
      qux: 3
    });
  });
});

describe('omit', function () {
  it('should omit a key from an object', function () {
    var obj = {
      foo: 1,
      bar: 2,
      qux: 3
    };
    utils.omit('foo')(obj).should.eql({
      bar: 2,
      qux: 3
    });
  });
  it('should omit multiple keys from an object', function () {
    var obj = {
      foo: 1,
      bar: 2,
      qux: 3
    };
    utils.omit('foo', 'qux')(obj).should.eql({
      bar: 2
    });
  });
});

describe('pluck', function () {
  it('should pluck a key from an object', function () {
    var obj = {
      foo: 1,
      bar: 2,
      qux: 3
    };
    utils.pluck('foo')(obj).should.equal(1);
  });
});

describe('set', function () {
  it('should set a key and value on an object', function () {
    var obj = {};
    utils.set('foo', 1)(obj).should.eql({
      foo: 1
    });
  });
  it('should set multiple keys and values on an object', function () {
    var obj = {
      foo: 1
    };
    var set = {
      bar: 2,
      qux: 3
    };
    utils.set(set)(obj).should.eql({
      foo: 1,
      bar: 2,
      qux: 3
    });
  });
});

describe('unset', function () {
  it('should unset a key and value on an object', function () {
    var obj = {
      foo: 1,
      bar: 2,
      qux: 3
    };
    utils.unset('foo')(obj);
    obj.should.eql({
      bar: 2,
      qux: 3
    });
  });
  it('should unset multiple keys and values on an object', function () {
    var obj = {
      foo: 1,
      bar: 2,
      qux: 3
    };
    utils.unset('foo', 'bar')(obj);
    obj.should.eql({
      qux: 3
    });
  });
});