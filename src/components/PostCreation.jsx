import { useUserInfo } from "@hooks/useUserInfo";
import { Avatar, TextField } from "@mui/material";
import { openDialog } from "@redux/slices/dialogSlice";
import { useDispatch } from "react-redux";

const PostCreation = () => {
  const userInfo = useUserInfo();
  const dispatch = useDispatch();
  return (
    <div className="bg-white shadow rounded p-4 flex gap-2">
      {/* <AccountCircle /> */}
      <Avatar className="!bg-primary-main">
        {userInfo.fullName?.[0]?.toUpperCase()}
      </Avatar>
      <TextField
        className="flex-1"
        size="small"
        placeholder="What's on your mind"
        onClick={() => {
          dispatch(
            openDialog({ title: "Example title", content: "This is content" })
          );
        }}
      />
    </div>
  );
};

export default PostCreation;
