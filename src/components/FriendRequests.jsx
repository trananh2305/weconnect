import { Check, Close } from "@mui/icons-material";
import Loading from "./Loading";
import { useEffect } from "react";
import { socket } from "@context/SocketProvider";
import Button from "./Button";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetPendingRequestQuery,
} from "@services/friendApi";
import AvatarUser from "./Avatar";

const FriendRequestItem = ({ fullName, id, imageUrl }) => {
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();

  return (
    <div className="flex gap-2">
      <AvatarUser name={fullName} imageUrl={imageUrl} />
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
  const {
    data = [],
    isFetching,
    refetch,
  } = useGetPendingRequestQuery(undefined, {});

  console.log("frend requests", data);
  if (isFetching) {
    <Loading />;
  }
  useEffect(() => {
    socket.on("friendRequestReceived", (data) => {
      console.log("[friend request]", data);
      if (data.from) {
        // Refetch the data when a new friend request is received
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
        {data.slice(0, 3).map((user) => (
          <FriendRequestItem
            key={user._id}
            fullName={user.fullName}
            id={user._id}
            imageUrl={user.image || "https://placehold.co/1920x540"}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
