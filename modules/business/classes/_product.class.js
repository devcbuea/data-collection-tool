/****************Class _Product*********/
let client = require('../../../config/lib/elasticsearch');
/**
 * @class _Product
 */
class _Product {
    /**
     * @constructor initialises object
     * @param {Object} item 
     */
    constructor(item){
       this.business_id = item.business_id;
       this.product_id = item.product_id;
       this.client_name = item.client_name;
       this.client_email = item.client_email;
       this.client_phonenumber = item.client_phonenumber;
       this.client_address = {
           "address": item.address,
           "city": item.city,
           "country": item.country || "Cameroun"
       };
       this.client_number_items = item.client_number_items || 1;
    }
    buyBot(callback){
        //store buy request
        let details = JSON.parse(JSON.stringify(this));
		client.index({
		  'index' : 'tchizer',
		  'type'  : 'product_requests',
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
module.exports = _Product;