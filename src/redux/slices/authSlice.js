
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    accessToken : null,
    refreshToken: null,
    userInfo: {}

}
export const authSlice = createSlice({
    name: "auth",
    initialState,
    // reducers chua  tat ca cac action 
    reducers:{
        // login la 1 action va RTK tu hieu 
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logout: () => {
            return initialState;
            
        },
        saveUserInfo : (state, action) => {
            state.userInfo = action.payload
        }

    }
})

export const {login, logout, saveUserInfo} = authSlice.actions;
export default authSlice.reducer;