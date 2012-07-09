"use strict";
var RuleSet = require('./rule_set');
var rename = require('./rename').rename;


var subRestruct = function (createRuleFunc, result, path, struct) {
	for (var k in struct) {
		var obj = struct[k];
		var newPath = path ? [path, k].join('.') : k;
		if (obj.constructor === String) {
			result.add(createRuleFunc(obj, newPath));
		}
		else {
			subRestruct(createRuleFunc, result, newPath, obj);
		}
	}
};

var restruct = function (struct, opt_createRuleFunc) {
	// {a: x, b: {c: y}} -> rules(rename('x', 'a'), rename('y': 'b.c'))
	var result = new RuleSet();
	var createRuleFunc = opt_createRuleFunc || function (srcKey, dstKey) {
		return rename(srcKey, dstKey);
	};
	subRestruct(createRuleFunc, result, null, struct);
	if (result.rules.length == 1) {
		result = result.rules[0];
	}
	return result;
};


module.exports = {
	restruct: restruct,
	subRestruct: subRestruct
};
