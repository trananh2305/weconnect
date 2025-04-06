import { socket } from "@context/SocketProvider";
import {
  Check,
  Close,
  MessageOutlined,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import { Avatar, Button as MUIButton, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "./Button";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
  useUnFriendRequestMutation,
} from "@services/friendApi";

export function UserActionButton({
  isFriend,
  requestSent,
  requestReceived,
  fullName,
  userId,
}) {
  const [sendFriendRequest, { isLoading: isAdding }] =
    useSendFriendRequestMutation();
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();
  const [unFriendRequest, { isLoading: isUnFriending }] =
    useUnFriendRequestMutation();

  if (isFriend) {
    return (
      <div className="space-x-1 mt-2">
        <Button
          variant="outlined"
          size="small"
          icon={<PersonRemove className="mr-1" fontSize="small" />}
          onClick={async () => {
            //unwrap is used to get the actual value from the promise
            await unFriendRequest(userId).unwrap();
          }}
          isLoading={isUnFriending}
        >
          {" "}
          UnFriend
        </Button>
        <Button
          variant="contained"
          size="small"
          icon={<MessageOutlined className="mr-1" fontSize="small" />}
        >
          {" "}
          Message
        </Button>
      </div>
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
          onClick={() => acceptFriendRequest(userId)}
          icon={<Check className="mr-1" fontSize="small" />}
          isLoading={isAccepting}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          onClick={() => cancelFriendRequest(userId)}
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
        await sendFriendRequest(userId).unwrap();
        socket.emit("friendRequestSent", { reciverId: userId });
      }}
      disabled={isAdding}
    >
      {" "}
      {isAdding ? (
        <CircularProgress className="mr-1 animate-spin" size="16px" />
      ) : (
        <PersonAdd className="mr-1" fontSize="small" />
      )}{" "}
      Add Friend
    </MUIButton>
  );
}

const UserCard = ({
  id,
  isFriend,
  fullName = "",
  requestSent,
  requestReceived,
  isShowAcctionBtn = true,
}) => {
  return (
    <div className="card  flex flex-col items-center">
      <Avatar className="!bg-primary-main !w-12 !h-12 mb-3">
        {fullName[0]?.toUpperCase()}
      </Avatar>
      <Link to={`/users/${id}`} className="font-bold text-lg">
        {fullName}{" "}
      </Link>
      {isShowAcctionBtn && (
        <div className="mt-4">
          <UserActionButton
            isFriend={isFriend}
            requestSent={requestSent}
            requestReceived={requestReceived}
            fullName={fullName}
            userId={id}
          />
        </div>
      )}
    </div>
  );
};

export default UserCard;
