import { Outlet } from "react-router-dom";

import { Suspense } from "react";

const RootLayout = () => {
  return (
    <div>
      {/* Outlet la 1 component dac biet cua react de render ra cac component con */}
      {/* suspense de chia js */}
      <Suspense fallback={<p>Loading</p>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootLayout;
