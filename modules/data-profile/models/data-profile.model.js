const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const config = require('../../../core/env/default')


let DataProfile = new Schema({
    user:{
        type: Schema.Types.ObjectId,
    },
    name:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    category:{
        type:String,
        required: false
    }, 
    contributors:{
        type: Array,
        required: false
    },
    fields: Array,
    required: false
});

module.exports = mongoose.model('DataProfile', DataProfile);