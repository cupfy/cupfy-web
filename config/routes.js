var user = require('../controller/user.js')
	, device = require('../controller/device.js')
	, page = require('../controller/page.js')
	, general = require('./general.js');

exports.init = function(app)
{
	app.get('/', function(req, res) { res.redirect('/web') });
	app.get('/web', page.index);
	app.get('/web/user', page.user);
	app.get('/web/docs', page.docs);

	app.get('/user', general.isAuthenticated, user.get);
	app.get('/user/logout', general.isAuthenticated, user.logout);
	app.get('/device', device.get);

	app.post('/user', user.new);
	app.post('/user/namespace', user.addNamespace);
	app.post('/user/login', user.auth);

	app.post('/device', device.new);
	app.post('/device/:id', device.edit);
	app.post('/device/hook', device.hook);
	app.post('/device/:id/approve', general.isAuthenticated, device.approve);
	app.post('/device/:id/remove', general.isAuthenticated, device.remove);
	app.post('/device/push', device.push);

	app.get('/*', function(req, res) { res.redirect('/'); });
	app.post('/*', function(req, res) { res.redirect('/'); });
	app.put('/*', function(req, res) { res.redirect('/'); });
	app.delete('/*', function(req, res) { res.redirect('/'); });
}
