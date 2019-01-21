'use strict';

module.exports = {
  server: {  
    allJS: ['server.js', 'config/**/*.js', 'modules/**/*.js'],
    models: 'modules/*/models/**/*.model.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/*/routes/**/*.js'],
    sockets: 'modules/*/sockets/**/*.js',
    config: 'modules/*/config/*.js',
  }
};
