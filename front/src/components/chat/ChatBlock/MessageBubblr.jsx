import { Box, Typography, Paper } from '@mui/material';
import TailOut from '../../Icons/TailOut';
import TainIn from '../../Icons/TainIn';
import { getFileUrl } from '../../context/api'; 
import styled from 'styled-components';
import Tick from '../../Icons/Tick';
import { useState, useRef, useEffect } from 'react';
import DownloadDrop from './DownloadDrop';
import TimeStamp from '../../TimeStamp';

const Time = styled(Typography)`
  font-size: 11px;
  color: ${({ $isImage }) => ($isImage ? 'white' : '#919191')};
  margin-top: auto;
  padding-right: 4px;
  min-width: fit-content;
  display: flex;
  gap: 3px;
  margin-left: auto;
  
  
`;

const Time1 = styled(Typography)`
  font-size: 11px;
  border: 2px solid black;
  margin-top: auto;
  padding-right: 4px;
  min-width: fit-content;
  display: flex;
  gap: 3px;
  margin-left: auto;
`

const PDFDiv = styled(Box)`
  width: 300px;
  

`


export const MessageBubble = ({ message, isOwn, showTail }) => {

  


  return (
    <Box
      display="flex"
      justifyContent={isOwn ? 'flex-end' : 'flex-start'}
      mb={1}
      px={1}
      mr={isOwn && !showTail ? '8px' : ''}
      ml={!isOwn && !showTail ? '8px' : ''}

    >
      {!isOwn && showTail && <TainIn />}
      <Paper
        elevation={0}
        sx={{

          maxWidth: '60%',
          minWidth: '10%',

          bgcolor: isOwn ? '#DCF8C6' : '#FFF',
          borderRadius: isOwn
            ? showTail
              ? '6px 0 6px 6px'
              : '6px 6px 6px 6px'
            : showTail
              ? '0 6px 6px 6px'
              : '6px 6px 6px 6px',
          position: 'relative',
          display: 'flex',
          flexDirection: message.type == 'text' ? '' : 'column',
          justifyContent: 'space-between',
          wordBreak: 'break-word',
          boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.1)',
          padding: message.type == 'text' ? '0.1' : '4px'
        }}
      >
        {message.type == 'text' &&
          <TextMessage message={message} />
        }
        {message.type == 'file' &&
          <ImageMessage message={message} isOwn={isOwn}

          />}


        {message.type == 'text' &&
          <Time $isImage={false} >
            <TimeStamp time={message.createdAt} />
            {isOwn && <Tick />}
          </Time>
        }
      </Paper>
      {isOwn && showTail && <TailOut />}
    </Box>
  );
};


const TextMessage = ({ message }) => {
  return (
    <Typography variant="body1" sx={{ wordWrap: 'break-word', fontSize: '14px', padding: '6px 10px 6px 10px' }}>
      {message.value}
    </Typography>
  )
}



const ImageMessage = ({ message, isOwn }) => {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState('');   // ← fresh SAS URL

  // Fetch a fresh SAS URL from blobName on every mount
  useEffect(() => {
  const fetchUrl = async () => {
    try {
      const sasUrl = await getFileUrl(message.value);

      if (message.value.endsWith('.jfif')) {
        const blob = await fetch(sasUrl).then(r => r.blob());
        const fixedBlob = new Blob([blob], { type: 'image/jpeg' });
        setResolvedUrl(URL.createObjectURL(fixedBlob));
      } else {
        setResolvedUrl(sasUrl);
      }
    } catch (e) {
      console.error('Failed to resolve image URL:', e);
    }
  };
  if (message.value) fetchUrl();
}, [message.value]);

  const handleEnter = () => setHover(true);
  const handleLeave = () => {
    setTimeout(() => {
      if (!menuOpen) setHover(false);
    }, 200);
  };

  // Check if it's a document by blobName extension
  const isDoc = [".pdf", ".docx", ".pptx", ".xlsx"]
    .some(ext => message.value?.endsWith(ext));

  if (isDoc) {
    return (
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Box
          sx={{
            maxWidth: '90%',
            width: '300px',
            bgcolor: isOwn ? '#DCF8C6' : '#FFF',
            borderRadius: '6px',
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
            <Typography fontWeight="500">{message.value}</Typography>
          </Box>
          <DownloadDrop
            fileUrl={message.value}
            fileName={message.value}
            onOpen={() => setMenuOpen(true)}
            onClose={() => { setMenuOpen(false); setHover(false); }}
          />
        </Box>
        <Time $isImage={false}>
          <TimeStamp time={message.createdAt} />
          {isOwn && <Tick />}
        </Time>
      </Box>
    );
  }

  return (
    <Box
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      sx={{ position: 'relative' }}
    >
      {resolvedUrl ? (
        <img
          src={resolvedUrl}                             // ← use resolvedUrl, not message.value
          alt="sent"
          style={{
            width: '100%',
            maxWidth: '700px',
            height: 'auto',
            maxHeight: '350px',
            objectFit: 'contain',
            borderRadius: '6px',
            margin: '3px auto',
            display: 'block',
          }}
        />
      ) : (
        <Box sx={{ 
          width: '200px', 
          height: '100px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#667781',
          fontSize: '12px'
        }}>
          Loading image...
        </Box>
      )}

      <Time $isImage={true} sx={{ position: 'absolute', bottom: 6, right: 6 }}>
        <TimeStamp time={message.createdAt} />
        {isOwn && <Tick />}
      </Time>

      {(hover || menuOpen) && resolvedUrl && (
        <Box sx={{ position: 'absolute', top: 3, right: 4 }}>
          <DownloadDrop
            fileUrl={message.value}                       // ← pass resolvedUrl here too
            fileName={message.value}
            onOpen={() => setMenuOpen(true)}
            onClose={() => { setMenuOpen(false); setHover(false); }}
          />
        </Box>
      )}
    </Box>
  );
};
