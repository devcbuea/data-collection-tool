'use strict'

const mongoose = require('mongoose'),
    TokenModel = mongoose.model('Token'),
    User = require('./user.class');

class Token{
    static async save(token){
        return new Promise( (resolve) => {
            let tokenModel = new TokenModel(token)
            tokenModel.save((err, token_) => {
                if(err)
                    return resolve(false)
                return resolve(token_)
            })
        })
    }
    static async generateToken(options){
        let {purpose, id} = options        
        let token_ = await Token.save({token: require('crypto').randomBytes(32).toString('hex') , purpose, user: id})
        if(!token_)
            return false
        return token_       
    }
}

module.exports = Token;