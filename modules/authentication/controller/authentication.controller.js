/**
 * @file authentication controller file
 */
let User = require('../models/user.class')
const jwt = require('jsonwebtoken')
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
        }else return res.status(500).json({message: errorMessage})
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
        let {email, password} = req.body
        try{
            let user = await User.authenticate(email, password)
            // create jwt object
            return res.json(user)
        }catch(e){
            console.log(e)
            return res.status(401).send('Password or email not correct.')
        }
    }
}