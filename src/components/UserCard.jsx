import { socket } from "@context/SocketProvider";
import { Check, Close, MessageOutlined, PersonAdd } from "@mui/icons-material";
import { Avatar, Button as MUIButton, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "./Button";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@services/friendApi";

const UserCard = ({
  id,
  isFriend,
  fullName = "",
  requestSent,
  requestReceived,
}) => {
  const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation();
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();
  function getActionButtons() {
    if (isFriend) {
      return (
        <MUIButton variant="contained" size="small">
          {" "}
          <MessageOutlined className="mr-1" fontSize="small" /> Message
        </MUIButton>
      );
    }

    if (requestSent) {
      return (
        <MUIButton variant="outlined" size="small" disabled>
          {" "}
          <Check className="mr-1" fontSize="small" /> Request Sent
        </MUIButton>
      );
    }

    if (requestReceived) {
      return (
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
      );
    }

    return (
      <MUIButton
        variant="outlined"
        size="small"
        onClick={async () => {
          //unwrap is used to get the actual value from the promise
          await sendFriendRequest(id).unwrap();
          socket.emit("friendRequestSent", { reciverId: id });
        }}
        disabled={isLoading}
      >
        {" "}
        {isLoading ? (
          <CircularProgress className="mr-1 animate-spin" size="16px" />
        ) : (
          <PersonAdd className="mr-1" fontSize="small" />
        )}{" "}
        Add Friend
      </MUIButton>
    );
  }

  return (
    <div className="card  flex flex-col items-center">
      <Avatar className="!bg-primary-main !w-12 !h-12 mb-3">
        {fullName[0]?.toUpperCase()}
      </Avatar>
      <Link className="font-bold text-lg">{fullName} </Link>
      <div className="mt-4">{getActionButtons()}</div>
    </div>
  );
};

export default UserCard;
