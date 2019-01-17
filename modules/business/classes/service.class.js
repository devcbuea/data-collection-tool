'use strict';
/****************Class product*********/
let client = require('../../../config/lib/elasticsearch');
let _Service = require('./_service.class');
/**
 * @class Service
 */
class Service {
	/**
	 * @constructor Constructor
	 * 
	 * @param {string | null} id ID of service
	 * @param {object} service object containing properties of service
	 */
	constructor(id, service) {
		if(id){
			this.id = id;
		}else if(service){
			this.sv_name = service.name;               //String
			this.sv_business_id = service.business_id; //businness id
			this.sv_description = service.description;	// description
			this.date_created= Date.now();			//Number
			this.deleted = false;					//Boolean
			this.suspended = false; 				//Boolean
		}
	}
	/**
	 * Create service
	 * @param {function} callback callback
	 */
	create(callback) {
		let serviceDetails = JSON.parse(JSON.stringify(this));
		console.log("the service details are ",serviceDetails);
		client.index({
			'index': 'tchizer',
			'type': 'service',
			'parent': serviceDetails.sv_business_id,
			'body': serviceDetails
		}, function (error, data, status) {
			if (error) {
				console.log('Could not create product');
				callback({ 'status': 'error', 'message': 'Sorry an error coccured registering business. Please try again' });
			} else {
				client.get({
					'index': 'tchizer',
					'type': 'service',
					'parent': serviceDetails.sv_business_id,
					'id': data._id
				}, function (error, data) {
					if (error) {
						console.log('Created business but could not retrieve info');
						callback({ 'status': 'error', 'message': 'Sorry an error occured. Please refresh' });
					} else {
						callback(data);
					}
				});

			}
		});
	}//create a product end
	//brid product id
	getServiceByID(sid, callback) {
		client.get({
			'index': 'tchizer',
			'type': 'service',
			'id': sid
		}, function (error, data, status) {
			if (error) {
				console.log('Could not retrieved service ' + sid + ' details');
				callback({
					'status': 'error',
					'msg': 'An error occured processing your request.Please try later.'
				});
			} else {
				callback(data);
			}
		});
	}
	allService(bid, callback) {
		client.search({
			'index': 'tchizer',
			'type': 'service',
			'q': 'bid:' + bid
		}, function (error, response, status) {
			if (error) {
				console.log('Could not retrieve list of business ');
				callback({ 'status': 'error', 'message': 'Sorry an error occure.Please try again.' });
			} else {
				let results = response.hits.hits;
				callback(results);
			}
		});
	}
	delete(pid, callback) {
		client.delete({
			'index': 'tchizer',
			'type': 'service',
			'id': sid
		}, function (error, response) {
			if (error) {
				callback({ 'status': 'error', 'message': 'Sorry an error occured.Please try again' });
			} else {
				callback('success');
			}
		});
	}
	update(sid, serviceDetails, callback) {
		client.update({
			'index': 'tchizer',
			'type': 'service',
			'id': sid,
			'body': {
				'doc': serviceDetails
			}
		}, function (error, response) {
			if (error) {
				callback({ 'status': 'error', 'message': 'Sorry an error occured. Please try again.' });
			} else {
				callback(response);
			}
		});
	}
	contact(serviceDetails, callback){
		//store buy request
		let contact = new _Service(serviceDetails);
         contact.create(callback);
	}

}
module.exports = Service;