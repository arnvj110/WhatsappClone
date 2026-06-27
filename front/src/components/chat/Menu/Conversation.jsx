// src/components/chat/Menu/Conversation.jsx
import { Avatar, Box } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import TimeStamp from '../../TimeStamp'
import { AccountContext } from '../../context/AccountProvider'
import { getConversation, setConversation } from '../../context/api'

const Component = styled(Box)`
  margin-left: 3px;
  width: 90%;
  border-radius: 10px;
  display: flex;
  gap: 10px;
  padding: 10px;
  justify-content: space-between;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  &:hover {
    background-color: rgb(249, 244, 249);
  }
  cursor: pointer;
  overflow: hidden;
`

const Component1 = styled(Box)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 82%;
  justify-content: center;
  gap: 5px;
`

const Component2 = styled(Box)`
  display: flex;
  font-weight: 500;
  font-size: 18px;
  justify-content: space-between;
`

const Component3 = styled(Box)`
  display: flex;
  color: #808080;
  font-size: 14px;
`

const Component4 = styled(Box)`
  color: #808080;
  font-size: 12px;
`

const Conversation = ({ user }) => {
  const [latestMessage, setLatestMessage] = useState({});
  const { account, setPerson, newMessageRender, setNewMessageRender } = useContext(AccountContext);

  // ✅ Handle user selection - START CONVERSATION
  const handleUserSelect = async () => {
    console.log(`👤 Selecting user:`, user);
    
    if (!account || !user) {
      console.error("❌ No account or user selected");
      return;
    }
    
    // 1. Set person in context
    setPerson(user);
    
    // 2. Create or get conversation
    try {
      const conversationData = {
        senderId: account.sub,
        receiverId: user.sub
      };
      
      console.log("📤 Checking/creating conversation:", conversationData);
      
      // Check if conversation exists
      let conversation = await getConversation(conversationData);
      console.log("📊 Existing conversation:", conversation);
      
      // If no conversation, create one
      if (!conversation || !conversation._id) {
        console.log("🆕 Creating new conversation...");
        const newConv = await setConversation(conversationData);
        console.log("✅ New conversation created:", newConv);
        
        // Fetch the newly created conversation
        conversation = await getConversation(conversationData);
        console.log("📊 Fetched new conversation:", conversation);
      }
      
      if (conversation && conversation._id) {
        console.log("✅ Conversation ready:", conversation._id);
        // Trigger message load
        setNewMessageRender(prev => !prev);
      } else {
        console.error("❌ Failed to create/get conversation");
      }
      
    } catch (error) {
      console.error("❌ Error starting conversation:", error);
    }
  };

  // ✅ Get latest message for preview
  useEffect(() => {
    const getConversationDetails = async () => {
      if (!account?.sub || !user?.sub) return;
      
      try {
        const data = await getConversation({
          senderId: account.sub,
          receiverId: user.sub
        });

        if (data && data._id) {
          setLatestMessage({ 
            text: data?.message || 'Start chatting...', 
            timestamp: data?.updatedAt 
          });
        }
      } catch (error) {
        console.error("Error getting conversation details:", error);
      }
    };

    getConversationDetails();
  }, [newMessageRender, user?.sub, account?.sub]);

  return (
    <Component onClick={handleUserSelect}>
      <Avatar src={user.picture} sx={{ width: 55, height: 55 }} />
      <Component1>
        <Component2>
          {user.name}
          <Component4>
            <TimeStamp time={latestMessage.timestamp} />
          </Component4>
        </Component2>
        <Component3>
          {latestMessage?.text?.includes("/api/") ? '📎 Media' : latestMessage.text || 'Start chatting...'}
        </Component3>
      </Component1>
    </Component>
  )
}

export default Conversation