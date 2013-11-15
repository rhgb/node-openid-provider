/**
 * Author: rhgb@github
 */
var _ = require('./util'),
	http = require('http'),
	https = require('https'),
	crypto = require('crypto');

var options = {
	allow_no_enc_assoc: false
};

var OP = function() {

};

var openid_ns = {
	v2 : 'http://specs.openid.net/auth/2.0'
}

/**
 *
 * @param {http.IncomingMessage | https.IncomingMessage} req
 * @param {http.ServerResponse | https.ServerResponse} res
 * @param {Function} [callback]
 */
var onDirectRequest = function(req, res, callback) {
	if (req.method != 'POST') {
		directResponse.error(res, 'Request must be sent as HTTP POST');
		return;
	}
	var postData = '';
	req.on('data', function(data){
		postData += data;
	});
	req.on('end', function(){
		var data = _.decodePostData(postData);
		if (data['openid.ns'] != openid_ns.v2) {
			//TODO OpenID 1.x support
			directResponse.error(res, 'Unsupported OpenID NS');
		} else if (!_.isDef(data['openid.mode'])) {
			directResponse.error(res, 'Invalid OpenID request (absent openid.mode)');
		} else {
			//handle different modes
			if (data['openid.mode'] == 'associate') {

			}
		}
	});
};

var directResponse = {
	success : {
		//TODO
	},
	/**
	 *
	 * @param {http.ServerResponse} res
	 * @param {String} message
	 * @param {Object} [extra]
	 */
	error: function(res, message, extra){
		var data = {
			ns : openid_ns.v2,
			error : message
			// TODO: (optional) contact
			// TODO: (optional) referrence
		};
		_.extend(data, extra);
		data = _.encodePostData(data);
		res.writeHead(400, {
			'Content-Type': 'text/plain',
			'Content-Length': data.length
		});
		res.end(data);
	}
};

var onAssociate = function(data){
	var res = { ns: openid_ns.v2 };
	var assoc_type = data['openid.assoc_type'];
	var session_type = data['openid.session_type'];

	switch (assoc_type) {
		case 'HMAC-SHA1':
		case 'HMAC-SHA256':
			break;
		default :
			//TODO error
			return;
	}
	res.assoc_type = assoc_type;

	var use_dh;
	switch (session_type) {
		case 'no-encryption':
			use_dh = false;
			break;
		case 'DH-SHA1':
			use_dh = true;
			break;
		case 'DH-SHA256':
			use_dh = true;
			break;
		default :
			//TODO error
			return;
	}
	res.session_type = session_type;
	if (use_dh) {
		var prime = _.fromBase64(data['openid.dh_modulus']);
		var generator = _.fromBase64(data['openid.dh_gen']);
		var consumerPublic = _.fromBase64(data['openid.dh_consumer_public']);
		if (generator === String.fromCharCode(2)) { // use native crypto Diffie-Hellman
			var dh = crypto.createDiffieHellman(prime, 'binary');
			var serverPrivate = crypto.randomBytes(session_type == 'DH-SHA1' ? 20 : 32);

		} else {
			// TODO
		}
	}
};

OP.prototype = {

};

Object.defineProperty(OP.prototype, 'constructor', {
	value: OP,
	configurable: true,
	enumerable: false,
	writable: true
});

exports.IdentityProvider = OP;