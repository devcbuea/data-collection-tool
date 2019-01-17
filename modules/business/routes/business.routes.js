'use strict';
let businessController = require('../controller/business.controller');
let Authentication = require('../../authentication/middleware/authentication.middleware');
module.exports = function (app) {
  
  app.route('/api/:uid/business').post(Authentication.requireAuth, businessController.add);
  app.route('/api/business/').get(Authentication.requireAuth, businessController.list);
  app.route('/api/business/:bid').get(businessController.get);
  app.route('/api/user/business/verify').get(Authentication.requireAuth, businessController.verify);
  app.route('/api/business/').post(Authentication.requireAuth, businessController.add);
  app.route('/api/:uid/businesses').get(businessController.list);
  app.route('/api/:uid/business/:bid').put(businessController.update);
  app.route('/api/business/:bid').put(Authentication.requireAuth,businessController.update);
  app.route('/api/business/message/').post(Authentication.requireAuth, businessController.message);
  app.route('/api/:uid/business/:bid').delete(businessController.delete);
  
};
