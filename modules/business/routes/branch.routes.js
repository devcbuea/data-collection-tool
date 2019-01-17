'use strict';
let branchController = require('../controller/branch.controller');

module.exports = function (app) {
  app.route('/api/:uid/business/:bid/branch').post(branchController.add);
  app.route('/api/:uid/business/:bid/branch/:brid').get(branchController.get);
  app.route('/api/:uid/business/:bid/branches').get(branchController.list);
  app.route('/api/:uid/business/:bid/branch/:brid').put(branchController.update);
  app.route('/api/:uid/business/:bid/branch/:brid').delete(branchController.delete); 
};
