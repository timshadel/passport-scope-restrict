/**
 * Test dependencies
 */

var metric = require('metric-log')
  , expect = require("expect.js")
  , str = '';

metric.log = function(fmt) { str = fmt; };


/**
 * Demonstrate what passport-scope-restrict does with tests.
 */

describe("passport-scope-restrict", function() {
  // require here so we can hijack metric.log above
  var restrict = require("..");

  beforeEach(function() {
    str = '';
  });

  it("should be a function which creates named middlware", function() {
    expect(restrict().name).to.be.a('string');
    expect(restrict().length).to.be(3);
  });

  describe("should deny a request with authInfo", function(){

    it("when it doesn't contain 'scopes'", function(done) {
      var req = { authInfo: {} };
      var res = { status: function(status) { this._status = status; } };
      restrict()(req, res, function(err) {
        expect(err).to.be.ok();
        expect(res._status).to.be.above(399);
        done();
      });
    });

    it("when 'scopes' doesn't contain the needed scope", function(done) {
      var req = { authInfo: { 'scopes': [] } };
      var res = { status: function(status) { this._status = status; } };
      restrict()(req, res, function(err) {
        expect(err).to.be.ok();
        expect(res._status).to.be.above(399);
        done();
      });
    });

    it("using 404 Not Found instead of 403 Access Denied", function(done) {
      var req = { authInfo: {} };
      var res = { status: function(status) { this._status = status; } };
      restrict()(req, res, function(err) {
        expect(res._status).to.be(404);
        expect(err).to.be.ok();
        done();
      });
    });

    it("and log a metric count of denied requests", function(done) {
      var req = { authInfo: {} };
      var res = { status: function(status) { this._status = status; } };
      restrict()(req, res, function(err) {
        expect(str).to.match(/measure=\S*denied/);
        expect(str).to.match(/val=1/);

        req = { authInfo: { scopes: [] } };
        res.status(undefined);
        restrict()(req, res, function(err) {
          expect(str).to.match(/measure=\S*denied/);
          expect(str).to.match(/val=1/);
          done();
        });
      });
    });

    it("and distinguished denied request reasons in the metric log", function(done) {
      var req = { authInfo: {} };
      var res = { status: function(status) { this._status = status; } };
      restrict()(req, res, function(err) {
        expect(str).to.match(/at=no-scopes/);

        req = { authInfo: { scopes: [] } };
        res.status(undefined);
        restrict()(req, res, function(err) {
          expect(str).to.match(/at=scope-missing/);
          done();
        });
      });
    });

  });


  it("should allow a request with the required scope", function(done){

    var req = { authInfo: { scopes: ['first'] } };
    var res = { status: function(status) { this._status = status; } };
    restrict('first')(req, res, function(err) {
      expect(err).not.to.be.ok();
      expect(res._status).to.be(undefined);
      done();
    });

  });

});
