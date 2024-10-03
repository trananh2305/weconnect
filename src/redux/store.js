import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import snackbarReducer from "./slices/snackbarSlice";
import { rootApi } from "@services/rootApi";
import storage from "redux-persist/lib/storage"; //mac dinh dung web thi la local storage
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { logOutMiddleware } from "./middlewares";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [rootApi.reducerPath],
};
// dung de luu du lieu len local storage
const persistedReducer = persistReducer(
  persistConfig,
  //   gom lai thanh 1 reducer duy nhat vi tham so thu 2 la can phai co reducer function
  combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  })
);
export const store = configureStore({
  reducer: persistedReducer,
  // tim hieu redux saga
  middleware: (getDefaultMidleware) => {
    return getDefaultMidleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logOutMiddleware, rootApi.middleware);
  },
});

export const persistor = persistStore(store);
