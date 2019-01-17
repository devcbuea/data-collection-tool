'use strict';
/******Create an elastic seach client************/
var Branch = require('../classes/branch.class');
module.exports = {
    add(req,res){
    	if(req.body.branch){
    		let bid = req.params.bid;//business id
    		let branch = new Branch();
    		let branchDetails = {}; 
    		branchDetails.name = req.body.branch.name;
			branchDetails.bid = bid;
			branchDetails.description = req.body.branch.description;
            branchDetails.category = req.body.branch.category;
            branchDetails.current_status = req.body.branch.current_status;            ;
            branchDetails.mobile = req.body.branch.mobile;
			branchDetails.location = req.body.branch.location;
            branchDetails.address = req.body.branch.address;
			branchDetails.date_created_timestamp = new Date().getTime();
			branchDetails.reported_count = 0;
            branchDetails.last_updated = new Date().getTime();
            branchDetails.opening_time = req.body.branch.opening_time;
            branchDetails.closing_time = req.body.branch.closing_time;
            branchDetails.deleted = false;
			branchDetails.suspended = false;
    		branch.create(branchDetails,function(data){
    			if(data.status){
    				res.json(data);
    			}else{
    				let branchDetails = data._source;
    				console.log(data._id);
	    			//add branch id to result
	    			branchDetails.brid = data._id;
	    			delete branchDetails.deleted;
	    			delete branchDetails.suspended;
                    delete branchDetails.last_updated;
                    delete branchDetails.reported_count;
                    delete branchDetails.date_created_timestamp;
	    			res.json(branchDetails);
    			}    			
    		});
    	}
    },//retrieve a particular branch
    get(req,res){
    	if(req.params.brid){
    		let branch = new Branch();
    		let brid = req.params.brid;
       	    branch.getBranchByID(brid,function(data){
       	    	//if there was an error
       	    	if(data.status){
       	    		res.json(data);
       	    	}else{
       	    		let branchDetails = data._source;
       	    		//remove rela
       	    		console.log(data);
	    			//add branch id to result
	    			branchDetails['brid'] = data._id;
	    			delete branchDetails.deleted;
                    delete branchDetails.suspended;
                    delete branchDetails.last_updated;
                    delete branchDetails.reported_count;
                    delete branchDetails.date_created_timestamp;
	    			res.json(branchDetails);
       	    	}
       	    });
    	}
        
    },
    list(req,res){
    	if(req.params.bid){
    		let branch = new Branch();
    		let bid = req.params.bid;
    		branch.allBranches(bid,function(data){
    			data.forEach(function(branch){
    				branch._source['brid'] = branch._id;
	    			delete branch._source.deleted;
                    delete branch._source.suspended;
                    delete branch._source.last_updated;
                    delete branch._source.reported_count;
                    delete branch._source.date_created_timestamp;
    			});
    			console.log(data);
    			res.json(data);
    		});
    	}else{
           console.log('Could not get all branch of User '+ req.params.uid);
           res.json('Sorry an error occured. Please try again');
    	}
    },
     delete(req,res){
     	if(req.params.brid){
     		let branch = new Branch();
     		let brid = req.params.brid;
     	    branch.delete(brid,function(data){
     	    	if(data.status){
     	    		console.log('Could not delete branch with id ',bid);
     	    		res.json(data);
     	    	}else{
     	    		res.end('success');
     	    	}
     	    });
     	}else{
     		res.json({'status':'error','message':'Sorry an error occured.Please try again'});
     	}
     },
     update(req,res){
     	if(req.body.branch){
     		//update 
     		let brid = req.params.brid;
     		let branch = new Branch();
    		let branchDetails = {}; 
            branchDetails.name = req.body.branch.name;
            branchDetails.brid = brid;
            branchDetails.description = req.body.branch.description;
            branchDetails.category = req.body.branch.category;
            branchDetails.current_status = req.body.branch.current_status;            ;
            branchDetails.mobile = req.body.branch.mobile;
            branchDetails.location = req.body.branch.location;
            branchDetails.address = req.body.branch.address;
            branchDetails.date_created_timestamp = new Date().getTime();
            branchDetails.reported_count = 0;
            branchDetails.last_updated = new Date().getTime();
            branchDetails.opening_time = req.body.branch.opening_time;
            branchDetails.closing_time = req.body.branch.closing_time;
            if(req.body.branch.relevance_count){
                 branchDetails.relevance_count = req.body.branch.relevance_count;
            }
			branch.update(brid,branchDetails,function(data){
				if(data.status){
					console.log('Could not update branch doc with id ',bid);
					res.json(data);
				}else{
					res.json(data);
				}
			});
     	}
     }

}