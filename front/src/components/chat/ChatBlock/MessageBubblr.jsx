// MessageBubblr.jsx
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import TailOut from '../../Icons/TailOut';
import TainIn from '../../Icons/TainIn';
import styled from 'styled-components';
import Tick from '../../Icons/Tick';
import { useState, useEffect } from 'react';
import DownloadDrop from './DownloadDrop';
import TimeStamp from '../../TimeStamp';
import { getFileUrl } from '../../context/api';

// ---- Icons for file types ----
const FileIcon = ({ ext }) => {
  const icons = {
    pdf:  { bg: '#FF5722', label: 'PDF' },
    doc:  { bg: '#2196F3', label: 'DOC' },
    docx: { bg: '#2196F3', label: 'DOCX' },
    xls:  { bg: '#4CAF50', label: 'XLS' },
    xlsx: { bg: '#4CAF50', label: 'XLSX' },
    ppt:  { bg: '#FF9800', label: 'PPT' },
    pptx: { bg: '#FF9800', label: 'PPTX' },
    txt:  { bg: '#607D8B', label: 'TXT' },
    zip:  { bg: '#9C27B0', label: 'ZIP' },
    rar:  { bg: '#9C27B0', label: 'RAR' },
  };
  const { bg, label } = icons[ext?.toLowerCase()] || { bg: '#78909C', label: ext?.toUpperCase() || 'FILE' };
  return (
    <Box sx={{
      width: 44, height: 44, borderRadius: '8px',
      bgcolor: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>
      <Typography sx={{ color: '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: 0.3 }}>
        {label}
      </Typography>
    </Box>
  );
};

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

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
const isImageBlob = (blobName) => IMAGE_EXTS.some(ext => blobName?.toLowerCase().endsWith(ext));

// ---- Hook: resolve blobName → fresh SAS URL ----
const useResolvedUrl = (blobName) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!blobName) return;
    setLoading(true);
    setError(false);
    getFileUrl(blobName)
      .then(sasUrl => { setUrl(sasUrl); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [blobName]);

  return { url, loading, error };
};

// ---- Main bubble ----
export const MessageBubble = ({ message, isOwn, showTail }) => {
  return (
    <Box
      display="flex"
      justifyContent={isOwn ? 'flex-end' : 'flex-start'}
      mb={1} px={1}
      mr={isOwn && !showTail ? '8px' : ''}
      ml={!isOwn && !showTail ? '8px' : ''}
    >
      {!isOwn && showTail && <TainIn />}
      <Paper
        elevation={0}
        sx={{
          maxWidth: '60%', minWidth: '10%',
          bgcolor: isOwn ? '#DCF8C6' : '#FFF',
          borderRadius: isOwn
            ? showTail ? '6px 0 6px 6px' : '6px'
            : showTail ? '0 6px 6px 6px' : '6px',
          position: 'relative', display: 'flex',
          flexDirection: message.type === 'text' ? 'row' : 'column',
          justifyContent: 'space-between', wordBreak: 'break-word',
          boxShadow: '0px 4px 6px -2px rgba(0,0,0,0.1)',
          padding: message.type === 'text' ? '0.1' : '4px',
        }}
      >
        {message.type === 'text' && <TextMessage message={message} />}
        {message.type === 'file' && <FileMessage message={message} isOwn={isOwn} />}
        {message.type === 'text' && (
          <Time $isImage={false}>
            <TimeStamp time={message.createdAt} />
            {isOwn && <Tick />}
          </Time>
        )}
      </Paper>
      {isOwn && showTail && <TailOut />}
    </Box>
  );
};

// ---- Text ----
const TextMessage = ({ message }) => (
  <Typography variant="body1" sx={{ wordWrap: 'break-word', fontSize: '14px', padding: '6px 10px' }}>
    {message.value}
  </Typography>
);

// ---- Dispatcher: image vs document ----
const FileMessage = ({ message, isOwn }) => {
  const blobName = message.value;
  if (isImageBlob(blobName)) {
    return <ImageMessage message={message} isOwn={isOwn} />;
  }
  return <DocumentMessage message={message} isOwn={isOwn} />;
};

// ---- Image ----
const ImageMessage = ({ message, isOwn }) => {
  const { url, loading, error } = useResolvedUrl(message.value);
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setTimeout(() => { if (!menuOpen) setHover(false); }, 200)}
      sx={{ position: 'relative', minWidth: 120, minHeight: 80 }}
    >
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 200, height: 120 }}>
          <CircularProgress size={24} sx={{ color: '#90939a' }} />
        </Box>
      )}

      {error && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 200, height: 80 }}>
          <Typography sx={{ fontSize: 12, color: '#e53935' }}>Failed to load image</Typography>
        </Box>
      )}

      {!loading && !error && url && (
        <img
          src={url}
          alt="sent"
          style={{
            width: '100%', maxWidth: 700,
            height: 'auto', maxHeight: 350,
            objectFit: 'contain', borderRadius: 6,
            margin: '3px auto', display: 'block',
          }}
        />
      )}

      <Time $isImage={true} sx={{ position: 'absolute', bottom: 6, right: 6 }}>
        <TimeStamp time={message.createdAt} />
        {isOwn && <Tick />}
      </Time>

      {(hover || menuOpen) && url && (
        <Box sx={{ position: 'absolute', top: 3, right: 4 }}>
          <DownloadDrop
            fileUrl={message.value}
            onOpen={() => setMenuOpen(true)}
            onClose={() => { setMenuOpen(false); setHover(false); }}
          />
        </Box>
      )}
    </Box>
  );
};

// ---- Document / PDF / ZIP etc ----
const DocumentMessage = ({ message, isOwn }) => {
  const { url, loading, error } = useResolvedUrl(message.value);
  const [menuOpen, setMenuOpen] = useState(false);

  // Display name: use originalName if stored, else derive from blobName
  const displayName = message.originalName || message.value?.split('-').slice(5).join('-') || message.value;
  const ext = message.value?.split('.').pop()?.toLowerCase();

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <Box sx={{
        width: 280, bgcolor: isOwn ? '#DCF8C6' : '#FFF',
        borderRadius: '6px', padding: '10px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 1,
      }}>
        <FileIcon ext={ext} />

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography
            fontWeight="500" fontSize="13px"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={displayName}
          >
            {displayName}
          </Typography>
          <Typography fontSize="11px" color="#888" sx={{ textTransform: 'uppercase' }}>
            {ext} · {loading ? '...' : error ? 'unavailable' : 'Ready'}
          </Typography>
        </Box>

        {loading && <CircularProgress size={20} sx={{ color: '#90939a' }} />}
        {!loading && !error && (
          <DownloadDrop
            fileUrl={message.value}
            onOpen={() => setMenuOpen(true)}
            onClose={() => setMenuOpen(false)}
          />
        )}
        {error && (
          <Typography sx={{ fontSize: 11, color: '#e53935' }}>Error</Typography>
        )}
      </Box>

      <Time $isImage={false}>
        <TimeStamp time={message.createdAt} />
        {isOwn && <Tick />}
      </Time>
    </Box>
  );
};