import { Box, Dialog, List, ListItem, ListItemText, styled, Typography } from '@mui/material'
import React, { useContext } from 'react'
import {GoogleLogin} from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { AccountContext } from '../context/AccountProvider';
import { addUser } from '../../service/api';



const Component = styled(Box)`
  display: flex;
  
  justify-content: center;
  
  padding: 20px;
`

const Container = styled(Box)`
  padding-top: 50px;
  color: #525252;
  
`
const Title = styled(Typography)`
font-size: 25px;

font-weight: 300;
font-family: inherit;
margin-bottom: 25px;
`

const StyledList = styled(List)`
  & > li {
    padding: 0;
    margin-top: 15px;
    font-size: 10px;
    line-height: 28px;
  }
`

const QrCode = styled(Box)({
  height: 264,
  width: 264,
  margin: '50px 0 0 50px',
  position: 'relative'

})






const dialogStyle = {
  height: '95%',
  marginTop: '12%',
  width: '60%',
  minWidth: '800px',

  maxHeight: '100%',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 12px 28px rgba(0, 0, 0, 0.3)',
  border: 'none',
  
}

const LoginBlock = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 12px 28px rgba(0, 0, 0, 0.3);
`;


const Login = () => {
  const {setAccount} = useContext(AccountContext);

  const onLoginSuccess = async (res) => {
    
    const decoded = jwtDecode(res.credential);
    setAccount(decoded);
    
    await addUser(decoded);

    
  }

  const onLoginFail = () => {
    console.log("Login Fail!");
  }

  return (
    <Dialog
      open={true}
      PaperProps={{ sx: dialogStyle }}
      BackdropProps={{
        style: { backgroundColor: 'transparent' }
      }}
      transitionDuration={0}
    >
      <Component>
        <Container>
          <Title>To use WhatsApp on your computer:</Title>
          <StyledList>
            <ListItem>
              <ListItemText primary="1. Open WhatsApp on your phone" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Tap Menu ⋮ or Settings ⚙ and select Linked Devices" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Point your phone to this screen to capture the code" />
            </ListItem>
          </StyledList>
        </Container>

        <QrCode>
          <img
            src="qr.png"
            alt="qr_code"
            style={{ width: '100%', height: '100%' }}
          />
          <LoginBlock>
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={onLoginFail}
          />
        </LoginBlock>
        </QrCode>
        
      </Component>
      
    </Dialog>

  )
}

export default Login
