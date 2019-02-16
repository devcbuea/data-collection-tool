const mongoose = require('mongoose'),
    UserModel = mongoose.model('User')
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
        console.log("We are in authentication")
        return new Promise( (resolve) => {
            UserModel.authenticate(email, password, (err, user) => {
                if(err){
                    resolve("Wrong password or email")
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
                    resolve(false)
                }
                that = Object.assign(that, user_["_doc"])
                resolve(true)
            })
        })
    }
}
module.exports = User