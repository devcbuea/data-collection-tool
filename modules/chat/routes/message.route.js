'use strict';
let messageController = require('../controller/message.controller');
let Authentication = require('../../authentication/middleware/authentication.middleware');
const Util = require('../../utils/util');

module.exports = function (app) {
    app.route('/api/message/').post(Authentication.requireAuth, messageController.add);
    app.route('/api/message/unseen/').get(Authentication.requireAuth, messageController.unread);
    app.route('/api/message/').get(Authentication.requireAuth, messageController.get);
    console.log(app.io);

};
