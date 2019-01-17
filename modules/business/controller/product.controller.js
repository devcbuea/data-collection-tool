
'use strict'
/******Create an elastic seach client************/
var Product = require('../classes/product.class')
var _Product = require('../classes/_product.class')
var mongoose = require('mongoose')
var MediaModel  = mongoose.model('MediaSchema')

var Business = require('../classes/business.class')
var Notification = require('../../notification/classes/notification.class')
module.exports = {
    add(req,res){
		req.body.user_id = req.params.uid || req.user.id
		let product = new Product(null, req.body)
		//check if the user is owner of the business before creating the business
    	product.create(function(err, data){
    		if(err){
				res.status(500)
    			return res.send('An error Occured') 
    		}
    		let productDetails = data
	    	//add product id to result
	    	delete productDetails.deleted
	    	delete productDetails.suspended
			res.json(productDetails)
			// check if product has images
			if(productDetails.images){
				productDetails.images.forEach((image_id) => {
					MediaModel.findById(image_id, (err, img) => {
						if(err){
							console.log(err)
							return
						}
						img.user = productDetails.user_id
						img.otype = 'product'
						img.ftype = 'images'
						img.used = true
						img.oid = productDetails.pid
						img.save() 
					})
				})
			}
    	})
    	
    },//retrieve a particular product
    get(req,res){
    	if(req.params.pid){
    		let product = new Product()
			let product_id = req.params.pid
			let business_id = req.params.bid
       	    product.getProductByID(product_id,function(err, data){
       	    	//if there was an error
       	    	if(err){
       	    		res.json(err)
       	    	}else{
       	    		let productDetails = data
	    			//add product id to result
	    			productDetails['pid'] = product_id
	    			delete productDetails.deleted
					delete productDetails.suspended
					//get business details
					product.getBusiness(business_id, (data) => {
						let business = null
						if(!data.status){
							business = data._source
						}
						console.log(data)
						res.json({"status": "success", "data":[{ "business": business, "product": productDetails}]})
					})	
				}
			})
		}
	},
    list(req,res){
    	if(req.params.bid){
    		let product = new Product()
    		let bid = req.params.bid
    		product.allProducts(bid,function(err,data){
				if(err)
					return res.json(err)
					//data = data.slice(0, 9)
				let count = data ? data.length : 0
    			let products = data.map(function(product){
    				product._source['pid'] = product._id
					delete product._source.deleted
					return product._source
				})
				
    			res.json({"status":"success", "data": products, "count": count})
    		})
    	} else{
		   console.log('Could not get all product of User '+ req.params.uid)
           res.json({status: "error", message:'Sorry an error occured. Please try again'})
    	}
    },
    delete(req,res){
     	if(req.params.pid){
			let pid = req.params.pid
			let uid = req.user.id
     		let product = new Product()
			product.getProductByID(pid, (err, _product) => {
				if(err){
					res.status(500)
					console.log(err)
					return res.json('An error occured')
				}
				console.log("the product data ", _product)
				console.log("P_UID: " + _product.user_id + " UID: " + uid)
				if (_product.user_id == uid){
					product.delete(pid, function (err, success) {
						if (err) {
							console.log('Could not delete product: ', err)
							res.status(500)
							return res.json({ "message": "An error Occured" })
						} else {
							return res.send('success')
						}
					})
				}else{
					res.status(403)
					return res.json('An error occured')
				}
				
					 
			}) 
     	   
     	}else{
     		res.json({'status':'error','message':'Sorry an error occured.Please try again'})
     	}
    },
    update(req,res){
     	if(req.body){
     		//update 
            let pid = req.params.pid
     		let product = new Product(null, req.body.product)
			product.update(pid, function(err, data){
				if(err){
					console.log('Could not update product doc with id ', pid)
					res.status(400)
					return res.json(err)
				}else{
				
					let deletedImages = req.body.deletedImages ? req.body.deletedImages : []
					deletedImages.forEach(element => {
						MediaModel.findById(element, (err, media) => {
							if(err){
								console.log(err)
							}
							if(media){
								media.used = false
								media.save((err, data)=> {
									if(err)
										console.log(err)
									console.log("Successfully deleted images")
								})
							}
						})
					})
					// update new media
					if (product.images) {
						product.images.forEach((image_id) => {
							MediaModel.findById(image_id, (err, img) => {
								if (err){
									console.log(err)
									return
								}
								img.user = req.params.user || req.user.id
								img.otype = 'product'
								img.ftype = 'images'
								img.used = true
								img.oid = pid
								console.log(img.oid)
								img.save()
							})
						})
					}
					return res.json(data)
				}
			})
     	}else {
			 res.status(400)
			 return res.json({"status": "error", "data": "Make sure all required fields are filled."})
		}
	 },
	 buyBot(req, res){
		let item = req.body
		let _product = new _Product(item)
		_product.buyBot((err, data) => {
			if(err){
				res.json({"status": "error", "message": err})
			}else {
				res.json({"status": "success", "data": data})
				//continue processing request by contacting me and buy
				console.log(data)
				let business = new Business()
				/* 	let notification = new Notification()
				//get the business with child parent
				*/
				business.getBusinessByID(item.business_id, (response) => {
					if(response.status === "error"){
						console.log("An error occurred")
						console.log(response)
					}else{
						// send SMS to both parties
						console.log("Messages successfully sent.")
						console.log(response)
					}
				})
				/*
				notification.sendSMS(to, message, (response) => {
					console.log("[Message sent to Seller]", response)
				})
				notification.sendSMS("678431904", message, (response) => {
					console.log("[Message sent to Operator]", response)
				}) */
			}
		})
	 },
	addImages(req, res, next){
		let media = new MediaModel(req.files[0])
		media.user = req.user.id
		media.otype = 'product'
		media.oid = req.params.oid
		media.save((err, file) => {
		  if (err) {
			res.json({ "status": "error", "message": "COuld not upload picture" })
		  } else {
			res.json({ "status": "success", data: [file], "success":true })
		  }
		})
	}
	 
}