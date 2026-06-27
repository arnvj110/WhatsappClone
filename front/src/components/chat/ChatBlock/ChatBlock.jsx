// src/components/chat/ChatBlock/ChatBlock.jsx
import { Box } from "@mui/material"
import styled from "styled-components"
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { getConversation, setConversation } from "../../context/api";

const Component = styled(Box)`
  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`

const ChatBlock = () => {
  const { account, person, newMessageRender, setNewMessageRender } = useContext(AccountContext);
  const [conversation, setConversationState] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getConversationDetails = async () => {
      if (!person?.sub || !account?.sub) {
        console.log("⚠️ No person or account selected");
        return;
      }
      
      setLoading(true);
      console.log(`🔄 Loading conversation with: ${person.name}`);
      
      try {
        // First try to get existing conversation
        let data = await getConversation({
          senderId: account.sub,
          receiverId: person.sub
        });
        
        console.log("📊 Conversation data:", data);
        
        // If no conversation exists, create one
        if (!data || !data._id) {
          console.log("🆕 Creating new conversation...");
          await setConversation({
            senderId: account.sub,
            receiverId: person.sub
          });
          
          // Fetch the newly created conversation
          data = await getConversation({
            senderId: account.sub,
            receiverId: person.sub
          });
          console.log("✅ New conversation created:", data);
        }
        
        if (data && data._id) {
          setConversationState(data);
        } else {
          console.error("❌ Failed to get/create conversation");
        }
        
      } catch (error) {
        console.error("❌ Error loading conversation:", error);
      } finally {
        setLoading(false);
      }
    }
    
    getConversationDetails();
  }, [person?.sub, newMessageRender]);

  if (!person || !person.name) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        color: '#667781'
      }}>
        Loading conversation...
      </Box>
    );
  }

  return (
    <Component>
      <ChatHeader person={person} />
      {conversation && conversation._id ? (
        <Messages conversation={conversation} />
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#667781'
        }}>
          Select a contact to start chatting
        </Box>
      )}
    </Component>
  )
}

export default ChatBlock