
'use strict'
/****************Class product*********/
let client = require('../../../config/lib/elasticsearch')
class Product{
	/**
	 * Constructor
	 * @param {string | null} id ID of product from database
	 * @param {object} product object containing product properties
	 */
	constructor(id, product){
		if(id){
			this.id = id
		}else if(product){
			this.name         = product.name || ""				//String
			this.user_id      = product.user_id   				//String
			this.business_id  = product.business_id || ""		//String
			this.description  = product.description || ""		//String
			this.date_created = Date.now()	    //Number
			this.last_updated = product.last_updated || Date.now()	    //Number
			this.price        = product.price || ""				//Number
			this.color        = product.color || "" 				//String
			this.brand        = product.brand || "" 
			this.category 	  = product.category || null
			this.promoted     = product.promoted || false	
			this.choice_product = product.choice_product || false	
			this.reports	  = product.reports || 0
			this.images        = product.images || []
			this.likes		  = product.likes || 0					//boolean
			this.available    = product.available || true 
			this.online_store = product.online_store || ""
			this.location             = {
				lat: product.location ? product.location.lat : 3.84803,
				lon: product.location ? product.location.lon : 11.50208
			  }		    //Boolean
		}
	}
	/**
	 * Create Product
	 * @param {Function} callback 
	 */
	create(callback){	
	  let productDetails = JSON.parse(JSON.stringify(this))
	  let fieldsToPoolSuggestions = ['name', 'description', 'brand', 'category']
	  let suggestions = []
	  //array to store suggestions
	  for(let prop in productDetails){
			if(productDetails.hasOwnProperty(prop)){
				if(fieldsToPoolSuggestions.indexOf(prop) != -1){
					// if property not set continue
					if (!productDetails[prop])
						continue
					if(prop == 'category'){
						suggestions.push({ input: productDetails[prop].text})
					}else{
						suggestions.push({
							input: productDetails[prop]
						})
					}
				}
			}
	  } 
	  productDetails.suggest = suggestions
	  let that = this
      client.index({
      	'index' : 'product',
		'type'  : '_doc',
      	'body'  :  productDetails
      },function(error,data){
        if(error){
        	console.log('Could not create product: ', error)
        	callback({'status' : 'error','message' : 'Sorry an error coccured registering business. Please try again'})
        }else{
        	that.getProductByID(data._id, callback)
        }
      })
	}//create a product end
	//brid product id
	getProductByID(product_id,callback){
		client.get({
			'index' : 'product',
			'type'  : '_doc',
			'id' : product_id
		},function(error,data){
			if(error){
				console.log('Could not retrieve product ' + product_id + ' details')
				callback({'status':'error',
						  'message' : 'An error occured processing your request.Please try later.'})				
			}else{
				data._source['pid'] = product_id
				callback(null, data._source)
			}
		})
	}
	allProducts(bid,callback){
		client.search({
			'index' : 'product',
			'body' : {
				query: {
					bool:{
						filter: {
							term:{
								business_id: bid
							}
						}
					}
				}
			}
			},function(error,response){
                if(error){
                	console.log('Could not retrieve list of business ', error)
                	callback({ 'status' : 'error', 'message': 'Sorry an error occure.Please try again.'})
                }else{
                	let results = response.hits.hits
                	callback(null,results)
                }
			})
	}
	delete(pid,callback){
		client.delete({
			'index' : 'product',
			'type'  : '_doc',
			'id' : pid
		},function(error,response){
			if(error){
				callback({'status':'error','message':'Sorry an error occured.Please try again'})
			}else{
				callback(null, 'success')
			}
		})
	}
	update(pid, callback){
		let productDetails = JSON.parse(JSON.stringify(this))
		let fieldsToPoolSuggestions = ['name', 'description', 'brand', 'category']
		let suggestions = []
		//array to store suggestions
		for (let prop in productDetails) {
			if (productDetails.hasOwnProperty(prop)) {
				if (fieldsToPoolSuggestions.indexOf(prop) != -1) {
					// if property not set continue
					if (!productDetails[prop])
						continue
					if (prop == 'category') {
						suggestions.push({ input: productDetails[prop].text })
					} else {
						suggestions.push({
							input: productDetails[prop]
						})
					}
				}
			}
		}
		productDetails.suggest = suggestions
		client.update({
			'index' : 'product',
			'type'  : '_doc',
			'id' : pid,
			'body' : { 
				'doc' : productDetails
			}
		},function(error,response){
			if(error){
				callback({'status': 'error' ,'message': 'Sorry an error occured. Please try again.'})
			}else{
				callback(null, response)
			}
		})
	}
	getBusiness(business_id, callback){
		client.search({
			index: "business",
			body: {
				"query": {
							"ids" : {
								"type": "_doc",
								"values" : [business_id]
							}
				}
			}
		}, (error, results) => {
			 if(error){
				callback({"status": "error", "message": error})
			 }else{
				if(results.hits.total){
					//given that a product can only have one parent
					callback(results.hits.hits[0])
				}else{
					//no results found for product
					callback({"status": "error", "message": "No match found"})
				}
				
			 }
		})
	}
	
	
}
module.exports = Product