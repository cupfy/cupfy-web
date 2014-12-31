var async = require('async')
	, moment = require('moment')
	, crypto = require('crypto')
	, general = require('../config/general.js')
	, userModel = require('../model/user.js')
	, deviceModel = require('../model/device.js')
	, push = require('./push.js');

var User = userModel.getUserModel();
var Device = deviceModel.getDeviceModel();
var Hook = deviceModel.getHookModel();

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
 * Get an Device by it's pushId.
 *
 * @param pushId The device pushId.
 *
 * @return Hook The JSON representation of the hooks.
 */
exports.get = function(req, res)
{
	var query = req.query;

	var response = {};
	var status = 200;

	var hooks;
	
	async.series([

		function(callback)
		{
			if(query.pushId === undefined)
			{
				response.code = 2;
				status = 400;
				callback(true);
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			Device
			.findOne({
				pushId : query.pushId
			})
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					response.code = 10;
					status = 404;
					callback(true);
				}
				else
				{
					device = retData;

					callback();
				}
			});
		},
		function(callback)
		{
			Hook
			.find({
				device : device._id
			})
			.exec(function(err, retData)
			{
				hooks = retData;

				callback();
			});
		}
	], function(invalid)
	{
		if(!invalid)
			response = hooks;

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
 * Remove an Device by it's id.
 *
 * @param id The device id.
 */
exports.remove = function(req, res)
{
	var html = req.query.html;
	var id = req.params.id;
	var user = req.user;

	var response = {};
	var status = 200;

	var hook;
	
	async.series([

		function(callback)
		{
			Hook
			.findOne({
				device : id,
				namespace : user.namespace
			})
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					response.code = 10;
					status = 404;
					callback(true);
				}
				else
				{
					hook = retData;

					callback();
				}
			});
		},
		function(callback)
		{
			hook.removed = true;

			hook.save(function(err, retData)
			{
				if(err)
				{
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
				req.session.message = 'Oops... something went wrong!';
				res.redirect('/web/user');
			}
			else
			{
				req.session.message = 'Device removed!';
				res.redirect('/web/user');
			}
		}
	});
}

/**
 * Create a Device.
 *
 * @param body.name The device name.
 * @param body.model The device model.
 * @param body.type The device type.
 * @param body.pushId The device pushId.
 *
 * @return Device The JSON representation of the device.
 */
exports.new = function(req, res)
{
	var body = req.body;

	var response = {};
	var status = 200;

	var device;
	
	async.series([

		function(callback)
		{
			if(body.name === undefined
			|| body.model === undefined
			|| body.type === undefined
			|| body.pushId === undefined)
			{
				response.code = 2;
				status = 400;
				callback(true);
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			Device
			.findOne({
				pushId : body.pushId
			})
			.exec(function(err, retData)
			{
				device = retData;

				callback();
			});
		},
		function(callback)
		{
			if(device == null)
			{
				device = new Device({
					name: body.name,
					model: body.model,
					type: body.type,
					pushId: body.pushId
				});

				device.save(function(err, retData)
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
			else
			{
				callback();
			}
		}
	], function(invalid)
	{
		if(!invalid)
			response = device;

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
 * Hook a Device.
 *
 * @param body.pushId The device pushId.
 * @param body.namespace The namespace.
 *
 * @return Hook The JSON representation of the hook.
 */
exports.hook = function(req, res)
{
	var body = req.body;

	var response = {};
	var status = 200;

	var device, hook;
	
	async.series([

		function(callback)
		{
			if(body.pushId === undefined
			|| body.namespace === undefined)
			{
				response.code = 2;
				status = 400;
				callback(true);
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			Device
			.findOne({
				pushId : body.pushId
			})
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					response.code = 10;
					status = 404;
					callback(true);
				}
				else
				{
					device = retData;

					callback();
				}
			});
		},
		function(callback)
		{
			User
			.findOne({
				namespace : body.namespace
			})
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
					callback();
				}
			});
		},
		function(callback)
		{
			Hook
			.findOne({
				namespace : body.namespace,
				device : device._id
			})
			.exec(function(err, retData)
			{
				hook = retData;

				callback();
			});
		},
		function(callback)
		{
			if(hook == null) {
				hook = new Hook({
					device: device._id,
					namespace: body.namespace,
					approved: false,
					removed: false
				});

				callback();
			} else if(hook.removed) {
				hook.removed = false;
				hook.approved = false;

				callback();
			} else {
				response.code = 13;
				status = 409;
				callback(true);
			}
		},
		function(callback)
		{
			hook.save(function(err, retData)
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
			response = hook;

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
 * Approve a Device.
 *
 * @return Device The JSON representation of the device.
 */
exports.approve = function(req, res)
{
	var html = req.query.html;
	var id = req.params.id;
	var user = req.user;

	var response = {};
	var status = 200;

	var hook;

	async.series([

		function(callback)
		{
			Hook
			.findOne({
				device : id,
				namespace : user.namespace
			})
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					response.code = 10;
					status = 404;
					callback(true);
				}
				else
				{
					hook = retData;

					callback();
				}
			});
		},
		function(callback)
		{
			hook.approved = true;

			hook.save(function(err, retData)
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
			response = hook;

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
				req.session.message = 'Oops... something went wrong!';
				res.redirect('/web/user');
			}
			else
			{
				req.session.message = 'Device approved!';
				res.redirect('/web/user');
			}
		}
	});
}

/**
 * Push to all devices.
 *
 * @param body.title The push title.
 * @param body.message The push message.
 * @param body.apiSecret The push apiSecret.
 */
exports.push = function(req, res)
{
	var body = req.body;

	var response = {};
	var status = 200;
	
	var user;
	var devices;

	async.series([

		function(callback)
		{
			if(body.title === undefined
			|| body.message === undefined
			|| body.apiSecret === undefined)
			{
				response.code = 2;
				status = 400;
				callback(true);
			}
			else
			{
				callback();
			}
		},
		function(callback)
		{
			User
			.findOne({ apiSecret : body.apiSecret })
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
			Hook
			.find({
				namespace : user.namespace,
				approved : true,
				removed : false
			})
			.populate('device')
			.lean()
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					callback();
				}
				else
				{
					var json = {
						title : body.title,
						message : body.message,
						namespace : user.namespace
					}

					var android = [];
					var ios = [];

					retData.map(function(hook)
					{
						if(hook.device.type == 0)
						{
							android.push(hook.device.pushId);
						}
						else
						{
							ios.push(hook.device.pushId);
						}
					});

					push.send(json, android, ios, callback);
				}
			});
		}
	], function(invalid)
	{
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
