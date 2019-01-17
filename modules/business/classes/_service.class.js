/****************Class _Product*********/
let client = require('../../../config/lib/elasticsearch');
/**
 * @class _Product
 */
class _Service {
    /**
     * @constructor initialises object
     * @param {Object} item 
     */
    constructor(item){
       this.business_id = item.business_id;
       this.service_id = item.product_id;
       this.provider = item.provider;
       this.service_client_name = item.client_name;
       this.service_client_phonenumber = item.client_phonenumber;
       this.service_client_address = item.client_address;
       this.service_client_details = item.details;
       this.service_client_other = item.addtionalText;
       
    }
    create(callback){
        //store buy request
        let details = JSON.parse(JSON.stringify(this));
		client.index({
		  'index' : 'tchizer',
		  'type'  : 'service_requests',
		  'body'  : details
		},function(error,data,status){
			if(error){
				callback(error);
			}else{
				callback(null, data);
			}
		});
	}
}
module.exports = _Service;