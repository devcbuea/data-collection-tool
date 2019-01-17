
const mongoose = require('mongoose'),
    MessageModel = mongoose.model('MessageSchema'),
    ConversationModel = mongoose.model('ConversationSchema');

module.exports = {
    add(req, res){
    //process request body
        let sender = req.user.id;
        //check if message has body
        if(req.body.text && req.body.text.length > 2){
            req.body.sender = sender;
            let message = new MessageModel(req.body);
            let receiver = message.receiver;
            //check if conversation already exist between both parties, if not create one
            ConversationModel.findOne({
                $and:[
                        { $or: [{ speaker1: sender }, { speaker2: receiver }] },
                        { $or: [{ speaker2: sender }, { speaker1: receiver }] }
                    ]
                     
            }, (err, data)=>{
                if(err)
                    return res.status(500).send({ "error": err.message });
                if(data){
                    message.conversation = data._id;
                    message.save(function (err, msg) {
                        if (!err){
                            let messageId = msg._id.toString();
                            let messages = data.messages;
                            data.messages = [...messages, messageId];
                            data.save(function(errc, datac){
                                console.log(errc);
                            });
                            return res.json({ "status": "success", "data": msg });
                        }
                        return res.status(500).send({ "error": err.message });
                    }); 
                    
                }else{
                    //create a converation
                    let conversation = ConversationModel({speaker1: sender, speaker2: receiver});
                    conversation.save((err, data)=>{
                        if (err)
                            return res.status(500).send({ "error": err.message });
                        message.conversation = data._id;
                        message.save(function (err, data) {
                            if (!err){
                                conversation.messages = [message._id];
                                conversation.save((err, data)=> {});
                                return res.json({ "status": "success", "data": data });
                            }
                            return res.status(500).send({ "error": err.message });
                        });     
                    });
                }
               
            });

        }else {
            res.status(400).send("Error: No message text");
        }
    },
    unread(req, res){
        let user = req.user.id;
        //check if conversation already exist between both parties, if not create one
        ConversationModel.find({
            $and: [{ $or: [{ speaker1: user }, { speaker2: user }]}, {seen: false}],
        }, (err, data) => {
            if(err)
                res.status(400).send("Error: Could not fetch unread messages.");
            let unseen = [];
            unseen = data.filter(el => el.seen == false);
            return res.json({"status": "success", "count": unseen.length});
        });
    },
    get(req, res){
        let user = req.user.id;
        ConversationModel.find({
            $or: [{ speaker1: user }, { speaker2: user }],
        }).sort({ 'created': 'desc' }).populate('messages').populate('speaker1', ['-password', '-last_seen', '-clientToken']).populate('speaker2', ['-password', '-last_seen', '-clientToken']).exec((err, data) => {
            if (err)
                res.status(400).send("Error: Could not fetch unread messages.");
            
            //get the person chatting with current user
            data = data ? JSON.parse(JSON.stringify(data)) : [];
            data = data.map((el, idx) => {
                if(el.speaker1._id != user ){
                    el['chatting_with'] = "speaker1";
                }else {
                    el['chatting_with'] = "speaker2";
                }
                return el;
            });
            return res.json({ "status": "success", "data": data });
        });
    }
}