var constants = require('./constants.js')
	, mongoose = require('mongoose');

var mongoUri = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	constants.getDbUri();

/**
 * Initializes the mongoose instance and...
 * set the mongoDB URI.
 */
exports.init = function()
{
	mongoose.connect(mongoUri);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, '\n[ERROR!] Do you started mongod?\nTry this: $ mongod --dbpath ~/mongo\n\nError description:'));

	db.once('open', function callback () {
		console.log('Mongoose loaded!');
	});
}
