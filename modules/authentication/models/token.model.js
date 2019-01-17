'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

/**
 * Account Schema
 */
//TODO: use a single pattern for property naming eg first_name, client_token
let TokenSchema = new Schema({
    token: {
        type: String,
        default: ''
    },
    purpose: {
        type: String,
        default: 'verify'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('TokenSchema', TokenSchema)