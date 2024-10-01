import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import snackbarReducer from "./slices/snackbarSlice";
import { rootApi } from "@services/rootApi";
export const store = configureStore({
    reducer: {
        // lay Slice ra de dung
        auth: authReducer,
        snackbar:snackbarReducer,
        [rootApi.reducerPath]:rootApi.reducer
    },
    middleware: (getDefaultMidleware) => {
        return getDefaultMidleware().concat(rootApi.middleware)
    }

})