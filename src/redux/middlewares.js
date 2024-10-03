
import { logout } from "./slices/authSlice";
import { persistor } from "./store";

export const logOutMiddleware = () => {
  return (next) => {
    return (action) => {
      if (action.type === logout.type) {
        persistor.purge();
      }
      return next(action);
    };
  };
};
