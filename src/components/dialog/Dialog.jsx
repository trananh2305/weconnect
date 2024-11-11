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

const DynamicContent = ({ content, additionalData }) => {
  switch (content) {
    case "NEW_POST_DIALOG":
      return <NewPostDialog userInfo={additionalData} />;

    default:
      return <p>abc</p>;
  }
};

const Dialog = () => {
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();
  return (
    <MUIDialog
      open={dialog.open}
      maxWidth={dialog.maxWidth}
      fullWidth={dialog.fullWidth}
      onClose={() => dispatch(closeDialog())}
    >
      <DialogTitle className="border-b flex justify-between items-center">
        {dialog.title}{" "}
        <IconButton onClick={() => dispatch(closeDialog())}>
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
