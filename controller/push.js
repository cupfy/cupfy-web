var gcm = require('node-gcm');
var apn = require('apn');
var mpns = require('../util/mpns');
var constants = require('../config/constants.js').get();

/*
 * APN
 */
var apnSender = new apn.Connection(constants.PUSH.APN.OPTIONS);

/*
 * GCM
 */
var gcmSender = new gcm.Sender(constants.PUSH.GCM.SECRET);

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
		mpns.send(json, wp);
	}

	callback();
}
