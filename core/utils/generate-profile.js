/**
 * @function generateDataProfileModel generates the model of the fields of a data profile
 * @param {string} id id of dataprofile 
 * @param {object} fields fields of dataprofile
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const path = require('path')

function generateDataProfileModel(id, fields){
    const fs = require('fs')
    const filename = `dataset_model_${id}.js`
    let file = path.resolve("modules/data-profile/models/generated-models/" + filename)
    let baseFieldContainer = {
        'data_profile':{
            type: Schema.Types.ObjectId,
            ref: 'Data-Profile',
            required: true
        },
        'created_at':{
            type: Date,
            required:true,
            default: Date.now()
        },
    }
    const fieldContainer = {}
    
    for(let field of fields){
        fieldContainer[field.name.toLowerCase()] = {
            'type': field.type.toLowerCase(),
            'required': field.required
        }
    }
    baseFieldContainer = Object.assign(baseFieldContainer, fieldContainer)
    let model = 
   `
    const mongoose = require('mongoose')
    const Schema = mongoose.Schema    
    let dataset_model_${id} = new Schema(
        ${JSON.stringify(baseFieldContainer)}
    )    
    module.exports = mongoose.model('dataset_model_${id}', dataset_model_${id})`;
    model = model.replace(RegExp("\},", 'igm'), "\},\n\t\t")
    // Create file
    return new Promise( (resolve) => {
        fs.writeFile(file, model, 'utf-8', (err) => {
            if(err)
                throw err
            resolve(true)
        });  
    })
}
exports.generateDataProfileModel =  generateDataProfileModel;