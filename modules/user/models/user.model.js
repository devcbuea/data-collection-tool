'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
   bcrypt  = require('bcryptjs'),
   Schema = mongoose.Schema;

/**
 * User Schema
 */
let User = new Schema({
  username: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill username',
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: 'Please fill in email',
    default: '',
    trim: true
  },
  password: {
    type: String,
    required: 'Password is required'
  },
  permission: {
    type: String,
    default: 'user'
  },
  first_name: {
    type: String,
    required: 'Password is required'
  },
  last_name: {
    type: String,
    default: ''
  },
  banned:{
    type: Boolean,
    default: false
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  photo:{
    type: Schema.Types.ObjectId,
    ref: "MediaSchema"
  },
  signed_in: {
    type: Date,
    default: Date.now
  },
  last_seen: {
    type: Date,
    default: Date.now
  }
});
User.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    //$Vers$log2(NumRounds)$saltvalue
    let salt = bcrypt.genSaltSync(10)
    bcrypt.hash(user.password, salt, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
});
User.statics.authenticate = function (email, password, callback) {
    var user = this;
      user.findOne({email}, function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var error = new Error('User not found.');
          return callback(error);
        }

        bcrypt.compare(password.trim(), user.password.trim(), function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback(err);
          }
        }) 
      });
  }
  User.methods.verifyPassword = async function(password){
      let user = this;
      let results = await bcrypt.compare(password.trim(), user.password.trim());
      return results;
  };

  // User.pre('save', function(next){
  //   var user = this ;
  //   User.find({ 'username': username,'email':email },
  //     function(err, users){
  //       if(err) {
  //         return next(err);
  //       } else if(users) {
  //         if (_.find(users , {email: user.email})){
  //           user.invalidate('email', 'email is already registered'); 
  //           next( new Error("email is already registered"));
  //         }
  //         else if (_.find(users , {username: user.username})){
  //           user.invalidate('username', 'username is already taken'); 
  //           next( new Error("username is already taken"));
  //         }
  //       }
  //       else{
  //         next();
  //       }   
  //   });
  // });

module.exports = mongoose.model('User', User);