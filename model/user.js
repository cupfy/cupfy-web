var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var UserSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	apiKey: String,
	apiSecret: String
});

var UserTokenSchema = mongoose.Schema({
	user: { type: String, ref: 'User' },
	token: String,
	expiration: Number
});

UserSchema.set('toJSON', {
	transform: function(doc, ret, options) {
		delete ret.__v;
		delete ret.password;
	}
});

var User = mongoose.model('User', UserSchema);
var UserToken = mongoose.model('UserToken', UserTokenSchema);

exports.getUserModel = function()
{
	return User;
}

exports.getUserTokenModel = function()
{
	return UserToken;
}
