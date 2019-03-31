'use strict'
let Authentication = require('../controller/authentication.controller');

module.exports = function (app) {
  
  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(modules|lib)/*').get(function(req,res){
  	  res.end('Route not found')
  });
  // Define application route
  app.route('/').get(function(req,res){
  	  res.end('Welcome to data collection')
  });
  app.route('/signup').post(Authentication.signup);
  app.route('/login').post(Authentication.login);

  //route for forgot password
  app.route('/forgot-password').post(Authentication.forgotPassword);
  app.route('/reset-password').post(Authentication.resetPassword);
    
}
