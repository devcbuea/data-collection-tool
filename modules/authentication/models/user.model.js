'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
   bcrypt  = require('bcryptjs'),
   Schema = mongoose.Schema;

/**
 * Account Schema
 */
//TODO: use a single pattern for property naming eg first_name, client_token
let UserSchema = new Schema({
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
  phonenumber: {
    type: String,
    default: ''
  },
  activated: { // client business has been validated
    type: Boolean,
    default: false
  },
  business_active: { // client has created a business [ activated | not_activated ]
    type: Boolean,
    default: false
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
  clientToken: {
    type: String,
    default: ''
  },
  signed_in: {
    type: Date,
    default: Date.now
  },
  last_seen: {
    type: Date,
    default: Date.now()
  }
});
UserSchema.pre('save', function (next) {
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
 /*    console.log("++++++++++++++++++++++++++++++++++++++++++++ password needs to be modified.", )
    argon2.hash(user.password, { type: argon2.argon2id}).then(hash => {
         user.password = hash;
         next();
    }, err => next(err) ); */
    
});
UserSchema.statics.authenticate = function (username, password, callback) {
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',{username: username, password: password});
    var user = this;
      user.findOne({ $or:[
                        {username: username},
                        {email: username}
                    ]
                })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          return callback(err);
        }

        bcrypt.compare(password.trim(), user.password.trim(), function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback(err);
          }
        }) 
    /*     argon2.verify(user.password.trim(), password.trim()).then(match => {
          if (match) {
            // password match
            return callback(null, user);
          } else {
            // password did not match
            return callback(err);
          }
        }).catch(err => {
            // internal failure
            return callback(err);
        }); */
      });
  }
  UserSchema.methods.verifyPassword = async function(password){
      let user = this;
      let results = await bcrypt.compare(password.trim(), user.password.trim());
      return results;
  };

module.exports = mongoose.model('UserSchema', UserSchema);