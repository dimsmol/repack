"use strict";
var inherits = require('util').inherits;
var OthersRule = require('./core/others_rule');

var FixKeys = function () {
	this.cache = {};
	this.reverseCache = {};
};
inherits(FixKeys, OthersRule);

FixKeys.prototype.srcKeyToDstKey = function (srcKey) {
	var result = this.cache[srcKey];
	if (result == null) {
		this.cache[srcKey] = result = srcKey.replace(/(\_.)/g, function (str) {
			return str[1].toUpperCase();
		});
	}
	return result;
};

FixKeys.prototype.dstKeyToSrcKey = function (dstKey) {
	var result = this.reverseCache[srcKey];
	if (result == null) {
		this.cache[dstKey] = result = dstKey.replace(/(A-Z)/g, function (str) {
			return '_' + str.toLowerCase();
		});
	}
	return result;
};

FixKeys.fixKeys = function () {
	return new FixKeys();
};


module.exports = FixKeys;
