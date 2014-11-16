var gcm = require('node-gcm');
var apn = require('apn');
var constants = require('../config/constants.js');

/*
 * APN
 */
var options = constants.getApnOptions();

var apnConnection = new apn.Connection(options);

/*
 * GCM
 */
var sender = new gcm.Sender(constants.getGcmApiSecret());

exports.send = function(json, android, ios, callback)
{
	/*
	 * GCM
	 */
	if(android.length > 0)
	{
		var message = new gcm.Message();

		message.addDataWithObject(json);

		sender.send(message, android, 4, function (err, result) { console.log(err); });
	}
	
	/*
	 * APN
	 */
	if(ios.length > 0)
	{
		var note = new apn.Notification();

		note.expiry = Math.floor(Date.now() / 1000) + 300;
		note.badge = 1;
		note.alert = json.title + ": " + json.message;

		apnConnection.pushNotification(note, ios);
	}

	callback();
}
