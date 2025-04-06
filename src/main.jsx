import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout.jsx";
import { lazy } from "react";
import { ThemeProvider } from "@emotion/react";
import theme from "./configs/muiConfig.js";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import AuthLayout from "./pages/auth/AuthLayout.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import OTPVerifyPage from "./pages/auth/OTPVerifyPage.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";
import ProtectedLayOut from "@pages/ProtectedLayOut";
import { PersistGate } from "redux-persist/integration/react";
import Dialog from "@components/dialog/Dialog";
import Loading from "@components/Loading";
import MessagePage from "@pages/MessagePage";
import SearchUserPage from "@pages/SearchUserPage";
import About from "@pages/profile/About";
import FriendList from "@pages/profile/FriendList";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const UserProfilePage = lazy(() => import("./pages/profile/UserProfilePage"));

const router = createBrowserRouter([
  {
    // de hien thi chung cho toan bo trang
    element: <RootLayout />,
    // tung trang rieng
    children: [
      {
        element: <ProtectedLayOut />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/messages",
            element: <MessagePage />,
          },
          {
            path: "/search/users",
            element: <SearchUserPage />,
          },
          {
            path: "/users/:userId",
            element: <UserProfilePage />,
            children: [
              // định nghĩa route mặc định
              {
                index: true,
                element: <Navigate to ='about' replace/>
              },
              {
                path: "about",
                element: <About/>
              },
              {
                path: "friends",
                element: <FriendList/>
              },
            ]
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/verify-otp",
            element: <OTPVerifyPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <ThemeProvider theme={theme}>
        {/* <ModalProvider> */}
        <RouterProvider router={router}></RouterProvider>
        <Dialog />
        {/* </ModalProvider> */}
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
