const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DataProfile = new Schema({
    user:{
        type: Schema.Types.ObjectId,
    },
    name:{
        type: String,
        required:true
    },
    type:{
        type: String,
        required:true
    },
    required:{
        type:Boolean,
        required: true,
        default: false
    }, 
    contributors:{
        type: Array,
        required: false
    },
    fieldCount: {
        type: Number,
        required: true,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('DataProfile', DataProfile);