'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

/**
 * Account Schema
 */
var Media = new Schema({
  originalname: {
    type: String,
    default: ""
  },
  fieldname: {
    type: String,
    default: ""
  }, 
  encoding: {
    type: String,
    default: ""
  },
  size: {
    type: String,
    default: ""
  },
  mimetype: {
    type: String,
    default: ""
  },
  used: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.ObjectId,
    ref: "User"
  }, 
  otype: { // [user | product | business]
    type: String,
    default: ""
  },
  oid: { // id of [user | product | business]
    type: String,
    default: ""
  },
  ftype: { // id of [user | product | business]
    type: String,
    default: ""
  },
  created: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('MediaSchema', Media)