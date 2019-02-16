const jwt = require('jsonwebtoken')

/**
 * Verify if user is authenicated, authentication is done by token or session
 * @function auth authentication middleware
 * @param {object} req request object
 * @param {object} res response object
 * @returns {object}
 */
exports.auth = function(req, res, next){
    let token = null
    // check if token is available as a header or query param
    if(req.headers.authorization){
      let authorization = req.headers.authorization.trim().split(" ")
      if(authorization[0] === 'Bearer'){
        token = authorization[1]
      }
    }else req.query.token ? token = req.query.token : null
    
    if(token){
        try {
          var user = jwt.verify(token, "devcbueaisagoodboy")
        } catch (e) {
          return res.status(401).send("Could not authenticate user")
        }
        if(!user) {
          return res.status(401).send("Could not authenticate user")
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