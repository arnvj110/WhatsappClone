// src/components/context/AccountProvider.jsx
import React, { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [person, setPerson] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [newMessageRender, setNewMessageRender] = useState(false);
  
  const socket = useRef();
  
  const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    // Connect to socket
    socket.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    
    console.log("✅ Socket connected to:", SOCKET_URL);
    
    // Listen for active users updates
    socket.current.on('getUsers', (users) => {
      setActiveUsers(users);
      console.log("📊 Active users updated:", users.length);
    });
    
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log("❌ Socket disconnected");
      }
    };
  }, [SOCKET_URL]);

  // Add user to socket when account changes
  useEffect(() => {
    if (account && socket.current) {
      socket.current.emit('addUsers', account);
      console.log("👤 User added to socket:", account.name);
    }
  }, [account]);

  const value = {
    account,
    setAccount,
    person,
    setPerson,
    socket,
    activeUsers,
    setActiveUsers,
    newMessageRender,
    setNewMessageRender
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;