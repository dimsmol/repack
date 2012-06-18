"use strict";
var inherits = require('util').inherits;
var Rule = require('./core/rule');

var Nop = function (key) {
	this.key = key;
};
inherits(Nop, Rule);

Nop.prototype.getDependsOnSrcKeys = function () {
	return [this.key];
};

Nop.prototype.getCoversDstKeys = function () {
	return [this.key];
};

Nop.prototype.repack = function (src, dst) {
	dst[this.key] = src[this.key];
};

Nop.prototype.reverse = function (dst, src) {
	src[this.key] = dst[this.key];
};

Nop.nop = function (key) {
	return new Nop(key);
};


module.exports = Nop;
