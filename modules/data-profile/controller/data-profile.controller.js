/**
 * @file authentication controller file
 */
let DataProfile = require('../models/data-profile.class')
const config = require('../../../core/env/default')
module.exports = {
    /**
     * @method get get information about a dataprofile to
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async get(req, res){
        //TODO: Should return all information about data profile
       return res.send('This controller handler is to be implemented')
    }
    ,
    /** 
     * @method create create a data profile 
     * @async
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async create(req, res){
        
        return res.send('This controller handler is to be implemented')
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