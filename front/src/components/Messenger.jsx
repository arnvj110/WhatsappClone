import { AppBar, Toolbar, styled, Box } from "@mui/material";
import React, { useContext } from 'react'
import Login from "./Account/Login";
import ChatDialogue from "./chat/ChatDialogue";
import { AccountContext } from "./context/AccountProvider";

const Component = styled(Box)`
  height: 100vh;
  background-color: #f0f2f5;
    
`
const Header = styled(AppBar)`
    height: 125px;
    background-color: #00a884;
    box-shadow: none;
    
`

const LoginHeader = styled(AppBar)`
    height: 225px;
    background-color: #00a884;
    box-shadow: none;
    
`

const Messenger = () => {
  const { account } = useContext(AccountContext);
  return (
    <Component>
      {
        account ? 
        <>
            <Header>
              <Toolbar>

              </Toolbar>
            </Header>
            <ChatDialogue />
          </>
        :
          <>
            <LoginHeader>
              <Toolbar>

              </Toolbar>
            </LoginHeader>
            <Login />
          </>
      }
      
    </Component>
  )
}

export default Messenger
