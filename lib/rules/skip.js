"use strict";
var inherits = require('util').inherits;
var Rule = require('./rule');

var SkipRule = function (srcKey) {
	this.srcKey = srcKey;
};
inherits(SkipRule, Rule);

SkipRule.prototype.getDependsOnSrcKeys = function () {
	return [];
};

SkipRule.prototype.getCoversDstKeys = function () {
	return [];
};

SkipRule.prototype.getCoversSrcKeys = function () {
	return [this.srcKey];
};


module.exports = SkipRule;
