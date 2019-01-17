'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ConversationSchema = new Schema({
    speaker1: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema"
    },
    speaker2: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema"
    },
    created: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    },
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "MessageSchema"
        }
    ]
    
});

module.exports = mongoose.model('ConversationSchema', ConversationSchema);