'use strict'
/******Create an elastic seach client************/

const User = require('../classes/user.class')
const	md5 =  require('md5')
const config = require('../../../config/env/default')
const jwt = require('jsonwebtoken')
const SALT = process.env.SALT || "this a test salt"
const SECRET = process.env.SECRET || "ilovetechthanyoudo"
const validator = require('validator')
let validationError = {}
const validationMessage = {
	"first_name": "Minimum lenght is 2",
	"last_name": "Minimum lenght is 2",
	"username": "Minimum lenght is 5",
	"email": "Email is not valid",
	"password": "Minimum length is 10",
	"terms": "You need to agree on the terms and conditions",
	"phonenumber": "Phone number not valid"
}


module.exports = {
	register(req,res){
			//get user values
		let user =  new User()
		let validationObject = {
			first_name: validator.isLength(req.body.first_name, { min: 2 }),
			last_name: validator.isLength(req.body.last_name, { min: 2 }),
			username: validator.isLength(req.body.username, { min: 5 }),
			email: validator.isEmail(req.body.email),
			password: validator.isLength(req.body.password, { min: 10 }),
			terms: req.body.terms,
			phonenumber: validator.isLength(req.body.phonenumber, { min: 8 }),
		}
		//check if user data object exists
		let valid = true
		for(let prop in validationObject){
			if(validationObject.hasOwnProperty(prop)){
				if(!validationObject[prop]){
					valid = false
					validationError[prop] = validationMessage[prop]
				}
			}
		}		
		if(valid){
			//create a new object 
			user.first_name = req.body.first_name
			user.last_name = req.body.last_name
			user.username = req.body.username
			user.email = req.body.email
			user.password = req.body.password
			user.phonenumber = req.body.phonenumber
			let validationCode = req.body.code || ""
			user.clientToken = md5(SALT + user.password + validationCode)
		    user.register((error, data) => {
				if(error){
					res.status(500)
					res.send(error.message)
				}else {
					res.status(200)
					return res.end()
				}
			})
		}else{
			res.status(400)
			res.json(validationError)
		}	 
	},
	login(req, res){
		let user = new User()
        //get user password and email
        if (validator.isEmail(req.body.email) && validator.isLength(req.body.password, { min: 10 })){
        	let password = req.body.password
        	let email = req.body.email.toLowerCase() //TODO : validate email field
        	user.login(email ,password, function(err, data){
				if(err){
					res.status(400)
					console.log(err)
					return res.send(err.message)
				}else{					
					let token = jwt.sign({
						id: data.id,
						email: data.email,
						hash: data.clientToken,
						permission: data.permission,
						"username": data.username,
						"first_name": data.first_name,
						"last_name": data.last_name,
						"phonenumber": data.phonenumber,
						"photo": data.photo,
						"banned": data.banned,
						"deleted": data.deleted,
					  },
					  SECRET,
					   {
						issuer: "tchizercm",
						expiresIn: "14d"
					  })
					let user = {
						"username": data.username,
						"email": data.email,
						"first_name": data.first_name,
						"last_name": data.last_name,
						"phonenumber": data.phonenumber,
						"client_token": token,
						"photo": data.photo,
						"banned": data.banned,
						"deleted": data.deleted,
						"permission": data.permission
					}
					res.json(user)
				}
			})
        }else {
			res.status(401)
			return res.send("Email or password is not valid")
		}
	},
    profile(req,res){
    	let user = new User()
    	let id = req.params.id
    	if(id){
    		user.getUserByID(id,res,function(data){
    			res.json(data)
    		})
    	}    	
    },
	getValidationCode(req, res){
		let phonenumber = req.params.phoneNumber
		if(phonenumber !== '' && phonenumber.length > 8){
			// generate code from unix timestamp and random numbers
			let user =  new User()
			user.createValidationCode(phonenumber ,function(response){
				// console.log(response)
				res.json(response)
			})
		}else {
			res.json({'status': 'error' , 'message': 'Invalid number' })
		}
	
	},
    checkValidationCode(req , res){
	   let phonenumber = req.body.phonenumber
	   let code = req.body.code
	   if(phonenumber !== '' && code !== '' && Number.isInteger(parseInt(code))){
			let user = new User()
			user.checkValidationCode(code, phonenumber, function(codeValid){
				if(codeValid){
					res.json({'status': 'success' , 'data': true })
				}else {
					console.log("COuld not validate code")
					res.json({'status': 'error' , 'data': 'Error occured' })
				}
			})
	   }else {
		   res.json({'status': 'error' , 'message': 'Error occured' })
	   }
	   },
	update(req, res){
		//get the type of the update
		let uid = req.user.id
		let type = req.body.type
		let user = new User()
		if(!type)
			return res.json({"status": "error", "message" : "Type lacking."})
		switch(type){
			case "basic":
				if (req.body.first_name.length < 8 || req.body.email.length == 0)
					return res.json({ "status": "error", "message": "Fill all fields." })
				//find the particular user
				user.getUserByID(uid, (err, currentUser) => {
					if(err )
					  return res.json(err)
					if (!currentUser)
						return res.json({ "status": "error", "message": "An error occured" })
					currentUser.first_name = req.body.first_name
					currentUser.last_name = req.body.last_name
					currentUser.phonenumber = req.body.phonenumber
					currentUser.email = req.body.email
					currentUser.save((err, data)=>{
						if(err)
							return res.json(err)
						let updatedUser = JSON.parse(JSON.stringify(data))
						// update token
					    let code = Math.floor(Math.random() * 1000 + 1000)
						let clientToken = md5(salt + updatedUser.password + code)
					   	let token = jwt.sign({
								  id: updatedUser._id,
								  email: updatedUser.email,
								  hash: clientToken,
								  permission: updatedUser.permission
							},
							"ilovetechthanyoudo",
							{
								issuer: "tchizercm",
								expiresIn: "14d"
							})
						updatedUser.client_token = token
						delete updatedUser.password
						delete updatedUser._id
						delete updatedUser.permission

						return res.json({ "status": "success", "data": [updatedUser]})
					})
				})
				break
			case "password":
				if (req.body.password.length < 8 || req.body.new_password.length < 8)
					return res.json({ "status": "error", "message": "Passwords should be atleast 8 characters." })
				user.getUserByID(uid, (err, currentUser) => {
					if (err){
						console.log(err.message)
						return res.json({"status": "error", "message": "An error occured"})
					}
					if (!currentUser)
						return res.json({ "status": "error", "message": "An error occured" })
					//hash password and confirm if it matches current pass
					try{
						let password = req.body.password
						let newPassword = req.body.new_password
						currentUser.verifyPassword(password).then((match)=>{
							if (!match)
								return res.json({ "status": "error", "message": "An error occured" })
							//update the new hash
							currentUser.password = newPassword
							currentUser.save((err, updatedUser) => {
								if (err)
									return res.json(err)
								updatedUser = JSON.parse(JSON.stringify(updatedUser))
								// update token
								let code = Math.floor(Math.random() * 1000 + 1000)
								let clientToken = md5(salt + updatedUser.password + code)
								let token = jwt.sign({
									id: updatedUser._id,
									email: updatedUser.email,
									hash: clientToken,
									permission: updatedUser.permission
								},
									"ilovetechthanyoudo",
									{
										issuer: "tchizercm",
										expiresIn: "14d"
									})
								updatedUser.client_token = token
								delete updatedUser.password
								delete updatedUser.permission
								delete updatedUser._id
								return res.json({"status": "success", "data": [updatedUser]})
							})
						})
					}catch(e){
						console.log(e)
						return res.json({ "status": "error", "message": "An error occured" })
					}
				
				})

			default:

		}
	},
	async forgotPassword(req, res){
		let email = req.query.email
		try{
			if (validator.isEmail(email)){
				// check if email exists in platform
				 let user  = await User.exists({email: email})
				 console.log("The user is ", user)
				 if(user){
					 // create reset token
					 let result = await User.requestToken("reset", user)
					 if(result)
					 	return res.send("A link to reset your password has been sent to your email.")
					 res.status(500)
					 return res.end("An error occured")
				}else {
					 res.status(404)
					 console.log("Email not registered")
					 return res.end("This email is not registered with us. Please signup.")
				 }

			}else {
				res.status(401)
				console.log("Email entered is not valid:", email)
				return res.end("The email is not valid.")
			}

		}catch(e){
			res.status(500)
			console.log(e)
			return res.end("An error occured")
		}
	},
	async resetPassword(req, res){
		let token = req.body.token
		let password = req.body.password
		let confirm_password = req.body.confirm_password
		if(token.length != 64){
		   res.status(400)
		   return res.send("Reset token is not valid.")
		}
		if (password.length < 10 || (password != confirm_password)) {
			res.status(400)
			return res.send("An erro occured.")
		}
		// get the token
		try{
			let result = await User.resetPassword(token, password)
			if(result == 'success')
				return res.end('success')
			res.status(500)
			return res.end(result)
		}catch(e){
			console.log(e)
			res.status(500)
			return res.end("An error occured.")
		}

	},
	async verifyAccount(req, res){
		let token = req.query.token
		let result = await User.verifyAccount(token)
		if(result == 'success')
			return res.end('success')
		res.status(500)
		res.end(result)
	}

}
