//  import { createContext, useContext } from "react";
// import io from "socket.io-client";
// import { server } from "./constant/config";

// // Create a SocketContext
// const SocketContext = createContext();

// // Create a custom hook to access the socket instance 
// export const getSocket = () => useContext(SocketContext);

// // Initialize socket instance directly
// const socket = io(`http://localhost:3000`, { 
//   withCredentials: true,
//        reconnection: true,  });


// export const SocketProvider = ({ children }) => {
//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// //! export { SocketProvider, getSocket };

import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { server } from "./constant/config";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const getSocket = () => useContext(SocketContext);

// Initialize socket instance outside of the component
const socket = io(`${server}`, {
  withCredentials: true,
  reconnection: true,
  autoConnect: false // We'll manage connection manually
});

export const SocketProvider = ({ children }) => {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {isAuthenticated } = useSelector((state)=>state.auth)
  
  const connect = () => {
    if (!socket.connected) {
      console.log("connection attempt")
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket.connected) {
      console.log("disconnect")
      socket.disconnect();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated]);

  const value = {
    socket,
    // isAuthenticated,
    connect,
    disconnect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
