const mongoose = require('mongoose'),
     DataProfileModel = mongoose.model('Data-Profile'),
     chalk = require('chalk'),
     log = console.log 

/** 
 * @classdesc Data profile class, manage the data profile module with db
 * 
*/
class DataProfile extends DataProfileModel{
    constructor(profile){
        super(profile)
    }
    
    /**
     * @static
     * @method countFields count the number of fields for a data profile
     * @param {String} id id of data profile
     * @returns {Promise} promise that resolves to number of fields for a  data profile
     */
    static countFields(id){
        return new Promise((resolve) => {
            DataProfile.count({_id: id}, (err, count) => {
                if(err){
                    log(chalk.red(err.message))
                    return resolve(null)
                }
                return resolve(count)
            })
        })
    }


}
module.exports = DataProfile;