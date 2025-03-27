import { generateNotificationMessage } from "@libs/utils";
import { openSnackbar } from "@redux/slices/snackbarSlice";
import { rootApi } from "@services/rootApi";
import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const dispatch = useDispatch();
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

  useEffect(() => {
    if (!socket) return;

    socket.on("CREATE_NOTIFICATION_REQUEST", (data) => {
      dispatch(
        rootApi.util.updateQueryData("getNotifications", undefined, (draft) => {
          draft.notifications.unshift(data);
        })
      );
      dispatch(openSnackbar({ message: generateNotificationMessage(data), type: "info" }));
    });

    return () => {
      socket.off("CREATE_NOTIFICATION_REQUEST");
    };
  }, []);
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
