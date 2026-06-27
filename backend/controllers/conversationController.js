// backend/controllers/conversationController.js
import Conversation from "../model/ConversationModel.js";

export const newConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        
        console.log("📥 Creating conversation:", { senderId, receiverId });

        if (!senderId || !receiverId) {
            return res.status(400).json({ 
                message: "SenderId and ReceiverId are required" 
            });
        }

        // Check if conversation already exists
        const exist = await Conversation.findOne({
            members: { $all: [receiverId, senderId] }
        });

        if (exist) {
            console.log("✅ Conversation already exists:", exist);
            return res.status(200).json({
                message: "conversation already exists!",
                conversation: exist
            });
        }

        // Create new conversation
        const newConversation = new Conversation({
            members: [senderId, receiverId],
            message: "" // Initialize with empty message
        });

        await newConversation.save();
        console.log("✅ New conversation created:", newConversation);

        return res.status(200).json({
            message: "Conversation created!",
            conversation: newConversation
        });

    } catch (error) {
        console.error("❌ Error in newConversation:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        
        console.log("📥 Getting conversation:", { senderId, receiverId });

        if (!senderId || !receiverId) {
            return res.status(400).json({ 
                message: "SenderId and ReceiverId are required" 
            });
        }

        const conversation = await Conversation.findOne({
            members: { $all: [receiverId, senderId] }
        });
        
        console.log("📊 Found conversation:", conversation);

        return res.status(200).json(conversation || null);

    } catch (error) {
        console.error("❌ Error in getConversation:", error);
        res.status(500).json({ message: error.message });
    }
};