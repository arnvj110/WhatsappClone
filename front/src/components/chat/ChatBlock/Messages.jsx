import { Box } from '@mui/material';

import styled from 'styled-components';


import ReplyBlock from './ReplyBlock';
import { useContext, useEffect, useRef, useState } from 'react';
import { AccountContext } from '../../context/AccountProvider';

import { getMessages, newMessage } from '../../../service/api';
import { MessageBubble } from './MessageBubblr';




const ChatDiv = styled(Box)`
    background-image: url('https://i.pinimg.com/736x/7c/29/29/7c2929ff41f2406df117969a5bf46bf7.jpg');
    
    background-size: contain;
    background-repeat: repeat;
    background-attachment: fixed;
    background-position: center;
    height: calc(100% - 50px);
    
    
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    
`

const MessageDiv = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow: auto;
    height: 530px;
    
    &::-webkit-scrollbar {
    width: 8px;
    background-color: #f5f5f5;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #c1c1c1;
    
    &:hover {
      background-color: #a8a8a8;
    }
  }
  
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #f5f5f5;
  }
  
  padding-top:30px;
  padding-bottom: 10px;
  
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
`


const Messages = ({ conversation }) => {
  const { account, person, socket, newMessageRender, setNewMessageRender } = useContext(AccountContext);
  
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
  
  const [file, setFile] = useState('');
  const [image, setImage] = useState('');

  const [incomingMessage, setIncomingMessage] = useState(null);

  useEffect(() => {
    const getMessageDetails = async () => {
      const messages = await getMessages(conversation._id);
      setMessages(messages);
    }
    conversation._id && getMessageDetails();
  }, [person.id, conversation._id, newMessageRender]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ transition: 'smooth' });
    
  }, [messages]);


  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now()
      });
    });
  }, []);

  useEffect(()=>{
    incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
    setMessages((prev)=>[...prev, incomingMessage]);
  }, [incomingMessage, conversation]);
  
  const sendText = async () => {
    let message = {};
    if(!file){

      message = {
        senderId: account.sub,
        receiverId: person.sub,
        conversationId: conversation._id,
        type: 'text',
        value: value,
        
      }
      
    }else{
      
      message = {
        senderId: account.sub,
        receiverId: person.sub,
        conversationId: conversation._id,
        type: 'file',
        value: image,
        
      }
    }

    socket.current.emit("sendMessage", message);

    await newMessage(message);

    setValue('');
    setFile('');
    setImage('');
    setNewMessageRender(prev=>!prev);
  }

  return (
    <ChatDiv>

      <MessageDiv>
        {messages &&
          messages.map((message, index) => (
            <Box
              key={message._id}
              ref={lastMessageRef}
              sx={{ width:'88%' }}
            >
              <MessageBubble
                message={message}
                sender={account.name}
                isOwn={message.senderId === account.sub}
                showTail={
                  index === messages.length - 1 ||
                  messages[index - 1]?.senderId !== message.senderId
                }

              />
            </Box>
          ))}
      </MessageDiv>

      <ReplyBlock sendText={sendText} setValue={setValue} value={value} file={file} setFile={setFile} setImage={setImage} />
    </ChatDiv>
  )
}


export default Messages;