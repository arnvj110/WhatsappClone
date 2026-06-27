import Conversation from "../model/ConversationModel.js";
import Message from "../model/MessageModel.js";

export const addMessage = async (req, res) => {
    try {
        const { conversationId, senderId, receiverId, type, value } = req.body;

        // Validation
        if (!conversationId || !senderId || !receiverId || !value) {
            return res.status(400).json({ 
                message: "conversationId, senderId, receiverId, and value are required" 
            });
        }

        // Verify conversation exists
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const newMessage = new Message({
            conversationId,
            senderId,
            receiverId,
            type: type || 'text',
            value
        });

        await newMessage.save();
        
        // Update conversation's last message
        await Conversation.findByIdAndUpdate(
            conversationId,
            { message: value },
            { new: true }
        );

        return res.status(201).json({ 
            message: "Message sent successfully!",
            data: newMessage 
        });

    } catch (error) {
        console.error("Error in addMessage:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Conversation ID is required" });
        }

        const messages = await Message.find({
            conversationId: id
        }).sort({ createdAt: 1 }); // Sort by creation time

        return res.status(200).json(messages);

    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ message: error.message });
    }
};