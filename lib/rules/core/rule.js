"use strict";
var Rule = function () {
};

Rule.prototype.getDependsOnSrcKeys = function () {
	return [];
};

Rule.prototype.getCoversDstKeys = function () {
	return [];
};

Rule.prototype.getCoversSrcKeys = function () {
	return this.getDependsOnSrcKeys();
};

Rule.prototype.addDependsOnSrcKeys = function (arr) {
	arr.push.apply(arr, this.getDependsOnSrcKeys());
};

Rule.prototype.addToDstKeyRuleMap = function (map) {
	var dstKeys = this.getCoversDstKeys();
	for (var i = 0; i < dstKeys.length; i++) {
		map[dstKeys[i]] = this;
	}
};

Rule.prototype.addCoversSrcKeysToSet = function (set) {
	var srcKeys = this.getCoversSrcKeys();
	for (var i = 0; i < srcKeys.length; i++) {
		set[srcKeys[i]] = true;
	}
};

Rule.prototype.repack = function (src, dst) {
};

Rule.prototype.reverse = function (dst, src) {
};


module.exports = Rule;
