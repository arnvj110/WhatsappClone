// src/components/Account/Login.jsx
import { Box, Dialog, List, ListItem, ListItemText, styled, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { AccountContext } from '../context/AccountProvider';
import { addUser } from '../context/api'; // ✅ Correct path

const Component = styled(Box)`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const Container = styled(Box)`
  padding-top: 50px;
  color: #525252;
`;

const Title = styled(Typography)`
  font-size: 25px;
  font-weight: 300;
  font-family: inherit;
  margin-bottom: 25px;
`;

const StyledList = styled(List)`
  & > li {
    padding: 0;
    margin-top: 15px;
    font-size: 10px;
    line-height: 28px;
  }
`;

const QrCode = styled(Box)({
  height: 264,
  width: 264,
  margin: '50px 0 0 50px',
  position: 'relative'
});

const dialogStyle = {
  height: '95%',
  marginTop: '12%',
  width: '60%',
  minWidth: '800px',
  maxHeight: '100%',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 12px 28px rgba(0, 0, 0, 0.3)',
  border: 'none',
};

const LoginBlock = styled(Box)`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

const Login = () => {
  const { setAccount } = useContext(AccountContext);

  const onLoginSuccess = async (res) => {
    try {
      console.log("🔐 Google login success, decoding token...");
      
      const decoded = jwtDecode(res.credential);
      console.log("👤 Decoded user:", {
        sub: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture?.substring(0, 50) + '...'
      });
      
      // Set account in context
      setAccount(decoded);
      console.log("✅ Account set in context");
      
      // Save to backend
      console.log("💾 Saving user to backend...");
      const result = await addUser({
        sub: decoded.sub,
        name: decoded.name,
        picture: decoded.picture,
        email: decoded.email,
      });
      
      console.log("✅ User saved to database:", result);
      
    } catch (error) {
      console.error("❌ Login error details:");
      console.error("  - Error:", error);
      console.error("  - Message:", error.message);
      console.error("  - Response:", error.response?.data);
      
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const onLoginFail = (error) => {
    console.error("❌ Google Login Failed:", error);
    alert("Google login failed. Please try again.");
  };

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
            src="/qr.png"
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
  );
};

export default Login;