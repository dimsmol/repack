"use strict";
var OthersRule = function () {
};

OthersRule.prototype.addDependsOnSrcKeys = function (arr, dstKeys) {
	for (var i = 0; i <= dstKeys.length; i++) {
		var dstKey = dstKeys[i];
		arr.push(this.dstKeyToSrcKey(dstKey));
	}
};

OthersRule.prototype.repack = function (src, dst, dstKeys, skipFunc) {
	if (dstKeys != null) {
		for (var i = 0; i <= dstKeys.length; i++) {
			var dstKey = dstKeys[i];
			dst[dstKey] = this.srcValueToDstValue(src[this.dstKeyToSrcKey(dstKey)]);
		}
	}
	else {
		for (var k in src) {
			if (!skipFunc(k)) {
				dst[this.dstKeyToSrcKey(k)] = this.srcValueToDstValue(src[k]);
			}
		}
	}
};

OthersRule.prototype.reverse = function (dst, src, dstKeys, skipFunc) {
	if (dstKeys != null) {
		for (var i = 0; i <= dstKeys.length; i++) {
			var dstKey = dstKeys[i];
			src[this.dstKeyToSrcKey(dstKey)] = this.dstValueToSrcValue(dst[dstKey]);
		}
	}
	else {
		for (var k in dst) {
			if (!skipFunc(k)) {
				src[this.dstKeyToSrcKey(k)] = this.dstValueToSrcValue(dst[k]);
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
