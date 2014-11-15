var errors = require('../docs/errors.js')
	, database = require('./database.js')
	, routes = require('./routes.js')
	, constants = require('./constants.js')
	, userModel = require('../model/user.js')
	, bodyParser = require('body-parser')
	, moment = require('moment')
	, morgan = require('morgan');

var User = userModel.getUserModel();
var UserToken = userModel.getUserTokenModel();

/**
 * Get current timestamp
 *
 * @return Long Current timestamp.
 */
var timestamp = function()
{
	return moment().format('X');
}

var allowCrossDomain = function(req, res, next)
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

exports.setDatabase = function()
{
	database.init();
}

exports.setRoutes = function(app)
{
	routes.init(app);
}

/**
 * Configures the application, setting all middleware that will be used.
 *
 * @param app The express application instance.
 * @param express The express class instance.
 */
exports.configure = function(app, express)
{
	var env = app.settings.env;

	// Set the view engine.
	app.set('view engine', 'jade');

	// Set the static directory.
	// Useless (nginx will handle it).
	app.use(express.static(__dirname + './../public'));

	if('production' != env)
	{
		// Logs every request.
		app.use(morgan('combined'));

		// Allows cross domain.
		app.use(allowCrossDomain);
	}

	// Used for form/data and x-www-form-urlencoded content types.
	app.use(bodyParser.urlencoded({ extended: true }));
}

/**
 * Runs the application.
 * Default configuration is set to port 3000.
 *
 * @param app The express application instance.
 */
exports.run = function(app)
{
	var port = constants.getPort();
	
	app.listen(port, '0.0.0.0');
	console.log('Listening on port ' +port+ '...');
}

/**
 * It modifies the response when an error is found.
 *
 * @param res The response handler.
 * @param code The intern error code.
 * @param status The HTTP/1.1 response code.
 */
var errorHandler = function(res, code, status)
{
	var description = 'code: '+code+', description: ';

	description += errors.getError(code).description;

	res.writeHead(status, description, {'content-type' : 'text/plain'});
	res.end();
}

exports.errorHandler = errorHandler;

/**
 * Check if the user is authenticated.
 */
exports.isAuthenticated = function(req, res, next)
{
	var reqToken = req.header('X-AUTH-TOKEN');
	var reqEmail = req.header('X-AUTH-EMAIL');

	if(reqToken	=== undefined
	|| reqEmail === undefined)
	{
		errorHandler(res, 100, 401);
	}
	else
	{
		reqEmail = reqEmail.toLowerCase();

		UserToken
		.findOne({
			$and: [
				{ token : reqToken },
				{ expiration : { $gte : timestamp() } }
			]
		})
		.populate('user')
		.exec(function(err, userToken)
		{
			if(userToken == null)
			{
				errorHandler(res, 100, 401);
			}
			else
			{
				if(userToken.user.email != reqEmail)
				{
					errorHandler(res, 100, 401);
				}
				else
				{
					req.user = userToken.user;
					next();
				}
			}
		});
	}
}
