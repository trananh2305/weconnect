import { Outlet } from "react-router-dom";

import { Suspense } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar } from "@redux/slices/snackbarSlice";


const RootLayout = () => {
  const dispatch = useDispatch();
  // lay ra du lieu tu store
  const { open, type, message } = useSelector((state) => {
    console.log({ state });
    return state.snackbar;
  });

  return (
    <div>
      {/* Outlet la 1 component dac biet cua react de render ra cac component con */}
      {/* suspense de chia js */}
      <Suspense fallback={<p>Loading</p>}>
        <Outlet />
      </Suspense>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => {
          dispatch(closeSnackbar());
        }}
        anchorOrigin={{vertical: "top", horizontal:"right"}}
      >
        <Alert
          // onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RootLayout;
