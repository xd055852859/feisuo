import ReactDOM from "react-dom/client";
import "./index.css";
import { store } from "./store/index";
import { Provider } from "react-redux";
import "amfe-flexible/index.js";
import { App as AntdApp, ConfigProvider } from "antd";
import EscapeAntd from "./hooks/EscapeAntd";
import Router from "@/router";
import "@/styles/common/common.scss"
import "@/styles/antd/index.scss"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#0091ff",
        },
      }}
    >
      <AntdApp>
        <EscapeAntd />
        <Router />
      </AntdApp>
    </ConfigProvider>
  </Provider>
);
