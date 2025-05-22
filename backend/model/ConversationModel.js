import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema({
    members: {
        type:Array,
        required:true,
    },
    message: {
        type: String,

    }},
    {
        timestamps: true,
    }

);

const Conversation = mongoose.model('conversations', ConversationSchema);
export default Conversation;