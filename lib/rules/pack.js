"use strict";
var inherits = require('util').inherits;
var Rule = require('./core/rule');


var Pack = function (dependsOnSrcKeys, coversSrcKeys, dependsOnDstKeys, repackFunc, reverseFunc) {
	this.dependsOnSrcKeys = dependsOnSrcKeys;
	this.coversSrcKeys = (coversSrcKeys == null ? dependsOnSrcKeys : coversSrcKeys);
	this.dependsOnDstKeys = dependsOnDstKeys;
	this.repackFunc = repackFunc;
	this.reverseFunc = reverseFunc;
};
inherits(Pack, Rule);

Pack.prototype.getDependsOnSrcKeys = function () {
	return this.dependsOnSrcKeys;
};

Pack.prototype.getCoversDstKeys = function () {
	return this.dependsOnDstKeys;
};

Pack.prototype.getCoversSrcKeys = function () {
	return this.coversSrcKeys;
};

Pack.prototype.repack = function (src, dst) {
	this.repackFunc(src, dst);
};

Pack.prototype.reverse = function (dst, src) {
	this.reverseFunc(src, dst);
};

Pack.pack = function (dependsOnSrcKeys, coversSrcKeys, dependsOnDstKeys, repackFunc, reverseFunc) {
	return new Pack(dependsOnSrcKeys, coversSrcKeys, dependsOnDstKeys, repackFunc, reverseFunc);
};


module.exports = Pack;
