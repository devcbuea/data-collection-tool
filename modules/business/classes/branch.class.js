'use strict';
/****************Class Branch*********/
let client = require('../../../config/lib/elasticsearch');
class Branch{
	constructor(id, branch){
		if(id){
			this.id = branch;
		}else {
			this.name = branch.name;
			this.bid = branch.business_id;//businness id
			/* this.description = '';	 */
			this.date_created_timestamp = Date.now();
			this.last_updated = '';
			this.location = null;
			this.address = null;
			this.deleted = false;
			this.suspended = false; 
		}
		
	}
	create(callback){		
      client.index({
      	'index' : 'tchizer',
      	'type'  : 'branch',
      	'body'  : JSON.parse(JSON.stringify(this))
      },function(error,data,status){
        if(error){
        	console.log('Could not create branch');
        	callback({'status' : 'error','message' : 'Sorry an error coccured registering business. Please try again'});
        }else{
        	client.get({
        		'index' : 'tchizer',
        		'type'  : 'branch',
        		'id' : data._id
        	},function(error ,data){
        		 if(error){
		        	console.log('Created business but could not retrieve info');
		        	callback({'status' : 'error','message' : 'Sorry an error occured. Please refresh'});
        		}else{
        			callback(null,data);
        		}
        	});
        	
        }
      });
	}//create a branch end
	//brid branch id
	getBranchByID(brid,callback){
		client.get({
			'index' : 'tchizer',
			'type' : 'branch',
			'id' : brid
		},function(error,data,status){
			if(error){
				console.log('Could not retrieved business ' + bid + ' details');
				callback({'status':'error',
						  'msg' : 'An error occured processing your request.Please try later.'});				
			}else{
				callback(data);
			}
		});
	}
	allBranches(bid,callback){
		client.search({
				'index': 'tchizer',
			    'type': 'branch',
			    'q' :'bid:'+bid
			},function(error,response,status){
                if(error){
                	console.log('Could not retrieve list of business ');
                	callback({ 'status' : 'error', 'message': 'Sorry an error occure.Please try again.'});
                }else{
                	let results = response.hits.hits;
                	callback(results);
                }
			});
	}
	delete(brid,callback){
		client.delete({
			'index' : 'tchizer',
			'type' : 'branch',
			'id' : brid
		},function(error,response){
			if(error){
				callback({'status':'error','message':'Sorry an error occured.Please try again'});
			}else{
				callback('success');
			}
		});
	}
	update(brid,branchDetails,callback){
		client.update({
			'index' : 'tchizer',
			'type' : 'branch',
			'id' : brid,
			'body' : { 
				'doc' :branchDetails
			}
		},function(error,response){
			if(error){
				callback({'status': 'error' ,'message': 'Sorry an error occured. Please try again.'});
			}else{
				callback(response);
			}
		});
	}
	
}
module.exports = Branch;