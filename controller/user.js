var async = require('async')
	, moment = require('moment')
	, crypto = require('crypto')
	, general = require('../config/general.js')
	, userModel = require('../model/user.js');

var User = userModel.getUserModel();

/**
 * Get current timestamp
 *
 * @return Long Current timestamp.
 */
var timestamp = function()
{
	return moment().format('X');
}

/**
 * Get an User by it's id.
 *
 * @param id The user id.
 *
 * @return User The JSON representation of the user.
 */
exports.get = function(req, res)
{
	res.status(200).send(req.user);
}

/**
 * Create an User.
 *
 * @param body.name The user name.
 * @param body.email The user email.
 * @param body.password The user password.
 *
 * @return User The JSON representation of the user.
 */
exports.new = function(req, res)
{
	var html = req.query.html;
	var body = req.body;

	var response = {};
	var status = 200;

	var user;
	
	async.series([

		function(callback)
		{
			if(body.name === undefined
			|| body.email === undefined
			|| body.password === undefined)
			{
				response.code = 2;
				status = 400;
				callback(true);
			}
			else
			{
				body.email = body.email.toLowerCase();
				callback();
			}
		},
		function(callback)
		{
			User
			.findOne({
				email : body.email
			})
			.exec(function(err, retData)
			{
				if(retData != null)
				{
					response.code = 3;
					status = 409;
					callback(true);
				}
				else
				{
					callback();
				}
			});
		},
		function(callback)
		{
			var password = crypto.createHmac('sha1', body.email);
				password.update(body.password);

			password = password.digest('hex');

			var apiSecret = crypto.createHmac('sha1', body.password);
				apiSecret.update(timestamp().toString());

			apiSecret = apiSecret.digest('hex');

			user = new User({
				name: body.name,
				email: body.email,
				password: password,
				apiKey: password.slice(2, 12),
				apiSecret: apiSecret
			});

			user.save(function(err, retData)
			{
				if(err)
				{
					console.log(err);
					response.code = 999;
					status = 500;
					callback(true);
				}
				else
				{
					callback();
				}
			});
		}
	], function(invalid)
	{
		if(!invalid)
			response = user;

		if(!html)
		{
			if(status != 200)
			{
				general.errorHandler(res, response.code, status);
			}
			else
			{
				res.status(status).send(response);
			}
		}
		else
		{
			if(status != 200)
			{
				res.redirect('/web?message=Check+the+fields.');
			}
			else
			{
				res.redirect('/web?message=Success,+you+may+now+login.');
			}
		}
	});
}

/**
 * Auth an User.
 *
 * @param body.email The user email.
 * @param body.password The user password.
 *
 * @return UserToken The JSON representation of the userToken.
 */
exports.auth = function(req, res)
{
	var html = req.query.html;
	var body = req.body;

	var response = {};
	var status = 200;

	var user;
	
	async.series([

		function(callback)
		{
			if(body.email === undefined
			|| body.password === undefined)
			{
				response.code = 2;
				status = 400;
				callback(true);
			}
			else
			{
				body.email = body.email.toLowerCase();
				callback();
			}
		},
		function(callback)
		{
			var password = crypto.createHmac('sha1', body.email);
				password.update(body.password);

			password = password.digest('hex');

			User
			.findOne({
				$and : [
					{ email : body.email },
					{ password : password }
				]
			})
			.lean()
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					response.code = 1;
					status = 404;
					callback(true);
				}
				else
				{
					user = retData;
					req.session.user = user;

					callback();
				}
			});
		}
	], function(invalid)
	{
		if(!invalid)
			response = user;

		if(!html)
		{
			if(status != 200)
			{
				general.errorHandler(res, response.code, status);
			}
			else
			{
				res.status(status).send(response);
			}
		}
		else
		{
			if(status != 200)
			{
				res.redirect('/web?message=User+not+found');
			}
			else
			{
				res.redirect('/web/user');
			}
		}
	});
}

/**
 * Unauth an User.
 */
exports.logout = function(req, res)
{
	req.session.user = undefined;

	res.redirect('/web');
}
