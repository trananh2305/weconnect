
import { rootApi } from "@services/rootApi";
import { logout } from "./slices/authSlice";
import { persistor } from "./store";

export const logOutMiddleware = (store) => {
  return (next) => {
    return (action) => {
      if (action.type === logout.type) {
        // Reset the API state when the user logs out
        store.dispatch(rootApi.util.resetApiState());
        // Clear the cache when the user logs out
        persistor.purge();

      }
      return next(action);
    };
  };
};
