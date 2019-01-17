'use strict';
let notificationController = require('../controller/notification.controller');
module.exports = function (app) {
  app.route('/api/:uid/notification').post(notificationController.add);
  app.route('/api/:uid/notification/:nid').get(notificationController.get);
  app.route('/api/:uid/notification').get(notificationController.list);
  app.route('/api/:uid/notification/:nid').put(notificationController.update);
};
