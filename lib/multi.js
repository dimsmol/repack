"use strict";
var Multi = function (repackersMap) {
	this.repackersMap = repackersMap;

	this.collectFunc = null;
};

Multi.prototype.srcKeyPrefixSeparator = '__';
Multi.prototype.dstKeyPrefixSeparator = '.';
Multi.prototype.anyKeyPrefix = '*';

Multi.prototype.getCollectFunc = function () {
	if (this.collectFunc == null) {
		var self = this;
		this.collectFunc = function (row, data) {
			data.push(self.repack(row));
		};
	}
	return this.collectFunc;
};

Multi.prototype.getTransformFunc = function () {
	if (this.transformFunc == null) {
		var self = this;
		this.transformFunc = function (row) {
			return self.repack(row);
		};
	}
	return this.transformFunc;
};

Multi.prototype.extractSrcKeyPrefix = function (srcKey) {
	return this.getKeyPrefix(srcKey, this.srcKeyPrefixSeparator);
};

Multi.prototype.extractDstKeyPrefix = function (dstKey) {
	return this.getKeyPrefix(dstKey, this.dstKeyPrefixSeparator);
};

Multi.prototype.getKeyPrefix = function (key, sep) {
	var result;
	var sepPos = key.indexOf(sep);
	if (sepPos > 0) {
		result = key.substr(sepPos + sep.length);
	}
	return result;
};

Multi.prototype.getRepacker = function (prefix) {
	var result;
	if (prefix != null && prefix != this.anyKeyPrefix) {
		result = this.repackersMap[prefix];
	}
	if (result == null) {
		result = this.repackersMap[this.anyKeyPrefix];
		if (result == null) {
			if (prefix == null) {
				throw new Error('No default repacker defined');
			}
			else {
				throw new Error('No repacker defined for prefix ' + prefix);
			}
		}
	}
	return result;
};

Multi.prototype.createDstKeyGroups = function (dstKeys) {
	var groups = {};
	for (var i = 0; i < dstKeys.length; i++) {
		var dstKey = dstKeys[i];
		var prefix = this.extractDstKeyPrefix(dstKey) || this.anyKeyPrefix;
		var group = groups[prefix];
		if (group == null) {
			groups[prefix] = group = [];
		}
		group.push(dstKey.substr(prefix.length + this.dstKeyPrefixSeparator.length));
	}
	return groups;
};

Multi.prototype.createSrcGroups = function (src, opt_prefixesToUse) {
	var groups = {};
	for (var srcKey in src) {
		var prefix = this.extractSrcKeyPrefix(srcKey) || this.anyKeyPrefix;
		if (opt_prefixesToUse != null && !(prefix in opt_prefixesToUse)) {
			continue;
		}
		var group = groups[prefix];
		if (group == null) {
			groups[prefix] = group = {};
		}
		group[srcKey.substr(prefix.length + this.srcKeyPrefixSeparator.length)] = src[srcKey];
	}
	return groups;
};

Multi.prototype.addSrcKeysPrefix = function (srcKeys, prefix) {
	var result = [];
	for (var i = 0; i < srcKeys.length; i++) {
		result.push([prefix, srcKeys[i]].join(this.srcKeyPrefixSeparator));
	}
	return result;
};

Multi.prototype.getSrcKeys = function (dstKeys) {
	var result = [];
	var groups = this.createDstKeyGroups(dstKeys);
	for (var prefix in groups) {
		var group = groups[prefix];
		var repacker = this.getRepacker(prefix);
		var srcKeys = repacker.getSrcKeys(group);
		result.push.apply(result, this.addSrcKeyPrefix(srcKeys, prefix));
	}
	return result;
};

Multi.prototype.mergeToDst = function (dst, groupDst, prefix) {
	if (prefix == this.addSrcKeyPrefix) {
		for (var k in groupDst) {
			dst[k] = groupDst[k];
		}
	}
	else {
		dst[prefix] = groupDst;
	}
};

Multi.prototype.repack = function (src, opt_dstKeys) {
	var dst = {};
	var dstKeyGroups;
	if (opt_dstKeys) {
		dstKeyGroups = this.createDstKeyGroups(opt_dstKeys);
	}
	var srcGroups = this.createSrcGroups(src, dstKeyGroups);
	for (var prefix in srcGroups) {
		var repacker = this.getRepacker(prefix);
		var srcGroup = srcGroups[prefix];
		var dstKeyGroup;
		if (dstKeyGroups != null) {
			dstKeyGroup = dstKeyGroups[prefix];
		}
		var groupDst = repacker.repack(srcGroup, dstKeyGroup);
		this.mergeToDst(groupDst, prefix);
	}
	return dst;
};

Multi.multi = function (repackersMap) {
	return new Multi(repackersMap);
};

module.exports = Multi;
