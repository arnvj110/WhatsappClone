import Conversation from "../model/ConversationModel.js";
import Message from "../model/MessageModel.js";



export const addMessage = async (req, res) => {
    try{
        
        const newMessage = new Message(req.body);

        await newMessage.save();
        await Conversation.findByIdAndUpdate(
            req.body.conversationId,
            { message: req.body.value }
        )

        return res.status(200).json("Message has been sent successfully!");
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getMessages = async (req, res) => {
    try{
        const messages = await Message.find({
            conversationId: req.params.id
        })
        return res.status(200).json(messages);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}