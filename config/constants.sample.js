
var constants = {
	APP: {
		APP_NAME: 'app-hooks',
		MONGO_URI: 'mongodb://localhost/' + constants.APP.APP_NAME,
		PORT: 3000
	},
	PUSH: {
		GCM: {
			SECRET: 'secret_here'
		},
		APN: {
			CERT: '/path/to/cert',
			KEY: '/path/to/key',
			PASSPHRASE: 'passphrase_here'
		},
		MPN: {
			CLIENT_ID: 'client_id here',
			CLIENT_SECRET: 'client_secret here'
		}
	}
}

exports.get = function()
{
	return constants;
}
