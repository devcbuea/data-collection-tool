'use strict';
let productController = require('../../business/controller/product.controller');
let MediaController = require('../controller/media.controller');
let Authentication = require('../../authentication/middleware/authentication.middleware');
module.exports = function (app) {
    app.route('/api/media/:ftype/:otype/:oid/').post(Authentication.requireAuth, MediaController.upload.any(), MediaController.addMedia);
    app.route('/api/media/:fid/').get( MediaController.getMedia);
/*     app.route('/api/media/:mid').delete(Authentication.requireAuth, MediaController.delete);
 */};
