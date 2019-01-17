'use strict';
/******Create an elastic seach client************/
var Service = require('../classes/service.class');
var util = require('../../utils/util');
module.exports = {
	add(req, res) {
		if (req.body) {
			let bid = req.params.bid;//brid branch id
			let service = new Service();
			let {name, lat, lon,description, desclocation } = req.body;
			let created = new Date().getTime(), deleted = false, last_updated = new Date().getTime();
			let mobile = "no", status="open", scategory="none";
			let serviceDetails = {name, lat, lon,description, desclocation,bid, mobile, status, scategory, created, deleted, last_updated}

			util.location.getAddress(serviceDetails).then(() => {
				service.create(serviceDetails,(err, data) => {
					if (err) {
						res.json(err);
					} else {
						let serviceDetails = data._source;
						//add service id to result
						serviceDetails['sid'] = data._id;
						console.log(serviceDetails);
						delete serviceDetails.deleted;
						delete serviceDetails.suspended;
						res.json({ status: "success", data: [serviceDetails] });
					}
				});
			});

		}
	},//retrieve a particular service
	get(req, res) {
		if (req.params.pid) {
			let service = new service();
			let pid = req.params.pid;
			service.getserviceByID(pid, function (data) {
				//if there was an error
				if (data.status) {
					res.json(data);
				} else {
					let serviceDetails = data._source;
					//remove rela
					console.log(data);
					//add service id to result
					serviceDetails['pid'] = data._id;
					delete serviceDetails.deleted;
					delete serviceDetails.suspended;
					res.json(serviceDetails);
				}
			});
		}

	},
	list(req, res) {
		if (req.params.brid) {
			let service = new service();
			let brid = req.params.brid;
			service.allservices(brid, function (data) {
				data.forEach(function (service) {
					service._source['pid'] = service._id;
					delete service._source.deleted;
				});
				console.log(data);
				res.json(data);
			});
		} else {
			console.log('Could not get all service of User ' + req.params.uid);
			res.json('Sorry an error occured. Please try again');
		}
	},
	delete(req, res) {
		if (req.params.pid) {
			let service = new service();
			let pid = req.params.pid;
			service.delete(pid, function (data) {
				if (data.status) {
					console.log('Could not delete service with id ', bid);
					res.json(data);
				} else {
					res.end('success');
				}
			});
		} else {
			res.json({ 'status': 'error', 'message': 'Sorry an error occured.Please try again' });
		}
	},
	update(req, res) {
		if (req.body) {
			//update 
			let brid = req.params.brid;
			let pid = req.params.pid;
			let service = new service();
			let serviceDetails = {};
			serviceDetails.name = req.body.name;
			serviceDetails.brid = brid;
			serviceDetails.description = req.body.description;
			serviceDetails.price = req.body.price;
			serviceDetails.choice_service = req.body.choice_service;
			serviceDetails.available = req.body.available;
			serviceDetails.price_type = req.body.price_type;
			serviceDetails.currency = req.body.currency;
			//check if its a choice service
			if (req.body.choice_service === true) {
				serviceDetails.image_name = req.body.image_name;
				serviceDetails.website = req.body.website;
			}
			service.update(pid, serviceDetails, function (data) {
				if (data.status) {
					console.log('Could not update service doc with id ', bid);
					res.json(data);
				} else {
					res.json(data);
				}
			});
		}
	},
	contact(req, res){
		let item = req.body;
		let service = new Service();
		service.contact(item, (err, data) => {
			if(err){
				res.json({"status": "error", "message": err});
			}else {
				res.json({"status": "success", "data": data});
			}
		});
	 }
	

}