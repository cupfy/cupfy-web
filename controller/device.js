var async = require('async')
	, moment = require('moment')
	, crypto = require('crypto')
	, constants = require('../config/constants.js').get()
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
 * Get an Device by it's deviceId.
 *
 * @return Hook The JSON representation of the hooks.
 */
exports.get = function(req, res)
{
	var deviceId = req.params.deviceId;

	var response = {};
	var status = 200;

	var hooks;
	var returnData = {};
	
	async.series([

		function(callback)
		{
			if(deviceId === undefined)
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
				deviceId : deviceId
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

				returnData.device = device;
				returnData.hooks = hooks;

				callback();
			});
		}
	], function(invalid)
	{
		if(!invalid)
			response = returnData;

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
 * Create a Device.
 *
 * @param body.name The device name.
 * @param body.model The device model.
 * @param body.type The device type.
 * @param body.deviceId The device deviceId.
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
			|| body.deviceId === undefined
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
				deviceId : body.deviceId
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
					deviceId: body.deviceId,
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
 * Edit a Device.
 *
 * @param body.name The device name.
 * @param body.pushId The device pushId.
 *
 * @return Device The JSON representation of the device.
 */
exports.edit = function(req, res)
{
	var deviceId = req.params.deviceId;
	var body = req.body;

	var response = {};
	var status = 200;

	var device;
	
	async.series([

		function(callback)
		{
			if(deviceId === undefined)
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
				deviceId : deviceId
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
			if(body.name)
			{
				device.name = body.name;
			}

			if(body.pushId)
			{
				device.pushId = body.pushId;
			}

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
 * @param body.namespace The namespace.
 *
 * @return Hook The JSON representation of the hook.
 */
exports.hook = function(req, res)
{
	var deviceId = req.params.deviceId;
	var body = req.body;

	var response = {};
	var status = 200;

	var device, hook;
	
	async.series([

		function(callback)
		{
			if(deviceId === undefined
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
				deviceId : deviceId
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
			res.redirect('/device/' + deviceId);
		}
	});
}

/**
 * Push to all devices.
 *
 * @param body.title The push title.
 * @param body.message The push message.
 * @param body.namespace The push namespace.
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
			|| body.namespace === undefined
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
			.findOne({
				apiSecret : body.apiSecret,
				namespace : body.namespace
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
			Hook
			.find({
				namespace : body.namespace,
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
						namespace : body.namespace
					}

					var devices = {}
					devices.android = [];
					devices.ios = [];
					devices.wp = [];

					retData.map(function(hook)
					{
						switch(hook.device.type)
						{
							case constants.DEVICE.ANDROID:
								devices.android.push(hook.device.pushId);
								break;

							case constants.DEVICE.IOS:
								devices.ios.push(hook.device.pushId);
								break;

							case constants.DEVICE.WP:
								devices.wp.push(hook.device.pushId);
								break;
						}
					});

					push.send(json, devices, callback);
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
