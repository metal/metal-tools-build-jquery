'use strict';

var addJQueryAdapterRegistration = require('./addJQueryAdapterRegistration');
var combiner = require('stream-combiner');
var buildGlobalsNoSourceMaps = require('metal-tools-build-globals/lib/pipelines/buildGlobalsNoSourceMaps');
var defaultOptions = require('../options');
var merge = require('merge');
var sourcemaps = require('gulp-sourcemaps');
var wrapper = require('gulp-wrapper');

module.exports = function(options) {
	options = merge({}, defaultOptions, options);
	return combiner(
		addJQueryAdapterRegistration(),
		sourcemaps.init(),
		buildGlobalsNoSourceMaps(options),
		wrapper({
			header: 'new (function () { ',
			footer: '})();'
		}),
		sourcemaps.write('./')
  );
};
