'use strict';
let serviceController = require('../controller/service.controller');
let expressJWT = require('express-jwt');
module.exports = function (app) {
  app.route('/api/:uid/business/:bid/service').post(expressJWT({ secret: 'loveherve'}),serviceController.add);
  app.route('/api/:uid/business/:bid/service/:sid').get(expressJWT({ secret: 'loveherve'}),serviceController.get);
  app.route('/api/:uid/business/:bid/services').get(serviceController.list);
  app.route('/api/:uid/business/:bid/service/:sid').put(serviceController.update);
  app.route('/api/:uid/business/:bid/service/:sid').delete(serviceController.delete); 
  app.route('/api/business/:bid/bot/service/:sid/contact').post(serviceController.contact);
};
