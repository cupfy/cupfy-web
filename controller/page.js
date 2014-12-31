var async = require('async')
	, moment = require('moment')
	, crypto = require('crypto')
	, general = require('../config/general.js')
	, userModel = require('../model/user.js')
	, deviceModel = require('../model/device.js');

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
 * Get the index page.
 */
exports.index = function(req, res)
{
	if(req.session.user)
	{
		res.redirect('/web/user');
	}
	else
	{
		var params = {};

		if(req.session.message)
		{
			params.message = req.session.message;
			req.session.message = undefined;
		}

		res.render('index', params);
	}
}

/**
 * Get the docs page.
 */
exports.docs = function(req, res)
{
	var params = {};

	if(req.session.message)
	{
		params.message = req.session.message;
		req.session.message = undefined;
	}

	res.render('docs', params);
}

/**
 * Get the user page.
 */
exports.user = function(req, res)
{
	if(req.session.user)
	{
		Hook
		.find({ namespace : req.session.user.namespace })
		.populate('device')
		.exec(function(err, hooks)
		{
			var params = {};

			if(req.session.message)
			{
				params.message = req.session.message;
				req.session.message = undefined;
			}

			params.user = req.session.user;
			params.devices = hooks.map(function(hook)
			{
				hook.device.approved = hook.approved;
				hook.device.removed = hook.removed;
				return hook.device;
			});

			res.render('user', params);
		});
	}
	else
	{
		res.redirect('/web');
	}
}
