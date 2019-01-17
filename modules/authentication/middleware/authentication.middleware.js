const jwt = require('jsonwebtoken')

exports.isLoggedin = function(req, res, next) {
    if (req.session && req.session.userId) {
      return next()
    } else {
      var err = new Error('You must be logged in to view this page.')
      err.status = 401
      return next(err)
    }
}
exports.requireAuth = function(req, res, next){
    let token = ""
    if(req.headers.authorization){
      let authorization = req.headers.authorization.trim().split(" ")
      if(authorization[0] === 'Bearer'){
        token = authorization[1]
      }
    }else token = req.query.token
    
    if(token){
      //split the authentication header into type and token   
        try {
          var user = jwt.verify(token, "ilovetechthanyoudo")
        } catch (e) {
          res.status(401)
          return res.send("Could not authenticate user")
        }
        if(!user) {
          res.status(401)
          return res.send("Could not authenticate user")
        } else {
          req.user = user
          next()
        }
    }else{
        if (req.session && req.session.userId) {
          return next()
        } else {
          var err = new Error('You must be logged in to view this page.')
          err.status = 401
          return next(err)
        }
    }
}