import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import theme from "./configs/muiConfig.js";

import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";

import { PersistGate } from "redux-persist/integration/react";
import Dialog from "@components/dialog/Dialog";
import Loading from "@components/Loading";
import { router } from "./routes";

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
