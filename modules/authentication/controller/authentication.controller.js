/**
 * @file authentication controller file
 */
let User = require('../models/user.class')
const jwt = require('jsonwebtoken')
const config = require('../../../core/env/default')
module.exports = {
    /**
     * Signup user 
     * @method signup registers users to the application
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async signup(req, res){
        let user = new User(req.body)
        let saved = await user.save()
        if(saved){
            // remove sensitive data
            delete user.password
            delete user.errorMessage
            delete user.permission
            return res.json(user)
        }else return res.status(500).json(user.errorMessage)
    },
    /**
     * Signup user 
     * @method login authenticates users
     * @async
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async login(req, res){
        var {email, password} = req.body
        try{
            let user = await User.authenticate(email, password)
            if(user){
                let {id, email, permission, first_name, last_name, photo} = user;
                // create jwt object
                let token = jwt.sign(
                                {id, email, permission, first_name, last_name, photo}
                                ,config.jwt.secret,
                                {
                                    issuer: config.jwt.issuer,
                                    expiresIn: config.jwt.expiresIn
                                }
                            )
                return res.json({id, email, permission, first_name, last_name, photo, token})
            }else return res.status(401).send('Email or password is not correct.')
            
        }catch(e){
            return res.status(500).send(e)
        }
    }
}