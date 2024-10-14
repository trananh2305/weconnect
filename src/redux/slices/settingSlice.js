import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isShowDrawer: true,
};
export const settingSlice = createSlice({
  name: "settings",
  initialState,
  // reducers chua  tat ca cac action
  reducers: {
    toggleDrawer: (state) => {
      state.isShowDrawer = !state.isShowDrawer
    },
    
  },
});

export const { toggleDrawer} = settingSlice.actions;
export default settingSlice.reducer;
