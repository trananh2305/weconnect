import { createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

//connect to server
export const socket = io("https://api.holetex.com", {
  autoConnect: false,
  path: "/v1/we-connect/socket.io",
});

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};
const SocketProvider = ({ children }) => {
  const token = useSelector((store) => store.auth.accessToken);
  useEffect(() => {
    socket.auth = { token };
    // if autoConnect is false, you need to manually call socket.connect()
    socket.connect();
    socket.on("connect", () => {
      console.log("connected to socket server");
    });
    socket.on("disconnect", () => {
      console.log("disconnected from socket server");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
