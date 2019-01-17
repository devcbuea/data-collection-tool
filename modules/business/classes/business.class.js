/****************Class Business*********/
let client = require('../../../config/lib/elasticsearch')
/**
 * @class Business
 */
class Business {
	/**
	 * @constructor constructor
	 * 
	 * @param {string | null} id id of business from database
	 * @param {object} business object of business properties
	 */
	constructor(id, business){
		if(id){
			//return business with id
			this.id = id
		}else if(business){
			//initialise business
			this.name                 = business.name || ""					//string
			this.user_id    		     = business.user_id || ""				//string
			this.description 		 = business.description || ""			//string
			this.website              = business.website || ""				//string
			this.category             = business.category || null				//string
			this.address1              = business.address1 || ""
			this.po_box				  = business.po_box || ""							
			this.city 				  = business.city || ""							  
			this.region_state		  = business.region_state || ""
			this.country			  = business.country || ""
			this.views				  = business.views || 0
			this.likes				  = business.likes || 0
			this.reports			  = business.reports || 0
			this.location             = {
										  lat: business.location ? business.location.lat : 3.84803,
										  lon: business.location ? business.location.lon : 11.50208
										}
			this.location_description = business.location_description || ""  //string
			this.phonenumbers         = business.phonenumbers || []			//array
			this.opening_time         = business.opening_time || ""          //time
			this.closing_time         = business.closing_time  || ""			//time
			this.mobility             = business.mobility || "static"				//string "mobile" | "not"
			this.cover 				  = business.cover || "default_business_cover.jpg"
			this.setup				  = business.setup || false
			this.date_created         = Date.now()	
			this.activated            = false					//boolean
			this.deleted              = false							//boolean
			this.suspended            = false 							//boolean
		}
	}
	/**
	 * Create a business
	 * 
	 * @param {function} callback callback
	 */
	create(callback){
	    let businessDetails = JSON.parse(JSON.stringify(this))
		let fieldsToPoolSuggestions = ['name', 'description', 'brand', 'category']
		let suggestions = []
		//array to store suggestions
		for (let prop in businessDetails) {
			if (businessDetails.hasOwnProperty(prop)) {
				if (fieldsToPoolSuggestions.indexOf(prop) != -1) {
					// if property not set continue
					if (!businessDetails[prop])
						continue
					if (prop == 'category') {
						suggestions.push({ input: businessDetails[prop].text })
					} else {
						suggestions.push({
							input: businessDetails[prop]
						})
					}
				}
			}
		}
		businessDetails.suggest = suggestions
      client.index({
      	'index' : 'business',
		'type'  : '_doc',
      	'body'  : businessDetails,
      },function(error,data){
        if(error){
        	console.log('Could not create business', error)
        	callback({'status' : 'error','message' : 'Sorry an error coccured registering business. Please try again'})
        }else{
        	callback(null, data)
        }
      })
	}
	getBusinessByID(bid,callback){
		client.get({
			'index' : 'business',
			'type' : '_doc',
			'id' : bid
		},function(error,data,status){
			if(error){
				console.log('Could not retrieved business ' + bid + ' details: ', error)
				callback({'status':'error',
						  'msg' : 'An error occured processing your request.Please try later.'})				
			}else{
				callback(null, data)
			}
		})
	}
	allBusiness(uid,callback){
		client.search({
				'index': 'business',
			    'type': '_doc',
			    'q' :'user_id:'+uid
			},function(error,response,status){
                if(error){
                	console.log('Could not retrieve list of business ')
                	callback({ 'status' : 'error', 'message': 'Sorry an error occure.Please try again.'})
                }else{
                	let results = response.hits.hits
                	callback(null, results)
                }
			})
	}
	allProducts(bid, callback) {
		client.search({
			'index': 'product',
			'body': {
				query: {
					bool: {
						filter: {
							term: {
								business_id: bid
							}
						}
					}
				}
			}
		}, function (error, response) {
			if (error) {
				console.log('Could not retrieve list of business ', error)
				callback({ 'status': 'error', 'message': 'Sorry an error occure.Please try again.' })
			} else {
				let hits = response.hits.hits
				let results = []
				for(let hit of hits){
					hit._source['pid'] = hit._id
					results.push(hit._source)
				}
				callback(null, results)
			}
		})
	}
	delete(bid,callback){
		client.delete({
			'index' : 'business',
			'type' : '_doc',
			'id' : bid
		},function(error,response){
			if(error){
				callback({'status':'error','message':'Sorry an error occured.Please try again'})
			}else{
				callback('success')
			}
		})
	}
	update(bid, section, callback){
		let that = this
		this.getBusinessByID(bid, (err, data) => {
			if(err){
			  return callback(err)
			}
			let business = data._source
			switch(section){
				case 'basic':
					business.name = that.name
					business.category = that.category
					business.description = that.description
					break
				case 'address':
					business.address1 = that.address1
					business.po_box = that.po_box
					business.city = that.city
					business.region_state = that.region_state
					business.country = that.country
					break
				case 'ldescription':
					business.location_description = that.location_description
					business.location = that.location || null
					break
				default:
					
			} 
			client.update({
				'index' : 'business',
				'type' : '_doc',
				'id' : bid,
				'body' : { 
					'doc': business
				}
			},function(error,response){
				if(error){
					console.log(error)
					callback({'status': 'error' ,'message': 'Sorry an error occured. Please try again.'})
				}else{
				
					that.getBusinessByID(response._id, (err, data) =>{
						let business = data._source
						business.bid = data._id
						console.log(business)
						callback(null, business)
					})
				}
					
			})
		})	
	}
}
module.exports = Business