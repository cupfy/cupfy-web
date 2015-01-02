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
 * @param body.email The user email.
 * @param body.password The user password.
 *
 * @return User The JSON representation of the user.
 */
var newUser = function(req, res)
{
	var html = req.query.html;
	var body = req.body;

	var response = {};
	var status = 200;

	var user;

	if(req.session.user) {
		editUser(req, res);
		return;
	}
	
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
			var password = crypto.createHmac('sha256', body.email);
				password.update(body.password);

			password = password.digest('hex');

			var apiSecret = crypto.createHmac('sha256', body.password);
				apiSecret.update(timestamp().toString());

			apiSecret = apiSecret.digest('hex');

			user = new User({
				email: body.email,
				password: password,
				namespace: [],
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
				req.session.message = 'Check the fields!';
				res.redirect('/web');
			}
			else
			{
				auth(req, res);
				return;
			}
		}
	});
}

exports.new = newUser;

/**
 * Edit an User.
 *
 * @param body.email The user email.
 * @param body.password The user password.
 *
 * @return User The JSON representation of the user.
 */
var editUser = function(req, res)
{
	var html = req.query.html;
	var body = req.body;

	var response = {};
	var status = 200;

	var user = req.session.user;

	// TODO: change this bullshit
	var type = -1;
	
	async.series([

		function(callback)
		{
			User
			.findOne({
				_id : user._id
			})
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					console.log(err);
					response.code = 999;
					status = 500;
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
			if(body.email)
			{
				user.email = body.email;
			}

			if(body.password)
			{
				var password = crypto.createHmac('sha256', user.email);
					password.update(body.password);

				user.password = password.digest('hex');
			}

			callback();
		},
		function(callback)
		{
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
					req.session.user = user.toObject();
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
				if(type == 0)
				{
					req.session.message = 'This namespace already exists!';
				}
			}
			
			res.redirect('/web/user');
		}
	});
}

/**
 * Add a namespace for User.
 *
 * @param body.namespace The user namespace.
 *
 * @return User The JSON representation of the user.
 */
exports.addNamespace = function(req, res)
{
	var html = req.query.html;
	var body = req.body;

	var response = {};
	var status = 200;

	var user = req.session.user;

	// TODO: change this bullshit
	var type = -1;
	
	async.series([

		function(callback)
		{
			User
			.findOne({
				_id : user._id
			})
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					console.log(err);
					response.code = 999;
					status = 500;
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
			if(body.namespace)
			{
				user.namespace.push(body.namespace);

				callback();
			}
			else
			{
				response.code = 400;
				status = 2;
				callback(true);
			}
		},
		function(callback)
		{
			User
			.findOne({ namespace : body.namespace })
			.exec(function(err, retData)
			{
				if(retData != null)
				{
					type = 0;
					response.code = 4;
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
					req.session.user = user.toObject();
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
				if(type == 0)
				{
					req.session.message = 'This namespace already exists!';
				}
			}
			
			res.redirect('/web/user');
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
var auth = function(req, res)
{
	var html = req.query.html;
	var body = req.body;

	var response = {};
	var status = 200;

	var user;
	var userFound = false;
	async.series([

		function(callback)
		{
			if(body.email === undefined
			|| body.password === undefined
			|| body.email == ""
			|| body.password == "")
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
			var password = crypto.createHmac('sha256', body.email);
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
					callback();
				}
				else
				{
					user = retData;
					req.session.user = user;

					userFound = true;

					callback();
				}
			});
		},
		function(callback)
		{
			if(!userFound)
			{
				User
				.findOne({ email : body.email })
				.lean()
				.exec(function(err, retData)
				{
					if(retData == null)
					{
						newUser(req, res);
						return;
					}
					else
					{
						response.code = 1;
						status = 404;
						callback(true);
					}
				});
			}
			else
			{
				callback();
			}
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
				req.session.message = 'Email or password incorrect!';
				res.redirect('/web');
			}
			else
			{
				res.redirect('/web/user');
			}
		}
	});
}

exports.auth = auth;

/**
 * Unauth an User.
 */
exports.logout = function(req, res)
{
	req.session.user = undefined;

	res.redirect('/web');
}
