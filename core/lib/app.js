'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
	express = require('./express'),
	mongoose = require('./mongoose'),
	chalk = require('chalk');

// Initialize Models
mongoose.loadModels();
module.exports.loadModels = function loadModels() {
	mongoose.loadModels();
};

module.exports.init = function init(callback) {
	mongoose.connect(function (db) {
		// Initialize express
		let app = express.init(db);
		if (callback) callback(app, db);
	});
};

module.exports.start = function start(app, db) {
	// Start the app by listening on <port>
	app.listen(config.port, function() {
			// Logging initialization
			console.log('--');
			console.log(chalk.green(config.app.title));
			console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
			console.log(chalk.green('Port:\t\t\t\t' + config.port));
			console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
			if (process.env.NODE_ENV === 'secure') {
				console.log(chalk.green('HTTPs:\t\t\t\ton'));
			}
			console.log('--');
	});
};
