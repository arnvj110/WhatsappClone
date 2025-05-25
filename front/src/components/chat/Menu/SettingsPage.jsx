import { Box } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Search from './Search'
import SettingDiv from './SettingDiv'
import LogOutIcon from '../../Icons/LogOutIcon'
import { AccountContext } from '../../context/AccountProvider'

// const Component = styled(Box)`
//   font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   width: 100%;
// `
// const Header = styled(Box)`
//   padding: 20px;         
//   font-size: 20px;        
//   font-weight: bold;      

// `
// const Body1 = styled(Box)`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   margin-top: 15px;
//   padding: 10px;
//   width: 100%;
//   overflow: auto;


// `

const Partition = styled(Box)`
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  
`

const Component = styled(Box)`
  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
  width: 100%;
  
  display: flex;
  flex-direction: column;
  
`;

const Header = styled(Box)`
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
`;

const Body1 = styled(Box)`
  margin-top: 13px;
  flex-grow: 1; 
  overflow-y: auto; 
  padding: 10px;
  gap: 10px;
  display: flex;
  
  flex-direction: column;
  
  
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
  
  
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
`;


const Body2 = styled(Box)`
  
  padding: 10px;
  border-radius: 10px;
  &:hover {
    background-color: #f6f6f6;
  }
    cursor: pointer;
  display: flex;
  
  align-items:center;
  
  gap: 20px;
  
`

const Box3 = styled(Box)`
  font-size: 15px;
  color: #ec243f;
`

const Box4 = styled(Box)`
  
  padding: 45px;
`


const SettingsPage = () => {
  const [image, setImage] = useState('Cap.png');
  const { account } = useContext(AccountContext);

  useEffect(() => {
    if (account) {

      setImage(account.picture);
      
    }
  }, [account]);

  return (
    <Component>
      <Header>
        Settings
      </Header>
      <Search placeholder={'Search settings'} autoFocus={true} />
      <Body1>
        <SettingDiv title={account?.name || 'Arnav Jain'} desc={'Available'} image={image} />
        <Partition />
        <SettingDiv title={'Account'} desc={'Security notifications, account info'} gap={'gap: 20px;'} />
        <SettingDiv title={'Privacy'} desc={'Blocked contacts, disappearing messages'} gap={'gap: 20px;'} />
        <SettingDiv title={'Chats'} desc={'Theme, wallpaper, chat settings'} gap={'gap: 20px;'} />
        <SettingDiv title={'Notifications'} desc={'Message notifications'} gap={'gap: 20px;'} />
        <SettingDiv title={'Keyboard shortcuts'} desc={'Quick actions'} gap={'gap: 20px;'} />
        <SettingDiv title={'Help'} desc={'Help center, contact us, privacy policy'} gap={'gap: 20px;'} />
        <Body2>
          <LogOutIcon color='#ec243f' />
          <Box3>Log out</Box3>
        </Body2>
        <Partition />
        <Box4 />
      </Body1>


    </Component>
  )
}

export default SettingsPage
