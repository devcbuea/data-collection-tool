'use strict'
let DataProfile = require('../controller/data-profile.controller');

module.exports = function (app) {
 
  app.route('/data-profile').get(function(req,res){
  	  res.end('Hello there,data-profile successfully reached.')
  });
  // create a data profile
  app.route('/data-profile').post(DataProfile.create);
  // get all information about dataprofile with DataProfileID
  app.route('/data-profile/:dataProfileId').get(DataProfile.get);
  // get summary information about dataprofile with DataProfileID
  app.route('/data-profile/:dataProfileId').get(DataProfile.getSummary);
  // update information about data profile with DataProfileID
  app.route('/data-profile/:dataProfileId').put(DataProfile.update);
  // update fields used to collect data for a particular profile
  app.route('/data-profile/:dataProfileId/data-collection').put(DataProfile.updateDataCollectionFields);
  // delete data profile
  app.route('data-profile/:dataProfileId').delete(DataProfile.delete)
}
