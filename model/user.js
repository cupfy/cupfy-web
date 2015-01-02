var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var UserSchema = mongoose.Schema({
	email: String,
	password: String,
	namespace: [String],
	apiSecret: String
});

UserSchema.set('toJSON', {
	transform: function(doc, ret, options) {
		delete ret.__v;
		delete ret.password;
	}
});

var User = mongoose.model('User', UserSchema);

exports.getUserModel = function()
{
	return User;
}
