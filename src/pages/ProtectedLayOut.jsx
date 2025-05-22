import { saveUserInfo } from "@redux/slices/authSlice";
import { useGetAuthUserQuery } from "@services/rootApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "@components/Header";
import SocketProvider from "@context/SocketProvider";
// phan quyen bao ve
const ProtectedLayOut = () => {
  const dispatch = useDispatch();
  const response = useGetAuthUserQuery();
  useEffect(() => {
    if (response.isSuccess) {
      dispatch(saveUserInfo(response.data));
    }
  }, [response.isSuccess, response.data, dispatch]);

  return (
    <SocketProvider>
      <div>
        <Header />
        <div className="bg-dark-200">
          <Outlet />
        </div>
      </div>
    </SocketProvider>
  );
};

export default ProtectedLayOut;
