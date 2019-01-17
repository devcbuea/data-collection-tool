/****************Class Notification*********/
let client = require('../../../config/lib/elasticsearch');
let config = require('../../../config/env/default');
class Notification {
    constructor(){
       this.type = "";
    }
    create(notificationDetails,callback){
        console.log("We are in create");
      client.index({
        'index' : 'tchizer',
        'type'  : 'notification',
        'body'  : notificationDetails
      },function(error,data,status){
        if(error){
            console.log('Could not create notification');
            callback({'status' : 'error','message' : 'Sorry an error coccured registering business. Please try again'});
        }else{
            client.get({
                'index' : 'tchizer',
                'type'  : 'notification',
                'id' : data._id
            },function(error ,data){
                 if(error){
                    console.log('Created notification but could not retrieve info');
                    callback({'status' : 'error','message' : 'Sorry an error occured. Please refresh'});
                }else{
                    callback(data);
                }
            });
            
        }
      });
    }
    getNotificationByID(nid,callback){
        client.get({
            'index' : 'tchizer',
            'type' : 'notification',
            'id' : nid
        },function(error,data,status){
            if(error){
                console.log('Could not retrieved notification ' + bid + ' details');
                callback({'status':'error',
                          'msg' : 'An error occured processing your request.Please try later.'});               
            }else{
                callback(data);
            }
        });
    }
    allNotifications(uid,callback){
        client.search({
                'index': 'tchizer',
                'type': 'notification',
                'q' :'uid:'+uid
            },function(error,response,status){
                if(error){
                    console.log('Could not retrieve list of notification ');
                    callback({ 'status' : 'error', 'message': 'Sorry an error occure.Please try again.'});
                }else{
                    let results = response.hits.hits;
                    callback(results);
                }
            });
    }
    delete(nid,callback){
        client.delete({
            'index' : 'tchizer',
            'type' : 'notification',
            'id' : nid
        },function(error,response){
            if(error){
                callback({'status':'error','message':'Sorry an error occured.Please try again'});
            }else{
                callback('success');
            }
        });
    }
    update(nid,notificationDetails,callback){
        client.update({
            'index' : 'tchizer',
            'type' : 'notification',
            'id' : nid,
            'body' : { 
                'doc' :notificationDetails
            }
        },function(error,response){
            if(error){
                callback({'status': 'error' ,'message': 'Sorry an error occured. Please try again.'});
            }else{
                callback(response);
            }
        });

    }
    sendSMS(to, message, callback){
        		// sms validation code
                config.nexmo.to = to;
                config.nexmo.text = message;
                let dataString = JSON.stringify(config.nexmo);
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
                        console.log("An error occured ",err);
                    }else {
                        console.log(body);
                    }
                    
                    callback({'status': 'success', 'data': "Code sent"});
                });	
    }
}
module.exports = Notification;