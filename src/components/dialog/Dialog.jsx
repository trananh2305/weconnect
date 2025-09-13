import {
  DialogContent,
  DialogTitle,
  IconButton,
  Dialog as MUIDialog,
} from "@mui/material";
import { closeDialog } from "@redux/slices/dialogSlice";

import { useDispatch, useSelector } from "react-redux";

import { Close } from "@mui/icons-material";
import NewPostDialog from "./NewPostDialog";
import IncomingCallDialog from "./IncomingCallDialog";
import { useVideoCallContext } from "@context/VideoCallProvider";

const DynamicContent = ({ content, additionalData }) => {
  switch (content) {
    case "NEW_POST_DIALOG":
      return <NewPostDialog userInfo={additionalData} />;
    case "INCOMING_CALL_DIALOG":
      return <IncomingCallDialog/>  
    default:
      return <p>abc</p>;
  }
};

const Dialog = () => {
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();

  const {rejectCall} = useVideoCallContext();
  
  const close = () => {
    dispatch(closeDialog());
    if(dialog.closeActionType === "CALL_REJECTED"){
      rejectCall();
    }
  }
  return (
    <MUIDialog
      open={dialog.open}
      maxWidth={dialog.maxWidth}
      fullWidth={dialog.fullWidth}
      onClose={close}
    >
      <DialogTitle className="border-b flex justify-between items-center">
        {dialog.title}{" "}
        <IconButton onClick={close}>
          <Close className="text-red-400" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="!pt-4">
        <DynamicContent
          content={dialog.content}
          additionalData={dialog.additionalData}
        />
      </DialogContent>
    </MUIDialog>
  );
};

export default Dialog;
