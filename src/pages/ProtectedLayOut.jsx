import { useGetAuthUserQuery } from "@services/rootApi";
import { Navigate, Outlet } from "react-router-dom";
// phan quyen bao ve
const ProtectedLayOut = () => {
  const response = useGetAuthUserQuery();
  console.log({ response });
  if (!response?.data?._id) {
    return <Navigate to="/login" />;
  }
  if (response.isLoading) {
    return <p>Loading..</p>;
  }
  if(response.error?.code === 401){
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedLayOut;
