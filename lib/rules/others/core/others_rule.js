"use strict";
var OthersRule = function () {
};

OthersRule.prototype.addDependsOnSrcKeys = function (arr, dstKeys) {
	for (var i = 0; i < dstKeys.length; i++) {
		var dstKey = dstKeys[i];
		arr.push(this.dstKeyToSrcKey(dstKey));
	}
};

OthersRule.prototype.repack = function (src, dst, dstKeys, skipFunc) {
	if (dstKeys != null) {
		for (var i = 0; i < dstKeys.length; i++) {
			var dstKey = dstKeys[i];
			dst[dstKey] = this.srcValueToDstValue(src[this.dstKeyToSrcKey(dstKey)]);
		}
	}
	else {
		for (var srcKey in src) {
			if (!skipFunc(srcKey)) {
				dst[this.srcKeyToDstKey(srcKey)] = this.srcValueToDstValue(src[srcKey]);
			}
		}
	}
};

OthersRule.prototype.reverse = function (dst, src, dstKeys, skipFunc) {
	var dstKey;
	if (dstKeys != null) {
		for (var i = 0; i < dstKeys.length; i++) {
			dstKey = dstKeys[i];
			src[this.dstKeyToSrcKey(dstKey)] = this.dstValueToSrcValue(dst[dstKey]);
		}
	}
	else {
		for (dstKey in dst) {
			if (!skipFunc(dstKey)) {
				src[this.dstKeyToSrcKey(dstKey)] = this.dstValueToSrcValue(dst[dstKey]);
			}
		}
	}
};

OthersRule.prototype.srcKeyToDstKey = function (srcKey) {
};

OthersRule.prototype.dstKeyToSrcKey = function (dstKey) {
};

OthersRule.prototype.srcValueToDstValue = function (srcValue) {
	return srcValue;
};

OthersRule.prototype.dstValueToSrcValue = function (dstValue) {
	return dstValue;
};


module.exports = OthersRule;
