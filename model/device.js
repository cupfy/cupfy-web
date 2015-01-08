var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var DeviceSchema = mongoose.Schema({
	name: String,
	model: String,
	type: Number,
	deviceId: String,
	pushId: String
});

var HookSchema = mongoose.Schema({
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
	namespace: String,
    approved: Boolean,
    removed: Boolean
});

var Device = mongoose.model('Device', DeviceSchema);
var Hook = mongoose.model('Hook', HookSchema);

exports.getDeviceModel = function()
{
	return Device;
}

exports.getHookModel = function()
{
	return Hook;
}
