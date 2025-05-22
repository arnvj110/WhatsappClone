import React from 'react'
import { Avatar, Box } from '@mui/material'
import styled from 'styled-components'
import ChatIcon from '../../Icons/ChatIcon'
import Notification from '../../Icons/Notification'
import Account from '../../Icons/Account'
import KeyboardIcon from '../../Icons/KeyboardIcon'
import HelpIcon from '../../Icons/HelpIcon'
import PrivacyIcon from '../../Icons/PrivacyIcon'


const Body2 = styled(Box)`
  
  padding: 10px;
  border-radius: 10px;
  &:hover {
    background-color: #f6f6f6;
  }
    cursor: pointer;
  display: flex;
  
  align-items:center;
  
  
  ${props => props.gap || 'gap: 13px;'}
`

const Box3 = styled(Box)`
  display: flex;
  flex-direction: column;
  font-size: 15px;
  
  
  gap:4px;
  
`

const Box4 = styled(Box)`
  color:#808080;
  font-size: 14px;
`

const SettingDiv = ({ image, title, desc, gap }) => {
  const renderIcon = () => {
    switch (title) {
      case 'Account':
        return <Account />;
      case 'Privacy':
        return <PrivacyIcon />;
      case 'Chats':
        return <ChatIcon />;
      case 'Notifications':
        return <Notification />;
      case 'Keyboard shortcuts':
        return <KeyboardIcon />;
      case 'Help':
        return <HelpIcon />;
      default:
        return null;
    }
  };
  
  return (
    <Body2 gap={gap}>
      {image && <Avatar sx={{ width: 60, height: 60 }} src={image}  />}
  
      {!image && renderIcon()}
      <Box3>
        <Box>{title}</Box>
        <Box4>{desc}</Box4>
      </Box3>
    </Body2>
  );
};

export default SettingDiv
