import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import HomePage from "./pages/HomePage.jsx";
// import MovieDetail from "./pages/MovieDetail.jsx"; // Correct import for MovieDetail
import RootLayout from "./pages/RootLayout.jsx";
// import TVShowDetail from "./pages/TVShowDetail.jsx";
// import ModalProvider from "./context/ModalProvider.jsx";
// import PeoplePage from "./pages/PeoplePage.jsx";
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

const HomePage = lazy(() => import("./pages/HomePage.jsx"));

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
            element: <MessagePage/>
          },
          {
            path: "/search/users",
            element: <SearchUserPage/>
          }
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
