/**
 * @file authentication controller file
 */
let User = require('../models/user.class')
let Token = require('../models/token.class')
const jwt = require('jsonwebtoken')
const config = require('../../../core/env/default')
const validator = require('validator')
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
    },

    async forgotPassword(req, res){
        let email = req.body.email
        try{
            if(validator.isEmail(email)){
                // check if email exists in platform
                let user = await User.exist({email: email})
                console.log("The user is " + user)
                if(user){
                    //create a reset token
                    let result = await Token.generateToken({purpose: 'reset', id: user.id})
                    if(result){
                        let url = config.siteURL + `/verify-token/${result.token}`
                        let message = `Hello ${user.first_name},
                        <br/> <p>Here is the link to reset your token ${url}</p> <br/>`
                       // Util.sendEmail(null, user.email, "New Verification Token", message)
                        console.log(message)
                        return res.send("success")
                    }
                    res.status(500)
                    return res.end("An error occured")
                }else{
                    res.status(404)
                    console.log("Email is not registered")
                    return res.end("This email is not registered. Please signup")
                }
            }else{
                res.status(401)
                console.log("The email entered is not valid: ", email)
                return res.end("The email is not valid")
            }
        }catch(e){
            res.status(500)
            console.log(e)
            return res.end("An error occured")
        }
    },

    async resetPassword(req, res){
        let token = req.body.token
        let password = req.body.password
        let confirm_password = req.body.confirm_password

        if(token.length != 64){
            res.status(400)
            return res.send("Reset token is not valid.")
        }
        if(password.length < 10 || (password != confirm_password)){
            res.status(400)
            return res.send("An error occured")
        }

        //get the token
        try{
            let result = await User.resetPassword(token, password)
            if(result == 'success')
                return res.end('success')
            res.status(500)
            return res.end(result)
        }catch(e){
            console.log(e)
            res.status(500)
            return res.end("An error occured.")
        }
    }
}