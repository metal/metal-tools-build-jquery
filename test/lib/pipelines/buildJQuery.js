'use strict';

var assert = require('assert');
var buildJQuery = require('../../../lib/pipelines/buildJQuery');
var consume = require('stream-consume');
var sinon = require('sinon');
var vfs = require('vinyl-fs');

describe('Pipeline - Build JQuery', function() {
  before(function() {
    // Suppress warnings related to the JQueryAdapter source
    // not being found. We don't care about that for the tests.
    sinon.stub(console, 'warn');
  });

  after(function() {
    console.warn.restore();
  });

	it('should build js files to a single bundle and its source map', function(done) {
		var stream = vfs.src('test/fixtures/js/Bar.js')
      .pipe(buildJQuery());

    var files = [];
    stream.on('data', function(file) {
			files.push(file.relative);
		});
		stream.on('end', function() {
			assert.strictEqual(2, files.length);
			assert.deepEqual(['metal.js', 'metal.js.map'], files.sort());
			done();
		});
		consume(stream);
	});

	it('should build js files to a single bundle without its source map', function(done) {
		var stream = vfs.src('test/fixtures/js/Bar.js')
      .pipe(buildJQuery({
        sourceMaps: false
      }));

    var files = [];
    stream.on('data', function(file) {
			files.push(file.relative);
		});
		stream.on('end', function() {
			assert.strictEqual(1, files.length);
			assert.strictEqual('metal.js', files[0]);
			done();
		});
		consume(stream);
	});

	it('should build js files to a bundle with the specified name', function(done) {
		var stream = vfs.src('test/fixtures/js/Bar.js')
      .pipe(buildJQuery({bundleFileName: 'foo.js'}));

    var files = [];
    stream.on('data', function(file) {
			files.push(file.relative);
		});
		stream.on('end', function() {
			assert.strictEqual(2, files.length);
			assert.deepEqual(['foo.js', 'foo.js.map'], files.sort());
			done();
		});
		consume(stream);
	});

	it('should should add JQueryAdapter.register call for each original file', function(done) {
		var stream = vfs.src('test/fixtures/js/*.js')
      .pipe(buildJQuery());

    stream.on('data', function(file) {
      if (file.relative === 'metal.js') {
        var contents = file.contents.toString();
        assert.notStrictEqual(-1, contents.indexOf('JQueryAdapter.register(\'foo\', Foo);'));
        assert.notStrictEqual(-1, contents.indexOf('JQueryAdapter.register(\'bar\', Bar);'));
        done();
      }
		});
		consume(stream);
	});
});
