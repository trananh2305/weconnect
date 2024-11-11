import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  open: false,
  maxWidth: "xs",
  fullWidth: true,
  title: null,
  content: null,
  additionalData: {},
  action: null,
};
export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  // reducers chua  tat ca cac action
  reducers: {
    openDialog: (state, action) => {
      return { ...state, open: true, ...action.payload };
    },
    closeDialog: () => {
      // state = initialState;
      // de ghi de lai chu phia tren la gan dia chi moi
      return initialState;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
