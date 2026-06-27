// Messages.jsx
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import ReplyBlock from './ReplyBlock';
import { useContext, useEffect, useRef, useState } from 'react';
import { AccountContext } from '../../context/AccountProvider';
import { getMessages, newMessage, UploadImage } from '../../context/api';
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
`;

const MessageDiv = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow: auto;
    height: 530px;

    &::-webkit-scrollbar { width: 8px; background-color: #f5f5f5; }
    &::-webkit-scrollbar-thumb { border-radius: 10px; background-color: #c1c1c1; }
    &::-webkit-scrollbar-track { border-radius: 10px; background-color: #f5f5f5; }

    padding-top: 30px;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 transparent;
`;

// Allowed types for the file picker (shown in browser dialog)
export const ACCEPTED_FILE_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
].join(',');

const SIZE_LIMITS = {
  image: 5,
  document: 20,
  archive: 50,
};

const getCategory = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(mimetype)) return 'archive';
  return 'document';
};

// Typing indicator dots
const TypingIndicator = () => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '8px 16px', width: 'fit-content',
    bgcolor: '#fff', borderRadius: '0 8px 8px 8px',
    margin: '0 6% 8px 6%',
    boxShadow: '0px 1px 2px rgba(0,0,0,0.1)'
  }}>
    {[0, 1, 2].map((i) => (
      <Box key={i} sx={{
        width: 8, height: 8, borderRadius: '50%', bgcolor: '#90939a',
        animation: 'bounce 1.2s infinite',
        animationDelay: `${i * 0.2}s`,
        '@keyframes bounce': {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        }
      }} />
    ))}
  </Box>
);

const Messages = ({ conversation }) => {
  const { account, person, socket, newMessageRender, setNewMessageRender } = useContext(AccountContext);

  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [file, setFile] = useState('');
  const [image, setImage] = useState('');         // stores blobName
  const [originalName, setOriginalName] = useState(''); // stores original filename

  const [incomingMessage, setIncomingMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);

  // Error/success snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const showSnackbar = (message, severity = 'error') => setSnackbar({ open: true, message, severity });

  useEffect(() => {
    const getMessageDetails = async () => {
      const msgs = await getMessages(conversation._id);
      setMessages(msgs);
    };
    conversation._id && getMessageDetails();
  }, [person.id, conversation._id, newMessageRender]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setIncomingMessage({ ...data, createdAt: Date.now() });
    });
    socket.current.on("typing", ({ senderId }) => {
      if (senderId === person.sub) setIsTyping(true);
    });
    socket.current.on("stopTyping", ({ senderId }) => {
      if (senderId === person.sub) setIsTyping(false);
    });
    return () => {
      socket.current.off("typing");
      socket.current.off("stopTyping");
    };
  }, [person.sub]);

  useEffect(() => {
    incomingMessage && conversation?.members?.includes(incomingMessage.senderId) &&
      setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage, conversation]);

  const handleTyping = (val) => {
    setValue(val);
    socket.current.emit("typing", { senderId: account.sub, receiverId: person.sub });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.current.emit("stopTyping", { senderId: account.sub, receiverId: person.sub });
    }, 2000);
  };

  // Called by ReplyBlock when user picks a file
  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    const category = getCategory(selectedFile.type);
    const limitMB = SIZE_LIMITS[category];

    // Client-side size check before uploading
    if (selectedFile.size > limitMB * 1024 * 1024) {
      showSnackbar(`File too large. ${category} files must be under ${limitMB}MB.`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await UploadImage(formData);
      setImage(response.data.blobName);
      setOriginalName(selectedFile.name);
      setFile(selectedFile); // keep for preview in ReplyBlock
      showSnackbar('File ready to send!', 'success');
    } catch (error) {
      const msg = error.response?.data?.message || 'Upload failed. Try again.';
      showSnackbar(msg);
      setFile('');
      setImage('');
    } finally {
      setUploading(false);
    }
  };

  const sendText = async () => {
    if (!value && !image) return;

    let message = {};

    if (!file) {
      message = {
        senderId: account.sub,
        receiverId: person.sub,
        conversationId: conversation._id,
        type: 'text',
        value: value,
      };
    } else {
      message = {
        senderId: account.sub,
        receiverId: person.sub,
        conversationId: conversation._id,
        type: 'file',
        value: image,           // blobName
        originalName,           // original filename for display
      };
    }

    socket.current.emit("sendMessage", message);

    try {
      await newMessage(message);
    } catch (error) {
      showSnackbar('Failed to send message. Try again.');
      return;
    }

    setValue('');
    setFile('');
    setImage('');
    setOriginalName('');

    // Stop typing indicator
    socket.current.emit("stopTyping", { senderId: account.sub, receiverId: person.sub });
    setNewMessageRender(prev => !prev);
  };

  return (
    <ChatDiv>
      <MessageDiv>
        {messages && messages.map((message, index) => (
          <Box key={message._id} ref={lastMessageRef} sx={{ width: '88%' }}>
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

        {/* Typing indicator appears after last message */}
        {isTyping && (
          <Box sx={{ width: '88%' }}>
            <TypingIndicator />
          </Box>
        )}
        <Box ref={lastMessageRef} />
      </MessageDiv>

      {/* Upload progress */}
      {uploading && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          padding: '6px 16px', bgcolor: '#f0f0f0', width: '100%'
        }}>
          <CircularProgress size={16} />
          <span style={{ fontSize: 13, color: '#555' }}>Uploading file...</span>
        </Box>
      )}

      <ReplyBlock
        sendText={sendText}
        setValue={handleTyping}
        value={value}
        file={file}
        setFile={setFile}
        setImage={setImage}
        onFileSelect={handleFileSelect}   // ← new prop
        acceptedTypes={ACCEPTED_FILE_TYPES}  // ← new prop
        uploading={uploading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ChatDiv>
  );
};

export default Messages;