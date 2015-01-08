var gcm = require('node-gcm');
var apn = require('apn');
var mpns = require('mpns');
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

/*
 * CONSTANTS
 * TODO: change this bullshit
 */
var model = {
	ANDROID: 0,
	IOS: 1,
	WP: 2
}

exports.send = function(json, device, callback)
{
	/*
	 * GCM
	 */
	if(device.android.length > 0)
	{
		var message = new gcm.Message();

		message.addDataWithObject(json);

		sender.send(message, device.android, 4, function (err, result) { console.log(err); });
	}
	
	/*
	 * APN
	 */
	if(device.ios.length > 0)
	{
		var note = new apn.Notification();

		note.expiry = Math.floor(Date.now() / 1000) + 300;
		note.badge = 1;
		note.alert = json.title + ": " + json.message;

		apnConnection.pushNotification(note, device.ios);
	}

	/*
	 * MPN
	 */
	if(device.wp.length > 0)
	{
		device.wp.map(function(wp)
		{
			mpns.sendToast(wp, json.title, json.message);
		});
	}

	callback();
}
