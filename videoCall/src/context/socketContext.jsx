import { useState } from 'react';
import { useEffect } from 'react';
import { createContext, useContext } from 'react'
import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';

const socketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {

    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }

    const newSocket = io('http://localhost:5000', {
      query: { userId }
    });

    console.log("Connecting socket for user:", userId);

    newSocket.on("connect", () => {
      console.log("Socket connected with ID:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("User disconnected!");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };

  }, []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  )
}

export const useSocketContext = () => {
  return useContext(socketContext);
}




























