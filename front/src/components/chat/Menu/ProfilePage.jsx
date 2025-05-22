import { Avatar, Box, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { AccountContext } from '../../context/AccountProvider';

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

const Component1 = styled(Box)`
    
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Component2 = styled(Box)`
    
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap:20px;
`

const Box1 = styled(Box)`
    font-size: 14px;
    color: #4b4b4b;
`

const Component3 = styled(Box)`
    display: flex;
    justify-content: space-between;
`

const ProfilePage = () => {
    const [image, setImage] = useState('Cap.png');
      const {account} = useContext(AccountContext);
      
      useEffect(() => {
        if (account) {
          
          setImage(account.picture);
        }
        },[account]);
    return (
        <Component>
            <Header>
                Profile
            </Header>
            <Component1>
                <Avatar sx={{ width: 130, height: 130 }} src={image ? image : 'Cap.png'} alt="Profile Picture" />
            </Component1>
            <Component2>
                <Box1>Your name</Box1>
                <Component3>
                    <Typography sx={{fontSize:'16px'}} >Arnav Jain</Typography>

                </Component3>

                <Box1>This is not your username or PIN. This name will be visible to your WhatsApp contacts.</Box1>
            </Component2>
            <Component2>
                <Box1>About</Box1>
                <Component3>
                    <Typography sx={{fontSize:'16px'}} >Available</Typography>
                    
                </Component3>

                
            </Component2>
        </Component>
    )
}

export default ProfilePage
