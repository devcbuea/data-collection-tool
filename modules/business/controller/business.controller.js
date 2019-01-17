'use strict'
const mongoose = require('mongoose'),
	  UserModel = mongoose.model('UserSchema'),
	  Util = require('../../utils/util'),
	  config = require('../../../config/env/default'),
      Business = require('../classes/business.class')

module.exports = {
    add(req,res){
    	if(req.body){
			let user = req.user
			let user_id = req.params.uid ? req.params.uid : user.id	
			req.body.user_id = user_id
			//check if user account can create business
			UserModel.findById(user_id, (err, client) =>{
				if(err){
					res.status(500)
					console.log(err)
					return res.json({"status": "error", "message": "An error occured."})
				}else{
					if(client && !client.banned && !client.deleted){
							let business = new Business(null, req.body)
							business.create(function (err, biz) {
								if (err) {
									res.status(500)
									console.log(err)
									return res.json(err)
									
								} else {
									// update user information with business

									res.json({status: "success", data: biz._id})
									//update user
									client.business_active = true
									client.save((err, data) => {
										if(!err){
											let message = `Hello ${client.first_name}, .
											 <br /> <p>We have received your request to creat a business on Tchizer. 
											 It takes a maximum of 2 business days to process a request.
											 We will notify you when that is done.
											  You might as well check in anytime ,it sometimes happenS emails do not get delivered Thanks for understanding.
											 </p><br /><br /><br /><br />
											 Best Regards,<br />
											 Tchizer CM
											 `
											Util.sendMail(null, client.email, config.email.subjects.applyBusiness, message)
										}
									})
								}
							})
					}else {
							res.status(403)
							console.log(err)
							return res.json({ "status": "error", "message": "You need to apply in order to create a business.", "show": true })
					}
					
				}
				
			})
			
    	}
    },//retrieve a particular business
    get(req,res){
    	if(req.params.bid){
    		let business = new Business()
    		let bid = req.params.bid
       	    business.getBusinessByID(bid,function(err, data){
       	    	//if there was an error
       	    	if(err){
					res.status(500)
       	    		res.json(err)
       	    	}else{
       	    		let businessDetails = data._source
       	    		//remove rela
	    			//add business id to result
	    			businessDetails['bid'] = data._id
	    			delete businessDetails.deleted
					delete businessDetails.suspended
					// get products
					business.allProducts(bid, (err, products) => {
						if(err){
							res.status(500)
							return res.json(err)
						}
						res.json({business: businessDetails, products: products})					
					})	
       	    	}
       	    })
    	}else {
			res.json({"status": "success", "data": []})
		}
	},
	verify(req, res){
		let user = req.user
		let user_id = req.params.uid ? req.params.uid : user.id
		//check if user account can create business
		UserModel.findById(user_id, (err, client) => {
			if (err) {
				res.status(500)
				return res.json({ "status": "error", "message": "An error occured." })
			} else {
				if (client && !client.banned && !client.deleted) {
					res.status(200)
					return res.json({ "status": "success", "data": { "activated": client.activated, "business": client.business_active}})
				}
				return res.json({ "status": "error", "message": "An error occured." })
			}
		})
	},
    list(req,res){
    	if(req.user.id ||req.params.uid ){
    		let business = new Business()
    		let uid = req.params.uid || req.user.id
    		business.allBusiness(uid,function(err, data){
				if(err)
				  return res.json(err)
    		   let businesses =	data.map(function(business){
    				business._source['bid'] = business._id
	    			delete business._source.deleted
					delete business._source.suspended
					return business._source
    			})
    			res.json({status:"success", "data":businesses})
    		})
    	}else{
           console.log('Could not get all business of User '+ ( req.params.uid || req.user.id))
           res.json({status:"error", message:'Sorry an error occured. Please try again'})
    	}
    },
     delete(req,res){
     	if(req.params.bid){
     		let business = new Business()
     		let bid = req.params.bid
     	    business.delete(bid,function(data){
     	    	if(data.status){
     	    		console.log('Could not delete business with id ',bid)
     	    		res.json(data)
     	    	}else{
     	    		res.end('success')
     	    	}
     	    })
     	}else{
     		res.json({'status':'error','message':'Sorry an error occured.Please try again'})
     	}
     },
     update(req,res){
		 //check if data is being updated by admin or not
		 try{
			if(req.params.uid && (req.user.permission === 'admin')){

			}else{
			   let uid = req.params.uid
			   let bid = req.params.bid
			   let section = req.body.type
			   delete req.body.type
			   let business = new Business(null, req.body)
			   business.update(bid, section, function(err, data){
				   if(err){
					   console.log(err)
					   res.json(err)
				   }else{
					   res.json({"status": "success", "data": [data]})
				   }
			   })
			}
		 }catch(e){
			res.status(500)
			console.log("An error occured: ", e)
			return res.send("An error occured")
		 }
		
	 },
	 message(req, res){
		// return test
		console.log(req.body)
		res.json({"status": "success"})
	 }

}