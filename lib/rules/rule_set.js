"use strict";
var inherits = require('util').inherits;
var Rule = require('./core/rule');

var RuleSet = function () {
	this.rules = [];
};
inherits(RuleSet, Rule);

RuleSet.prototype.addMany = function (rules) {
	for (var i = 0; i < rules.length; i++) {
		this.add(rules[i]);
	}
};

RuleSet.prototype.add = function (rule) {
	this.rules.push(rule);
};

RuleSet.prototype.getDependsOnSrcKeys = function () {
	throw new Error('Cannot be called on RuleSet');
};

RuleSet.prototype.getCoversDstKeys = function () {
	throw new Error('Cannot be called on RuleSet');
};

RuleSet.prototype.getCoversSrcKeys = function () {
	throw new Error('Cannot be called on RuleSet');
};

RuleSet.prototype.addToDstKeyRuleMap = function (map) {
	for (var i = 0; i < this.rules.length; i++) {
		var rule = this.rules[i];
		rule.addToDstKeyRuleMap(map);
	}
};

RuleSet.prototype.addCoversSrcKeysToSet = function (set) {
	for (var i = 0; i < this.rules.length; i++) {
		var rule = this.rules[i];
		rule.addCoversSrcKeysToSet(set);
	}
};

RuleSet.prototype.repack = function (src, dst) {
	for (var i = 0; i < this.rules.length; i++) {
		var rule = this.rules[i];
		rule.repack(src, dst);
	}
};

RuleSet.prototype.reverse = function (dst, src) {
	for (var i = 0; i < this.rules.length; i++) {
		var rule = this.rules[i];
		rule.reverse(dst, src);
	}
};

RuleSet.ruleSet = function () {
	var rules = new RuleSet();
	rules.addMany(arguments);
};


module.exports = RuleSet;
