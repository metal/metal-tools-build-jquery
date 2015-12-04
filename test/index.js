'use strict';

var assert = require('assert');
var del = require('del');
var fs = require('fs');
var metalToolsBuildJQuery = require('../index');
var sinon = require('sinon');
var vfs = require('vinyl-fs');

describe('Metal Tools - Build JQuery', function() {
  before(function() {
    // Suppress warnings related to the JQueryAdapter source
    // not being found. We don't care about that for the tests.
    sinon.stub(console, 'warn');
  });

  after(function() {
    console.warn.restore();
  });

  describe('Default src/dest', function() {
    beforeEach(function() {
      var pipe = {
        pipe: function() {
          return pipe;
        }
      };
      sinon.stub(vfs, 'src').returns(pipe);
      sinon.stub(vfs, 'dest');
    });

    afterEach(function() {
      vfs.src.restore();
      vfs.dest.restore();
    });

  	it('should compile soy files from "src" and to "build/jquery" by default', function() {
      metalToolsBuildJQuery();
      assert.strictEqual('src/**/*.js', vfs.src.args[0][0]);
      assert.strictEqual('build/jquery', vfs.dest.args[0][0]);
  	});
  });

  describe('Integration', function() {
    beforeEach(function(done) {
      deleteBuiltFiles(done);
    });

  	after(function(done) {
      deleteBuiltFiles(done);
  	});

  	it('should compile specified soy files to single bundle and source map', function(done) {
      var stream = metalToolsBuildJQuery({
        src: 'test/fixtures/js/foo.js',
        dest: 'test/fixtures/build'
      });
      stream.on('end', function() {
        assert.ok(fs.existsSync('test/fixtures/build/metal.js'));
        assert.ok(fs.existsSync('test/fixtures/build/metal.js.map'));
    		done();
      });
  	});
  });
});

function deleteBuiltFiles(done) {
  del('test/fixtures/build').then(function() {
    done();
  });
}
