import React, { useContext, useEffect, useState } from 'react'
// import { AccountContext } from '../../context/AccountProvider';
import { Avatar, Box, styled } from '@mui/material';
import ChatIcon from '../../Icons/ChatIcon';
import StatusIcon from '../../Icons/StatusIcon';
import NewsIcon from '../../Icons/NewsIcon';
import CommunityIcon from '../../Icons/CommunityIcon';
import SettingsIcon from '../../Icons/SettingsIcon';
import { AccountContext } from '../../context/AccountProvider';


const Component = styled(Box)`
    width: 12.5%;
    min-width: 12.5%;
    max-width: 12.5%;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color:rgb(249, 244, 249);
`

const Upper1 = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;   
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`
const Upper = styled(Box)`
    display: flex;
    flex-direction: column;
`

const Lower = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;   
    margin-bottom: 20px;
    border-top: 2px solid rgba(0, 0, 0, 0.1);
    padding-top: 20px;
`

const IconWrapper = styled(Box)`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    border-radius: 50%;
    padding: 8px;
    
    &:hover {
        background-color: #d1d7db; 
    }
    
    &.selected {
        background-color: #c2c9cd; 
    }
`;

const MetaLogoContainer = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
`;

const SideMenu = ({ setSelected }) => {
  const [image, setImage] = useState('Cap.png');
    const {account} = useContext(AccountContext);
    
    useEffect(() => {
      if (account) {
        
        setImage(account.picture);
      }
      },[account]);

  return (
    <Component>
      <Upper>
        <Upper1>

          <IconWrapper onClick={() => { setSelected(0) }}>
            <ChatIcon />
          </IconWrapper>

          <IconWrapper onClick={() => { setSelected(1) }}>
            <StatusIcon />
          </IconWrapper>

          <IconWrapper onClick={() => { setSelected(2) }}>
            <NewsIcon  />
          </IconWrapper>

          <IconWrapper onClick={() => { setSelected(3) }}>
            <CommunityIcon />
          </IconWrapper>

        </Upper1>
        <MetaLogoContainer>
        <Avatar src={`https://static.whatsapp.net/rsrc.php/v4/ye/r/W2MDyeo0zkf.png`} alt="no image found" sx={{ width: '20px', height: '20px' }} />
        </MetaLogoContainer>
        

      </Upper>
      <Lower>
        <IconWrapper onClick={() => { setSelected(4) }}>
          
        <SettingsIcon />
        </IconWrapper>
        <IconWrapper onClick={() => { setSelected(5) }}>

        <Avatar src={image ? image: 'Cap.png'} alt="no image found" sx={{ width: 28, height: 28 }} />
        </IconWrapper>
      </Lower>
    </Component>
  )
}

export default SideMenu
