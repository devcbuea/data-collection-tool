/**
 * @file authentication controller file
 */
let DataProfileModel = require('../models/data-profile.model');
const config = require('../../../core/env/default');
module.exports = {
    /**
     * @method get get information about a dataprofile to
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async get(req, res){
        //TODO: Should return all information about data profile
       return res.send("This controller handler is to be implemented");    
    },
    /** 
     * @method create create a data profile 
     * @async
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async create(req, res){
        if(req.body.name && req.body.description){
            const dataprofile = new DataProfileModel({
                name:req.body.name,
                description: req.body.description,
                category: req.body.category,
                contributors: req.body.contributors,
                fields: req.body.fields
            });
            dataprofile.save(function(err){
                if(err){
                    return res.status(500).json({error: err})
                }return res.send("dataprofile successfully created")
            })
        }else{
            return res.send("Failed !!! \n reason: name or description missing")
        }
        // return res.send('This controller handler is to be implemented')
    },
    /** 
     * @method getSummary get summary information about a data profile 
     * @async
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async getSummary(req, res){
        
        return res.send('This controller handler is to be implemented')
    },
    /**
     * @method update update information about a dataprofile
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async update(req, res){
        //TODO: Should return all information about data profile
       return res.send('This controller handler is to be implemented')
    },
    /**
     * @method updateDataCollectionFields update information about data collection fields
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async updateDataCollectionFields(req, res){
        //TODO: Should return all information about data profile
       return res.send('This controller handler is to be implemented')
    },
      /**
     * @method delete delete information about data collection
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async delete(req, res){
        //TODO: Should return all information about data profile
       return res.send('This controller handler is to be implemented')
    },
}