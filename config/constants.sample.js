
var appName = 'app-hooks';
var gcmApiSecret = '';
var apnOptions = {
	cert: '/path/to/cert',
	key: '/path/to/key',
	passphrase: ''
};

exports.getPort = function()
{
	return 3000;
}

exports.getDbUri = function()
{
	return 'mongodb://localhost/' + appName;
}

exports.getGcmApiSecret = function()
{
	return gcmApiSecret;
}

exports.getApnOptions = function()
{
	return apnOptions;
}
