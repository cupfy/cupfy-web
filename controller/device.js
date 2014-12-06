var async = require('async')
	, moment = require('moment')
	, crypto = require('crypto')
	, general = require('../config/general.js')
	, userModel = require('../model/user.js')
	, deviceModel = require('../model/device.js')
	, push = require('./push.js');

var User = userModel.getUserModel();
var Device = deviceModel.getDeviceModel();

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
 * @return Device The JSON representation of the device.
 */
exports.get = function(req, res)
{
	var namespace = req.params.namespace;
	var query = req.query;

	var response = {};
	var status = 200;

	var device;
	
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
			.lean()
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
				_id : device.user
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
					device.namespace = retData.namespace;

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

	var device;
	
	async.series([

		function(callback)
		{
			Device
			.findOne({
				_id : id,
				user : user._id
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
			device.remove(function(err, retData)
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
				res.redirect('/web/user?message=Something+went+wrong.');
			}
			else
			{
				res.redirect('/web/user?message=Success.');
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
 * @param body.namespace The user namespace.
 *
 * @return Device The JSON representation of the device.
 */
exports.new = function(req, res)
{
	var body = req.body;

	var response = {};
	var status = 200;

	var user, device;
	
	async.series([

		function(callback)
		{
			if(body.name === undefined
			|| body.type === undefined
			|| body.pushId === undefined
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
			User
			.findOne({
				namespace : body.namespace
			})
			.exec(function(err, retData)
			{
				if(retData == null)
				{
					response.code = 100;
					status = 401;
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
			Device
			.findOne({
				user : user._id,
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
					user: user._id,
					name: body.name,
					type: body.type,
					pushId: body.pushId,
					approved: false
				});

				if(body.model)
				{
					device.model = body.model;
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

	var device;

	async.series([

		function(callback)
		{
			Device
			.findOne({
				_id : id,
				user : user._id
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
			device.approved = true;

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
				res.redirect('/web/user?message=Something+went+wrong.');
			}
			else
			{
				res.redirect('/web/user?message=Success.');
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
			Device
			.find({
				user : user._id,
				approved : true
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
					var json = {
						title : body.title,
						message : body.message
					}

					var android = [];
					var ios = [];

					for(var i in retData)
					{
						if(retData[i].type == 0)
						{
							android.push(retData[i].pushId);
						}
						else
						{
							ios.push(retData[i].pushId);
						}
					}

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
