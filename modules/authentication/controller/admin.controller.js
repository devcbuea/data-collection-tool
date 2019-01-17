
'use strict';

var User        = require('../classes/user.class'),
    Business    = require('../../business/classes/business.class'),
    Branch      = require('../../business/classes/branch.class'),
    Product     = require('../../business/classes/product.class'),
    Service     = require('../../business/classes/service.class'),
    md5         = require('md5');

class AdminController{
    /**
     * Constructor
     */
    constructor(){
        this.user = null;
    }
    
    /**
     * Create User Accounts route handler
     * 
     * @param  {object} req request
     * @param  {object} res response
     */
    createAccount(req, res){
        let user = new User(req.body);
        user.save((err, savedUser) => {
            /*
             * check if an error occured creating user 
             * if not create default business for user
             */
            console.log("********************* ",savedUser);
            if(err){
                res.json(err);
            }else {
                let business = new Business(null,{
                    'name': "Unamed Business",
                    'user_id': savedUser.id,
                    'description': 'No description',
                    'website': 'https://www.example.com',
                    'category': {},
                    'date_created': Date.now(),
                    'deleted': false,
                    'suspended': false
                });
                business.create((err, savedBusiness) => {
                    if(err){
                        res.jsonp(err);
                    }else {
                         // form user object data with data
                        let savedBusinessId = savedBusiness._id;
                        savedBusiness = savedBusiness._source;
                        savedBusiness['id'] = savedBusinessId;
                        let response = {
                            "user": savedUser,
                            "business": savedBusiness
                        }; 
                        res.json({"status": "success", "data": response});
                    }     
                });
            }
           

        });   
    }

    /**
     * Add a product to Branch route handler
     * @param {object} req request
     * @param {object} res response
     */
    addProduct(req, res){
        // TODO: Validate request body
        let product = new Product(null,req.body);
        product.create((err, savedProduct) => {
            if(err){
                res.jsonp(err);
            }else{
                res.jsonp({"status": "success", "data": savedProduct});
            }
        });
    }
    /**
     * Add a service to a branch route handler
     * 
     * @param {object} req request
     * @param {object} res response
     */
    addService(req, res){
        //TODO: Validate request body
        let service = new Service(null, req.body);
        console.log(service);
        service.create((err, savedService) => {
            if(err){
                res.jsonp(err);
            }else{
                res.jsonp({"status": "success", "data": savedService});
            }
        });
    }
}
module.exports = new AdminController();