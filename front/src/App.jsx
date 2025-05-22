import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Messenger from './components/Messenger'
import AccountProvider from './components/context/AccountProvider';



const App = () => {
  const clientId = '1081310591326-hqcop0qt6rhfqbarm80c0gn0mavrhjt2.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId} >
      <AccountProvider>

          <Messenger />
        
      </AccountProvider>
    </GoogleOAuthProvider>
    
  )
}

export default App
