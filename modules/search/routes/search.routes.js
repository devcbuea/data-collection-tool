'use strict';
let searchController = require('../controller/search.controller');
module.exports = function (app) {
  app.route('/api/search/').get(searchController.search);
  app.route('/api/search/suggestions/').get(searchController.suggestions);
};