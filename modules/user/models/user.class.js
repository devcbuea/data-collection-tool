const mongoose = require('mongoose')
require('../models/user.model')
const UserModel = mongoose.model('User')

/** 
 * @classdesc User model class, manage the the user module with db
 * 
*/
class User {
    /**
     * @constructor Initiliases user model class
     * @async
     * @param {object} user_props user object that initialises user
     * @returns {void}
     */
    constructor(user_props){
        // if param is a string in this case id, we get the object from db
        if(typeof(user_props) == 'object'){
            this.first_name = user_props['first_name'] 
            this.last_name = user_props['last_name']
            this.username = user_props['username']
            this.email = user_props['email']
            this.password = user_props['password']
            this.permission = user_props['permission'] || 'user'
            this.banned = user_props['banned'] || false
            this.signed_in = user_props['signed_in']
            this.last_seen = user_props['last_seen'] 
            this.deleted = user_props['delete'] || false 
            this.photo = user_props['photo'] ||  null
            this.created = user_props['create'] || new Date()
            this.errorMessage = null
        }else{
            /**
             * implement a function that calls an asyc function
             *  to populate user from constructor
             * */ 
        }
    }
    /**
     * Get user with id
     * @method find
     * @param {string} id 
     * @returns {false | User}
     */
    static find(id){
        return new Promise((resolve)=>{
            UserModel.findById(id, (err, user) => {
                if(err)
                    resolve(false)
                resolve(user)
            })
        })
    }
    /**
     * @method authenticate Authenicate user
     * @param {string} email 
     * @param {string} password 
     */
    static authenticate(email, password){
        return new Promise( (resolve) => {
            UserModel.authenticate(email, password, (err, user) => {
                if(err){
                    console.log(err)
                    resolve(false)
                }else{
                    resolve(user)
                }
           })
        })
    }
    /**
     * Get the user properties as an object
     * @method getObject
     * @param {void}
     * @returns {object}  
     */
    getObject(){
        return JSON.parse((JSON.stringify(this)))
    }
    /**
     * @method getProp Get user field by name
     * @param {string, [filter]}
     * @returns {*}
     */
    getProp(field_name){
        return that[field_name]
    }
    /**
     * @method save
     * @async
     * @param {void}
     * @returns {Promise}
     */
    save(){
        let that = this
        let user = new UserModel(that)
        return new Promise((resolve) => {
            user.save((err, user_) => {
                if(err){
                    that.errorMessage = err.message
                    return resolve(false)
                }
                that = Object.assign(that, user_["_doc"])
                return resolve(true)
            })
        })
    }

    static exist(query){
        return new Promise((resolve)=>{
            UserModel.findOne(query,function(err, user){
                if (err) {
                    console.log(err)
                    return resolve(false);
                }
               if(user){
                    return resolve(user)
               } else return resolve(false)                      
            });
        });
    }

    static resetPassword(token, password){
        return new Promise((resolve)=>{
            TokenModel.findOne({token:token, purpose:'reset'}, function(err, _token){
                let diff = Date.now()- (new Date(_token.created)).getTime();
                if(diff > 300){
                    console.log(err);
                    return resolve(false);
                }else{

                    return resolve(true);
                }
            });
        });
    }
}
module.exports = User;