"use strict";
var RuleSet = require('./rule_set');
var RenameRule = require('./rename');


var restruct = function (struct) {
	// {a: x, b: {c: y}} -> rules(rename('x', 'a'), rename('y': 'b.c'))
	var result = new RuleSet();
	subRestruct(result, null, struct);
	if (result.rules.length == 1) {
		result = result.rules[0];
	}
	return result;
};

var subRestruct = function (result, path, struct) {
	for (var k in struct) {
		var obj = struct[k];
		var newPath = path ? [path, k].join('.') : k;
		if (obj.constructor === String) {
			result.add(new RenameRule(obj, newPath));
		}
		else {
			subRestruct(result, newPath, obj);
		}
	}
};


module.exports = {
	restruct: restruct,
	subRestruct: subRestruct
};
