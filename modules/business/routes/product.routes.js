'use strict'
let productController = require('../controller/product.controller')
let Authentication = require('../../authentication/middleware/authentication.middleware')
const Util = require('../../utils/util')

module.exports = function (app) {
  app.route('/api/business/:bid/product').post(Authentication.requireAuth, productController.add)
/*   app.route('/api/:uid/business/:bid/branch/:brid/product').post(productController.add)
 */ 
  app.route('/api/:uid/business/:bid/branch/:brid/product/:pid').get(productController.get)
  // get details about a particular product
  app.route('/api/business/:bid/product/:pid').get(productController.get)
  app.route('/api/business/:bid/product/:pid').delete(Authentication.requireAuth, productController.delete)
  app.route('/api/business/:bid/products/').get(productController.list)
  app.route('/api/business/:bid/product/:pid').put(Authentication.requireAuth, productController.update)
  app.route('/api/:uid/business/:bid/branch/:brid/product/:pid').delete(productController.delete) 
  app.route('/api/business/:bid/bot/product/:pid/buy').post(productController.buyBot) 
}
