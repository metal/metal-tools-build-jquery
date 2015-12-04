'use strict';

var assert = require('assert');
var addJQueryAdapterRegistration = require('../../../lib/pipelines/addJQueryAdapterRegistration');
var consume = require('stream-consume');
var vfs = require('vinyl-fs');

describe('Pipeline - Add JQueryAdapter registration', function() {
	it('should add JQueryAdapter.register call', function(done) {
		var stream = vfs.src('test/fixtures/js/Foo.js')
      .pipe(addJQueryAdapterRegistration());
    stream.on('data', function(file) {
      var contents = file.contents.toString();
      assert.notStrictEqual(-1, contents.indexOf('JQueryAdapter.register(\'foo\', Foo);'));
      done();
		});
		consume(stream);
	});
});
