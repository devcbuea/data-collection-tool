'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  chalk = require('chalk'),
  path = require('path'), 
  mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function () {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });
};

// Initialize Mongoose
module.exports.connect = function (cb) {
  var _this = this;
 
  var db = mongoose.connect(config.db.uri, config.db.options).then((database) => {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);
      // Call callback FN
      if (cb) cb(database);
    }).catch(err => {
      // Log Error
          console.error(chalk.red('Could not connect to MongoDB!'));
          console.log(err);
  });;
};

module.exports.disconnect = function (cb) {
  mongoose.disconnect(function (err) {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    cb(err);
  });
};
