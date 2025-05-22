import React, { useState } from 'react';
import { Avatar, CircularProgress } from '@mui/material';

const UserAvatar = ({ 
  src, 
  alt = 'User',
  size = 40,
  fallbackText = alt?.charAt(0)?.toUpperCase() || 'U'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Generate a random color for the fallback avatar
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };
  
  const avatarStyle = {
    width: size,
    height: size,
    fontSize: size * 0.4,
    bgcolor: error ? stringToColor(alt || 'User') : undefined,
    position: 'relative'
  };

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {loading && !error && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <CircularProgress size={size * 0.6} />
        </div>
      )}
      
      <Avatar 
        src={src}
        alt={alt}
        style={avatarStyle}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      >
        {fallbackText}
      </Avatar>
    </div>
  );
};

export default UserAvatar;