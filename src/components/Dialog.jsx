import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MUIDialog,
} from "@mui/material";
import { closeDialog } from "@redux/slices/dialogSlice";

import { useDispatch, useSelector } from "react-redux";

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
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>{dialog.content}</DialogContent>
      <DialogActions>{dialog.action}</DialogActions>
    </MUIDialog>
  );
};

export default Dialog;
