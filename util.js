/**
 * Seperated from openid.js
 */

var convert = require('./lib/convert');
var querystring = require('querystring');

var _ = exports;
/**
 * Extend an object with another object's keys and values.
 * @param {Object} origin
 * @param {Object} extend
 */
_.extend = function(origin, extend) {
	if (extend instanceof Object && origin instanceof Object) {
		for (var i in extend) {
			if (extend.hasOwnProperty(i) && _.isDef(extend[i])) {
				origin[i] = extend[i];
			}
		}
	}
};

_.isDef = function(e)
{
	var undefined;
	return e !== undefined;
};

_.toBase64 = function(binary)
{
	return convert.base64.encode(convert.btwoc(binary));
};

_.fromBase64 = function(str)
{
	return convert.unbtwoc(convert.base64.decode(str));
};

_.xor = function(a, b)
{
	if(a.length != b.length)
	{
		throw new Error('Length must match for xor');
	}

	var r = '';
	for(var i = 0; i < a.length; ++i)
	{
		r += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
	}

	return r;
};

_.encodePostData = function(data)
{
	var encoded = querystring.stringify(data);
	return encoded;
};

_.decodePostData = function(data)
{
	var lines = data.split('\n');
	var result = {};
	for (var i = 0; i < lines.length ; i++) {
		var line = lines[i];
		if (line.length > 0 && line[line.length - 1] == '\r') {
			line = line.substring(0, line.length - 1);
		}
		var colon = line.indexOf(':');
		if (colon === -1)
		{
			continue;
		}
		var key = line.substr(0, line.indexOf(':'));
		var value = line.substr(line.indexOf(':') + 1);
		result[key] = value;
	}

	return result;
};