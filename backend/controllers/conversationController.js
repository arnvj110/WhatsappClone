import Conversation from "../model/ConversationModel.js";

export const newConversation = async (req, res) => {
    try{
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;

        const exist = await Conversation.findOne({members : { $all : [ receiverId, senderId ]} });

        if(exist){
            return res.status(200).json("conversation already exists!");
        }

        const newConversation = new Conversation({
            members : [senderId, receiverId],
            
        });

        await newConversation.save();

        return res.status(200).json("Conversation created!");

    } catch(error){
        res.status(500).json({message: error.message})
    }
}

export const getConversation = async (req, res) => {
    try{
        const {senderId, receiverId} = req.body;
        

        const conversation = await Conversation.findOne({members : { $all : [receiverId, senderId]}});
        
        return res.status(200).json(conversation);


    } catch(error){
        res.status(500).json({message: error.message})
    }
}