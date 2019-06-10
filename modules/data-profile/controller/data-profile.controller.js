/**
 * @file authentication controller file
 */
const config = require('../../../core/env/default'),
     DataProfile= require('../models/data-profile.class'),
     dprofile = require('../../../core/utils/generate-profile')
module.exports = {
    /**
     * @method get get information about a dataprofile to
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async get(req, res){
        //TODO: Should return all information about data profile
      
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
        // add access control to path
        let user = "507f191e810c19729de860ea"; // req.user.id
        if(req.body.name && req.body.description){
            const dataprofile = new DataProfile({
                name:req.body.name,
                description: req.body.description,
                category: req.body.category,
                contributors: req.body.contributors,
                fields: req.body.fields,
                user: user
            });
            dataprofile.save( async function(err, data){
                if(err){
                    return res.status(500).json({error: err})
                }
                // create the model for the datasets
                const id = data.id
                const fields = data.fields
                try{
                    await dprofile.generateDataProfileModel(id, fields)

                }catch(e){
                    // delete created model and send 500 report
                    DataProfile.findByIdAndRemove(id);
                    res.status(500).status(e)
                }
                return res.send(data)
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
        let dpid = req.params.dataProfileId
        //search for the particular data profile Id
        DataProfileModel.findById(dpid).populate('user', ['_id', 'name']).execute(async (err, data) => {
            if(err)
                return res.status(500).send("Error: " + err.message)
            if(!data)
                return res.status(404).send("NotFound : Could not find resource with ID " + dpid)
            let fields =  await DataProfile.countFields(dpid)
            let summary = {
                "_id": dpid,
                "name": data.name,
                "description": data.description,
                "category": data.category,
                "contributors": data.contributors.length,
                "fields": fields,
                "author": data.user,
                "created": data.created
            }
            return res.json(summary)
            
        })

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

    /**
     * @method list get a collection of data profile
     * @param {object} req 
     * @param {object} res 
     * @returns {object} json object 
     */
    async list(req, res){
        const limit = req.query.limit || 50 // maximum number of collections to return per request
        const page = req.query.page || 0
        const offset = page*limit
        const own = req.query.own || false // if user is requesting their own created dataprofiles
        let search = {}
        const user = req.user ? req.user.id : null
        // search such that query param format is search=field1,value1;field2,value2;
        search = _parseSearch(req.query.search)
        // check if the user is requesting their created data profiles
        if(own && user)
            search = Object.assign(search, {user})
        DataProfile
            .find(search)
            .limit(parseInt(limit))
            .skip(parseInt(offset))
            .sort('-created')
            .populate('User', ['username', 'first_name', 'last_name', 'email'])
            .exec(function (err, profiles){
                if(err)
                    return res.status(500).send(err.message)
                return res.json(profiles)
            })
    }
}
/**
 * @function _parseSearch converts query param search string to object 
 * @param {string | null} string search string
 */
function _parseSearch(string){
    if(!string)
        return null
    const search_string = string
    const search_kv = search_string.split(';')
    let search_object = {}
    for(let kv of search_kv){
        let element = kv.split(',')
        // check if value is a boolean
        if(element[1].toLowerCase() == 'false' || element[1].toLocaleLowerCase == 'true'){
            search_object[element[0]] = element[1].toLowerCase() == 'true' ? true : false
            continue
        }
        // check if value is a number
        if(!isNaN(parseFloat(element[1]))){
            search_object[element[0]] = element[1]
            continue
        }
        search_object[element[0]] = RegExp(element[1], 'ig')
    }
    return search_object
}