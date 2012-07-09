"use strict";
var inherits = require('util').inherits;
var Rule = require('./core/rule');

var Ignore = function (dstKey) {
	this.dstKey = dstKey;
};
inherits(Ignore, Rule);

Ignore.prototype.getDependsOnSrcKeys = function () {
	return [];
};

Ignore.prototype.getCoversDstKeys = function () {
	return [this.dstKey];
};

Ignore.ignore = function (dstKey) {
	return new Ignore(dstKey);
};


module.exports = Ignore;
