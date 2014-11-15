
var appName = 'app-hooks';

exports.getPort = function()
{
	return 3000;
}

exports.getDbUri = function()
{
	return 'mongodb://localhost/' + appName;
}
