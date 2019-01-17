
const mongoose = require('mongoose'),
    MessageModel = mongoose.model('MessageSchema'),
    ConversationModel = mongoose.model('ConversationSchema');

module.exports = function(io, socket){
    socket.on("message", (data) => {
        /** Idenify the conversation
            Check if converation exits
            Create a message
            Send message to the conversation
         */
        let sender = socket.uid;
        let conversation = data.conversation;
        let text = data.message;
        ConversationModel.findOne(
            {
                $and:[
                        { $or: [{ speaker1: sender }, { speaker2: sender }] },
                        { "_id": conversation }
                ]
            }).populate("speaker1",['username']).populate("speaker2", ['username']).exec((err, conv)=>{
                if(err)
                    return Exception("An error Occured");
                if(conv){
                    //create message
                    let msg = new MessageModel({text, conversation});
                    msg.sender = sender;
                    msg.receiver = conv.speaker1.id != sender ? conv.speaker1.id : conv.speaker2.id;
                    msg.save((err, mssg) => {
                        if(err)
                            return Exception("An error Occured");
                        //push message to converation
                        io.in(conversation).emit("message", {
                            "sender": conv.speaker1.id == sender ? conv.speaker1.username : conv.speaker2.username,
                            "msg" : mssg,
                            "room": conversation
                        });
                        conv.seen = false;
                        conv.messages = [...conv.messages, mssg.id];
                        conv.save((err, data)=>{});
                    });
                }
        });
    });
    io.sockets.on("connection", (socket)=>{
        //search for all conversations and make user join room
        ConversationModel.find(
                    { $or: [{ speaker1: socket.uid }, { speaker2: socket.uid }] },
                    (err, conversations) => {
                        if(err)
                            return 0;
                        for(el of conversations){
                            socket.join(el.id);
                        }
                    })
    });
}