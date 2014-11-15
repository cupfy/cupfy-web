var async = require('async')
	, moment = require('moment')
	, crypto = require('crypto')
	, general = require('../config/general.js')
	, userModel = require('../model/user.js');

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
				apiKey: password.slice(2, 7),
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

		if(status != 200)
		{
			general.errorHandler(res, response.code, status);
		}
		else
		{
			res.status(status).send(response);
		}
	});
}

/**
 * Auth an User.
 *
 * @param body.email The user email.
 * @param body.password The user password.
 * @param (opt) body.longExp If it should expire after a long time.
 *
 * @return UserToken The JSON representation of the userToken.
 */
exports.auth = function(req, res)
{
	var body = req.body;

	var response = {};
	var status = 200;

	var user, userToken, longExp = false;
	
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
				if(body.longExp !== undefined)
				{
					longExp = true;
				}

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
					callback();
				}
			});
		},
		function(callback)
		{
			var expiration = moment();

			if(!longExp)
			{
				expiration.add(1, 'days');
			}
			else
			{
				expiration.add(1, 'years');
			}

			var token = crypto.createHmac('sha1', body.email);
				token.update(expiration.format('X'));
				token.update(timestamp());

			token = token.digest('hex');

			userToken = new UserToken({
				user: user._id,
				token: token,
				expiration: expiration.format('X')
			});

			userToken.save(function(err, retData)
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
					userToken = retData;
		
					var options = [{
						path: 'user',
						model: 'User',
						select: '-password -__v'
					}];

					UserToken
					.populate(userToken, options, function(err, retData)
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
							userToken = retData;

							callback();
						}
					});
				}
			});
		}
	], function(invalid)
	{
		if(!invalid)
			response = userToken;

		if(status != 200)
		{
			general.errorHandler(res, response.code, status);
		}
		else
		{
			res.status(status).send(response);
		}
	});
}
