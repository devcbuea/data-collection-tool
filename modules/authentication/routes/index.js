'use strict'
module.exports = function (app) {
  
  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(modules|lib)/*').get(function(req,res){
  	  res.end('Sorry but you got the wrong page man')
  })
  // Define application route
  app.route('/').get(function(req,res){
  	  res.end('Welcome to data collection')
  })

}
