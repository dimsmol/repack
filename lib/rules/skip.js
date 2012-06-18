"use strict";
var inherits = require('util').inherits;
var Rule = require('./core/rule');

var Skip = function (srcKey) {
	this.srcKey = srcKey;
};
inherits(Skip, Rule);

Skip.prototype.getDependsOnSrcKeys = function () {
	return [];
};

Skip.prototype.getCoversDstKeys = function () {
	return [];
};

Skip.prototype.getCoversSrcKeys = function () {
	return [this.srcKey];
};

Skip.skip = function (srcKey) {
	return new Skip(srcKey);
};


module.exports = Skip;
