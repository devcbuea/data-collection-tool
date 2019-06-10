const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const config = require('../../../core/env/default')


let Token = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    created_at:{
        type: Date,
        required:true,
        default: Date.now()
    },
    purpose:{
        type:String,
        default:'verify',
        required: true
    }, 
    token:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Token', Token);