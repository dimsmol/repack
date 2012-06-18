"use strict";
var inherits = require('util').inherits;
var Rule = require('./core/rule');
var RuleSet = require('./rule_set');

var Rename = function (srcKey, dstKey, opt_isDstKeyFlat) {
	this.srcKey = srcKey;
	this.dstKey = dstKey;

	this.dstKeyParts = null;
	if (!opt_isDstKeyFlat) {
		var dstKeyParts = dstKey.split('.');
		if (dstKeyParts.length > 1) {
			this.dstKeyParts = dstKeyParts;
		}
	}
};
inherits(Rename, Rule);

Rename.prototype.getDependsOnSrcKeys = function () {
	return [this.srcKey];
};

Rename.prototype.getCoversDstKeys = function () {
	return [this.dstKey];
};

Rename.prototype.addToDstKeyRuleMap = function (map) {
	this.constructor.super_.prototype.addToDstKeyRuleMap.call(this, map);
	if (this.dstKeyParts != null) {
		this.addToRuleSets(this.dstKey, map);
	}
};

Rename.prototype.addToRuleSets = function (dstKey, map) {
	var pos = dstKey.indexOf('.');
	while (pos > 0) {
		var subKey = dstKey.substr(0, pos);
		var ruleSet = map[subKey];
		if (ruleSet == null) {
			map[subKey] = ruleSet = new RuleSet();
		}
		// TODO handle error if ruleSet is a Rule
		ruleSet.add(this);
		pos = dstKey.indexOf('.', pos + 1);
	}
};

Rename.prototype.repack = function (src, dst) {
	if (this.srcKey in src) {
		if (this.dstKeyParts != null) {
			var obj = dst;
			var last = this.dstKeyParts.length - 1;
			for (var i = 0; i <= last; i++) {
				var part = this.dstKeyParts[i];
				if (i == last) {
					obj[part] = src[this.srcKey];
				}
				else {
					obj = obj[part] = obj[part] || {};
				}
			}
		}
		else {
			dst[this.dstKey] = src[this.srcKey];
		}
	}
};

Rename.prototype.reverse = function (dst, src) {
	if (this.dstKeyParts != null) {
		var obj = dst;
		var notFound = false;
		for (var i = 0; i < this.dstKeyParts.length; i++) {
			var part = this.dstKeyParts[i];
			if (obj == null || !(part in obj)) {
				notFound = true;
				break;
			}
			obj = obj[part];
		}
		if (!notFound) {
			src[this.srcKey] = obj;
		}
	}
	else if (this.dstKey in dst) {
		src[this.srcKey] = dst[this.dstKey];
	}
};

Rename.rename = function (srcKey, dstKey, opt_isDstKeyFlat) {
	return new Rename(srcKey, dstKey, opt_isDstKeyFlat);
};


module.exports = Rename;
