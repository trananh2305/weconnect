import { createBrowserRouter, Navigate, } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import AuthLayout from "./pages/auth/AuthLayout.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import OTPVerifyPage from "./pages/auth/OTPVerifyPage.jsx";
import ProtectedLayOut from "@pages/ProtectedLayOut";
import RootLayout from "./pages/RootLayout.jsx";
import MessagePage from "@pages/MessagePage";
import SearchUserPage from "@pages/SearchUserPage";
import About from "@pages/profile/About";
import FriendList from "@pages/profile/FriendList";
import { lazy } from "react";
import AccountSettings from "@pages/AccountSettings.jsx";
import ChatDetail from "@components/ChatDetail.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const UserProfilePage = lazy(() => import("./pages/profile/UserProfilePage.jsx"));
export const router = createBrowserRouter([
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
              children: [
                {
                  path: ':userId',
                  element: <ChatDetail/>
                }
              ]
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
            {
              path: "/settings",
              children:[
                {
                  path: 'account',
                  element: <AccountSettings/>
                }
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