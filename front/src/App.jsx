import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Messenger from './components/Messenger'
import AccountProvider from './components/context/AccountProvider';



const App = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  console.log("Client ID:", clientId);

  return (
    <GoogleOAuthProvider clientId={clientId} >
      <AccountProvider>

          <Messenger />
        
      </AccountProvider>
    </GoogleOAuthProvider>
    
  )
}

export default App
