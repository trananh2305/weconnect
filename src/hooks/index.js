import { logout } from "@redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOut = () => {
    dispatch(logout());
    // xoa bo lich su duyet web trc do

    navigate("/login", { replace: true });
  };
  return { logOut };
};



export const useUserInfo = () => {
    return useSelector(state => state.auth.userInfo)
}

export const useDetectLayout = () => {
    const theme = useTheme();
    const isMediumLayout = useMediaQuery(theme.breakpoints.down("md"))
    return {isMediumLayout}
}