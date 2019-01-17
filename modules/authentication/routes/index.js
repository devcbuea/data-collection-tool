'use strict'
let auth = require('../controller/authentication.controller')
let admin = require('../controller/admin.controller')
let Authentication = require('../../authentication/middleware/authentication.middleware')

module.exports = function (app) {
  
  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(modules|lib)/*').get(function(req,res){
  	  res.end('Sorry but you got the wrong page man')
  })
  // Define application route
  app.route('/').get(function(req,res){
  	  console.log('We are in index route what now')
  	  res.end('Welcome to tchizer')
  })
  
  //Admin create account
  app.route('/admin/account').post(Authentication.requireAuth ,admin.createAccount)
  // Admin add a product under a business
  app.route('/admin/account/business/:business_id/product/').post(Authentication.requireAuth, admin.addProduct)
  // Admin add a service under a business
  app.route('/admin/account/business/:business_id/service/').post(Authentication.requireAuth, admin.addService)
  // get user registeration page
  app.route('/api/register').get(function(req,res){
   	 res.end('get register page')
  })
  app.route('/api/login').get(function(req,res){
     res.end('get login page')
  })
  app.route('/api/:id/profile').get(Authentication.requireAuth, auth.profile)
  app.route('/api/profile/').put(Authentication.requireAuth, auth.update)
  app.route('/api/register').post(auth.register)
  app.route('/api/login').post(auth.login)
  app.route('/api/validationCode/:phoneNumber').get(auth.getValidationCode)
  app.route('/api/checkValidationCode').post(auth.checkValidationCode)
  app.route('/api/forgot_password').get(auth.forgotPassword)
  app.route('/api/reset').post(auth.resetPassword)
  app.route('/api/confirm').get(auth.verifyAccount)


}
