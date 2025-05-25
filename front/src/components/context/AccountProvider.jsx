import React, { createContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import { io } from 'socket.io-client';

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState();
  const [person, setPerson] = useState({});

  const [activeUsers, setActiveUsers] = useState([]);
  const [newMessageRender, setNewMessageRender] = useState(false);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("https://whatsappclone-3.onrender.com"); 
    console.log("Socket connected");
  }, []);

  return (
    <AccountContext.Provider value={{ 
      account, 
      setAccount, 
      person, 
      setPerson, 
      socket, 
      activeUsers, 
      setActiveUsers, 
      newMessageRender,
      setNewMessageRender
      
      }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
