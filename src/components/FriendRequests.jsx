import { Check, Close } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetPendingRequestQuery,
} from "@services/rootApi";
import Loading from "./Loading";
import { useEffect } from "react";
import { socket } from "@context/SocketProvider";
import Button from "./Button";

const FriendRequestItem = ({ fullName, id }) => {
  const [acceptFriendRequest, { isLoading: isAccepting}] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling}] =
    useCancelFriendRequestMutation();
  return (
    <div className="flex gap-2">
      <Avatar className="!bg-primary-main">
        {fullName?.[0].toUpperCase()}
      </Avatar>
      <div className="space-x-1 mt-2">
        <p className="font-bold">{fullName}</p>
        <Button
          variant="contained"
          onClick={() => acceptFriendRequest(id)}
          icon={<Check className="mr-1" fontSize="small" />}
          isLoading={isAccepting}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          onClick={() => cancelFriendRequest(id)}
          icon={<Close className="mr-1" fontSize="small" />}
          isLoading={isCanceling}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

const FriendRequests = () => {
  const { data = [], isFetching, refetch } = useGetPendingRequestQuery();
  if (isFetching) {
    <Loading />;
  }
  useEffect(() => {
    socket.on("friendRequestReceived", (data) => {
      console.log("[friend request]", data);
      if (data.from) {
        refetch();
      }
    });
    return () => {
      socket.off("friendRequestReceived");
    };
  }, []);
  return (
    <div className="card">
      <p className="font-bold mb-4">Friend Requests</p>
      <div className="space-y-4">
        {data.slice(0, 3).map((user) => {
          <FriendRequestItem
            key={user._id}
            fullName={user.fullName}
            id={user._id}
          />;
        })}
      </div>
    </div>
  );
};

export default FriendRequests;
