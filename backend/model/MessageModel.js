import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    conversationId: {
        type:String,
        required:true,
    },
    senderId:{
        type:String,
        required:true
    },
    receiverId:{
        type:String,
        required:true
    },
    type: {
        type:String,
        default:'text',
    },
    value: {
        type: String,

    }
    
},{
    timestamps:true,
}


);

const Message = mongoose.model('messages', MessageSchema);
export default Message;