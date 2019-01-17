'use strict'
/******Create an elastic seach client************/

const client = require('../../../config/lib/elasticsearch'),
	 config = require('../../../config/env/default'),
	 mongoose = require('mongoose'),
	 UserModel  = mongoose.model('UserSchema'),
	 TokenModel = mongoose.model('TokenSchema'),
	 Util  = require('../../utils/util'),
	 request = require('request'),
	 md5 = require('md5')

class User {
	constructor(id, userDetails){
		//initialise user fields
	    if(id){
			this.id  		   = id
		} else if(userDetails){
			this.first_name    = userDetails.first_name || ""
			this.last_name     = userDetails.last_name || ""
			this.username      = userDetails.username || ""
			this.email         = userDetails.email || ""
			this.password      = userDetails.password || ""
			this.phonenumber   = userDetails.phonenumber || ""
			this.clientToken   = userDetails.clientToken || ""
			this.permission    = userDetails.permission || "user"
			this.signed_in     = null
			this.last_seen     = null
		}
			
	}
	save(callback){
		//if undefined we create a new user ,else we update existing user
		if(this.id){
           return false
		}else{
			//check there is no existing user with the same email
			this.signed_in =  new Date().getTime()
			this.last_seen =  new Date().getTime()
			let that = this
			UserModel.count({$or: [{"username": this.username},{"email": this.email}]}, function(err, count){
				if(count === 0){
					let user_model = new UserModel(that)
					user_model.save((err, user) => {
						if(!err){		
							// save verify token
							console.log(user)
							let token = new TokenModel({
								"user": user.id,
								"token": require('crypto').randomBytes(32).toString('hex'),
								"purpose": "verify",
							})
							token.save((err, _token) => {
								if(!err){
									callback(null, user)
									// mail user
									let message = `Hello ${user.first_name}, .
											 <br /> <p>Thanks for signing up to Tchizer, the best african product search platform.
											  To fully make use of our platform, we need you to verify your email by following the link </p><br />
											  <a href='${config.client.url}/confirm/?token=${_token.token}'
											 target="_blank">${config.client.url}/confirm/?token=${_token.token}
											 </a>`
									Util.sendMail(null, user.email, config.email.subjects.verifyAccount, message) 
								}else{
									// delete created user //#endregion
									UserModel.remove({id: user.id})
									callback({ "status": "error", "message": "An error occurred" })
								}
							})
						}else{					
							console.log(err)
							callback({"status": "error", "message": "An error occurred"})
						}
					})
				}else {
					console.log(err)
					callback({
						'status' : 'error',
						'message' : 'Username or email already taken.',
					})
				}
			})
		}
	}
	register(callback){
		this.save(callback)
	}
	login(email ,password ,cb){
		//search if there is any match
	   UserModel.authenticate(email, password, (err, user) => {
			if(err){
				console.log(err)
				cb({"status": "error", "message": "Wrong password or email"})
			}else{
				// check if user has been validated or not
				if(user.email_verified){
					cb(null, user)
				} else cb({"status": "error", "message": "Please verify your email. Check your email for the verification code"})

			}
	   })
				
	}
	getUserByID(id, callback){
		UserModel.findById(id, (err, user) => {
			if(err)
				return callback({"status": "error", "message": err.message})
			callback(null, user)
		})
	}
	createValidationCode(phonenumber , callback){
		let validationCode = Math.floor( Math.random () * (87849 + 1)) + 12151
		// hash validationCode
		let hash = md5(validationCode + phonenumber + 'I am salty')
		 
		 //save
		client.index({
					  	'index': 'tchizer',
					  	'type': 'validationHashes',
					  	'body': { 'hash': hash , 'code': validationCode}
					},function(err,response, status){
							if(err){
								console.log(err)
								callback({
								 		'status' : 'error',
										'message' : 'Could not save hash' 
									})
								}else{

								//console.log(response)

								// sms validation code
								config.nexmo.to = phonenumber
								config.nexmo.text = validationCode
								let dataString = JSON.stringify(config.nexmo)
								request({
									method: 'POST',
									url: 'https://rest.nexmo.com/sms/json',
									body: dataString,
									headers: {
									'Content-Type': 'application/json',
									'Content-Length':Buffer.byteLength(dataString)
									},
									json: false
								
								}, function(err ,response ,body){
									if(err){
										console.log("An error occured ",err)
									}else {
										console.log(body)
									}
									
									callback({'status': 'success', 'data': "Code sent"})
								})		
							}
					})

	}
	checkValidationCode(code, phonenumber, callback){
         let hash = md5(code + phonenumber + 'I am salty')
		 	client.search({
				'index': 'tchizer',
			    'type': 'validationHashes',
			    'body': {
	    				'query': {
	      					'constant_score': {
	      						'filter' : { 
	      							'term': {
	      								'hash': hash
	      							}
	      						}
	      					 }
	    		       }		
	    	   }
			},function(err, response ,status){
				if(err){
					console.log("Error searching hash information")
					callback(false)
				}else{
					if(response.hits.hits.length > 0){
					//	console.log(response.hits.hits)
						callback(true)
					}else {
						console.log("No match found for validation code")
						callback(false)
					}
				}
			})

	}
	static exists(search){
		return new Promise((resolve) => {
			UserModel.findOne(search, function (err, user) {
				if(err)
					return resolve(false)
				if(user) {
					return resolve(user)
				}else{
					return resolve(false)
				}
			})
		})
	}
	static email(obj){
		console.log(obj)
	}
	static requestToken(type, user){
		let token = require('crypto').randomBytes(32).toString('hex')
		let email = user.email
		let user_id = user.id
		return new Promise((resolve) => {
			switch (type) {
				case 'reset':
					let resetToken = TokenModel(
						{
							"token": token,
							"purpose": "reset",
							"user": user_id
						}
					)
					resetToken.save((err, _token) => {
						if(!err){
							let message = `Hey there, you requested a password reset.
											 <br /> Here is your password reset link 
											 <a href='${config.client.url}/reset/?token=${_token.token}'
											 target="_blank">${config.client.url}/reset/?token=${_token.token}
											 </a>`
							Util.sendMail(null, email,config.email.subjects.resetPassword,message) 
							resolve(true)	
						}
					})
					break
				default: //#endregion
					resolve(false)
			}
		})
	}
	static resetPassword(token, password){
		return new Promise((resolve) => {
			TokenModel.findOne({token: token, purpose: 'reset' }).sort('-created').exec((err, token) => {
				if(err){
					console.log(err)
					return resolve("An error occurred.")
				}else{
					// check if reset token is still active, token valid for 5 hours
					let currentTime = Date.now()
					let tokenTime = new Date(token.created).getTime()
					let difference = currentTime - tokenTime
					let hourMilliseconds = 3600000
					if ((difference / hourMilliseconds) <= 5){
						// get user
						UserModel.findById(token.user, (err, user) => {
							if(err){
								console.log(err)
								return resolve("An error occurred.")
							}
							user.password = password
							user.save((err, saved) =>{
								if(saved)
									return resolve('success')
								console.log(err)
								return resolve("An error occurred.")
							})
						})
					}else {
						return resolve("Token has expired.")
					}
				}
				
			})
		})
	}
	static verifyAccount(token){
		return new Promise( resolve => {
			TokenModel.findOne({token: token, purpose: 'verify'}, (err, _token) => {
				if(err){
					console.log(err)
					return resolve('An error occurred')
				}
				let user = _token.user
				UserModel.findById(user, (err, user) => {
					if(err){
						console.log(err)
						return resolve("An error occurred.")
					}
					user.email_verified = true
					user.save( (err, data) => {
						if(err){
							console.log(err)
							return resolve('An error occurred.')
						}
						resolve('success')
					})

				}) 
			})
		})
	}
}

module.exports = User