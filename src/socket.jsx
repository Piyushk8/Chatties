import { createContext,useContext } from "react";
import io from "socket.io-client";
import { server } from "./constant/config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);
const socket =   io(`http://localhost:3000`, { withCredentials: true });

const SocketProvider = ({ children }) => {
 
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};




export { SocketProvider, getSocket };

