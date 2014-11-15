var express = require('express')
	, general = require('./config/general.js');

var app = express();

general.setDatabase();

general.configure(app, express);

general.setRoutes(app);

general.run(app);
