var createCount = require('../index');

describe('description', function () {
  it('should callback immediately if not inc', function (done) {
    var count = createCount(done);
    count.next();
  });
  it('should not callback all nexts have been called', function (done) {
    var count = createCount(done);
    count.inc().inc().inc();
    count.next().next().next();
  });
  it('should accept a callback count and not callback until the count is reached', function (done) {
    var count = createCount(3, done);
    count.next().next().next();
  });
  it('should callback with the first error that occurs', function (done) {
    var count = createCount(checkError);
    count.inc().inc().inc();
    var err1 = new Error('1');
    var err2 = new Error('2');
    var err3 = new Error('3');
    count.next(err1).next(err2).next(err3);
    function checkError (err) {
      console.log(err);
      console.log(err.message);
      err.message.should.equal('1');
      done();
    }
  });
});