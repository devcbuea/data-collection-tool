'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let MessageSchema = new Schema({
    text: {
        type: String,
        default: '',
        required: 'no message text',
        trim: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema"
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "ConversationSchema"
    },
    product: {
        type: String,
        default: '',
        trim: true
    },
    business: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
   
});

module.exports = mongoose.model('MessageSchema', MessageSchema);