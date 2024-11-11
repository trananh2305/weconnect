import Loading from "@components/Loading";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="bg-dark-200 flex items-center justify-center h-screen">
      <div className="bg-white text-black w-[450px] h-fit py-10 px-8">
        <img src="/weconnect-logo.png" className="mx-auto mb-6" />
        <Suspense fallback={<Loading/>}>
        {/* oulet la cac component con */}
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;
