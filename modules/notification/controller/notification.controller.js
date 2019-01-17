'use strict';
/******Create an elastic seach client************/
var Notification = require('../classes/notification.class');
module.exports = {
    add(req,res){
    	if(req.body.notification){
    		let uid = req.params.uid;//brid branch id
    		let notification = new Notification();
    		let notificationDetails = {}; 
    		notificationDetails.type = req.body.notification.type;
			notificationDetails.subject = req.body.notification.subject;
			notificationDetails.description = req.body.notification.description;
			notificationDetails.meta = req.body.notification.meta;
            notificationDetails.uid = uid;
            notificationDetails.read = false;
            notificationDetails.date_created_timestamp = new Date().getTime();  
            notificationDetails.hide  = false;  
    		notification.create(notificationDetails,function(data){
    			if(data.status){
    				res.json(data);
    			}else{
    				let notificationDetails = data._source;
    				console.log(data);
	    			//add product id to result
	    			notificationDetails['nid'] = data._id;
	    			res.json(notificationDetails);
    			}    			
    		});
    	}
    },
    get(req,res){
    	if(req.params.nid){
    		let notification = new Notification();
    		let nid = req.params.nid;
       	    notification.getNotificationByID(nid,function(data){
       	    	//if there was an error
       	    	if(data.status){
       	    		res.json(data);
       	    	}else{
       	    		let notificationDetails = data._source;
       	    		//remove rela
       	    		console.log(data);
	    			//add notification id to result
	    			notificationDetails['nid'] = data._id;
	    			res.json(notificationDetails);
       	    	}
       	    });
    	}
        
    },
    list(req,res){
    	if(req.params.uid){
    		let uid = req.params.uid;
    		let notification = new Notification();
    		notification.allNotifications(uid,function(data){
    			data.forEach(function(notification){
    			notification._source['nid'] = notification._id;
    			});
    			console.log(data);
    			res.json(data);
    		});
    	}else{
           console.log('Could not get all product of User '+ req.params.uid);
           res.json('Sorry an error occured. Please try again');
    	}
    },
     delete(req,res){
     	if(req.params.nid){
     		let notification = new Notification();
     		let nid = req.params.nid;
     	    notification.delete(nid,function(data){
     	    	if(data.status){
     	    		console.log('Could not delete notification with id ',bid);
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
     	if(req.body.notification){
     		//update 
     		let uid = req.params.uid;
            let nid = req.params.nid;
     		let notification = new Notification();
    		let notificationDetails = {}; 
    		notificationDetails.type = req.body.notification.title;
			notificationDetails.description = req.body.notification.description;
			notificationDetails.subject = req.body.notification.subject;
			notificationDetails.meta = req.body.notification.meta;
            notificationDetails.uid = uid;
            notificationDetails.read = req.body.notification.read;
            notificationDetails.hide  = req.body.notification.hide; 
			notification.update(nid,notificationDetails,function(data){
				if(data.status){
					console.log('Could not update product doc with id ',bid);
					res.json(data);
				}else{
					res.json(data);
				}
			});
     	}
     }

}