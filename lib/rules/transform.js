"use strict";
var inherits = require('util').inherits;
var Rename = require('./rename');

var Transform = function (srcKey, dstKey, srcValueToDstValueFunc, dstValueToSrcValueFunc, opt_isDstKeyFlat) {
	Rename.call(this, srcKey, dstKey, opt_isDstKeyFlat);

	this.srcValueToDstValueFunc = srcValueToDstValueFunc;
	this.dstValueToSrcValueFunc = dstValueToSrcValueFunc;
};
inherits(Transform, Rename);

Transform.prototype.srcValueToDstValue = function (srcValue) {
	return this.srcValueToDstValueFunc(srcValue);
};

Transform.prototype.dstValueToSrcValue = function (dstValue) {
	return this.dstValueToSrcValueFunc(dstValue);
};

Transform.transform = function (srcKey, dstKey, srcValueToDstValueFunc, dstValueToSrcValueFunc, opt_isDstKeyFlat) {
	return new Transform(srcKey, dstKey, srcValueToDstValueFunc, dstValueToSrcValueFunc, opt_isDstKeyFlat);
};


module.exports = Transform;
