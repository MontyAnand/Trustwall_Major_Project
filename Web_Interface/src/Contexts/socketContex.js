import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a Context
const SocketContext = createContext();

// Custom Hook to use the socket
export const useSocket = () => useContext(SocketContext);

// Socket Provider Component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const newSocket = io("http://127.0.0.1:5000"); // Connect to the backend

    newSocket.on('connect',()=>{
        setSocketId(newSocket.id);
        // console.log(newSocket.id);
        // console.log(socketId);
    });

    newSocket.on("disconnect", () => {
        setSocketId(null);
      });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, socketId }}>
      {children}
    </SocketContext.Provider>
  );
};
