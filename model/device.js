var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var DeviceSchema = mongoose.Schema({
	user: { type: String, ref: 'User' },
	name: String,
	model: String,
	type: Number,
	pushId: String,
	approved: Boolean
});

var Device = mongoose.model('Device', DeviceSchema);

exports.getDeviceModel = function()
{
	return Device;
}
