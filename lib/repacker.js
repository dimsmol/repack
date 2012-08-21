"use strict";
var RuleSet = require('./rules/rule_set');
var FixKeys = require('./rules/others/fix_keys');


var Repacker = function (opt_rules, opt_othersRule) {
	this.rules = opt_rules || new RuleSet();
	this.othersRule = opt_othersRule;

	this.dstKeyRuleMap = null;
	this.ruleCoveredSrcKeys = null;

	this.collectingFunc = null;
	this.transformFunc = null;

	this.keyExprMap = null;
};

Repacker.prototype.getKeyExprMap = function () {
	return this.keyExprMap;
};

Repacker.prototype.srcKeysToFields = function (srcKeys, prefix, outPrefix) {
	var keyExprMap = this.getKeyExprMap();
	var result;
	if (keyExprMap == null && !prefix && !outPrefix) {
		result = srcKeys;
	}
	else {
		result = [];
		for (var i = 0; i < srcKeys.length; i++) {
			var srcKey = srcKeys[i];
			var expr = null;
			if (keyExprMap != null) {
				var exprFunc = keyExprMap[srcKey];
				if (exprFunc) {
					expr = exprFunc(prefix);
				}
			}
			var str = expr || this.prefixSrcKey(srcKey, prefix);
			if (expr || outPrefix) {
				var alias = this.prefixField(srcKey, outPrefix);
				str = [str, alias].join(' as ');
			}
			result.push(str);
		}
	}
	return result.join(', ');
};

Repacker.prototype.getFields = function (dstKeys, prefix, outPrefix) {
	return this.srcKeysToFields(this.getSrcKeys(dstKeys), prefix, outPrefix);
};

Repacker.prototype.getCollectingFunc = function () {
	if (this.collectingFunc == null) {
		var self = this;
		this.collectingFunc = function (row, data) {
			data.push(self.repack(row));
		};
	}
	return this.collectingFunc;
};

Repacker.prototype.getTransformFunc = function () {
	if (this.transformFunc == null) {
		var self = this;
		this.transformFunc = function (row) {
			return self.repack(row);
		};
	}
	return this.transformFunc;
};

Repacker.prototype.addRule = function (rule) {
	this.rules.add(rule);
};

Repacker.prototype.getRuleForDstKey = function (dstKey) {
	if (this.dstKeyRuleMap == null) {
		this.dstKeyRuleMap = {};
		this.rules.addToDstKeyRuleMap(this.dstKeyRuleMap);
	}
	return this.dstKeyRuleMap[dstKey];
};

Repacker.prototype.isSrcKeyCoveredByRule = function (srcKey) {
	if (this.ruleCoveredSrcKeys == null) {
		this.ruleCoveredSrcKeys = {};
		this.rules.addCoversSrcKeysToSet(this.ruleCoveredSrcKeys);
	}
	return this.ruleCoveredSrcKeys[srcKey];
};

Repacker.prototype.getSrcKeys = function (dstKeys) {
	var result = new Repacker.KeySet(), otherDstKeys = [];
	for (var i = 0; i < dstKeys.length; i++) {
		var k = dstKeys[i];
		var rule = this.getRuleForDstKey(k);
		if (rule != null) {
			rule.addDependsOnSrcKeys(result);
		}
		else if (this.othersRule != null) {
			otherDstKeys.push(k);
		}
		else {
			throw new Error('Unknown dst key ' + k);
		}
	}
	if (this.othersRule != null) {
		this.othersRule.addDependsOnSrcKeys(result, otherDstKeys);
	}
	return result.arr;
};

Repacker.prototype.repack = function (src, opt_dstKeys) {
	var dst = null;
	if (src != null) {
		dst = {};
		var i, k, rule, otherDstKeys, skipFunc;
		if (opt_dstKeys) {
			otherDstKeys = [];
			for (i = 0; i < opt_dstKeys.length; i++) {
				k = opt_dstKeys[i];
				rule = this.getRuleForDstKey(k);
				if (rule != null) {
					rule.repack(src, dst);
				}
				else if (this.othersRule != null) {
					otherDstKeys.push(k);
				}
				else {
					throw new Error('Unknown dst key ' + k);
				}
			}
		}
		else {
			this.rules.repack(src, dst);
			var self = this;
			skipFunc = function (dstKey) {
				return self.isSrcKeyCoveredByRule(dstKey);
			};
		}
		if (this.othersRule != null) {
			this.othersRule.repack(src, dst, otherDstKeys, skipFunc);
		}
	}
	return dst;
};

Repacker.prototype.reverse = function (dst, opt_dstKeys) {
	var src = {};
	var i, k, rule, otherDstKeys, skipFunc;
	if (opt_dstKeys) {
		otherDstKeys = [];
		for (i = 0; i < opt_dstKeys.length; i++) {
			k = opt_dstKeys[i];
			rule = this.getRuleForDstKey(k);
			if (rule != null) {
				rule.reverse(dst, src);
			}
			else if (this.othersRule != null) {
				otherDstKeys.push(k);
			}
			else {
				throw new Error('Unknown dst key ' + k);
			}
		}
	}
	else {
		this.rules.reverse(src, dst);
		var self = this;
		skipFunc = function (dstKey) {
			return self.getRuleForDstKey(dstKey) != null;
		};
	}
	if (this.othersRule != null) {
		this.othersRule.reverse(dst, src, otherDstKeys, skipFunc);
	}
	return src;
};

Repacker.prototype.prefixSrcKey = function (srcKey, prefix) {
	return Repacker.prefixSrcKey(srcKey, prefix);
};

Repacker.prototype.prefixField = function (srcKey, prefix) {
	return Repacker.prefixField(srcKey, prefix);
};


Repacker.KeySet = function () {
	this.arr = [];
	this.isPresent = {};
};

Repacker.KeySet.prototype.push = function () {
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		if (!this.isPresent[arg]) {
			this.isPresent[arg] = true;
			this.arr.push(arg);
		}
	}
};

Repacker.prefixSrcKey = function (srcKey, prefix) {
	var result = srcKey;
	if (prefix) {
		result = [prefix, srcKey].join('.');
	}
	return result;
};

Repacker.prefixField = function (srcKey, prefix) {
	var result = srcKey;
	if (prefix) {
		result = [prefix, srcKey].join('__');
	}
	return result;
};

Repacker.repacker = function () {
	var rules = new RuleSet();
	rules.addMany(arguments);
	return new Repacker(rules, new FixKeys());
};


module.exports = Repacker;
