var request = require('request');
var constants = require('../config/constants.js').get();
var async = require('async');

exports.send = function(payload, devices) {

	var accessToken;

	async.series([
		function(callback)
		{
			var headers = {
				'Content-Type': 'application/x-www-form-urlencoded'
			}

			var options = {
				url: 'https://login.live.com/accesstoken.srf',
				method: 'POST',
				headers: headers,
				form: {
					'grant_type' : 'client_credentials',
					'client_id' : constants.PUSH.MPN.CLIENT_ID,
					'client_secret' : constants.PUSH.MPN.CLIENT_SECRET,
					'scope' : 'notify.windows.com'
				}
			}

			request(options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json = JSON.parse(body);

					accessToken = json.access_token;
					callback();
				} else {
					console.log(error);
					console.log(response);
					callback(true);
				}
			});
		},
		function(callback)
		{
			var body = '<toast><visual><binding template="ToastText02"><text id="1">' + payload.title + '</text><text id="2">' + payload.message + '</text></binding></visual></toast>';

			var headers = {
				'X-WNS-Type': 'wns/toast',
				'Content-Type': 'text/xml',
				'Content-Length': body.length,
				'Authorization': 'Bearer ' + accessToken
			}

			var options = {
				method: 'POST',
				headers: headers,
				body: body
			}

			devices.map(function(device)
			{
				options.url = device;

				request(options, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						// Print out the response body
						console.log(body);
					} else {
						console.log(error);
						console.log(response);
					}

					console.log(error ? "ERROR" : "SUCCESS");	
				});
			});
		}
	], function(err) { });
}
