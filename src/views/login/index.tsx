import React, { useState, useEffect } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Login from "./login";
import Reset from "./reset";
const LoginIndex: React.FC = () => {
  const navigate = useNavigate();
  const loginState = useSelector((state: RootState) => state.auth.loginState);
  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      navigate("/home");
    }
  }, []);
  return (
    <div className="login">
      <div className="login-box">
        <div className="login-logo"></div>
        <div className="login-container">
          {loginState === "login" ? <Login /> : <Reset />}
        </div>
        <div className="login-bottom">登录或注册代表你同意 用户条款</div>
      </div>
    </div>
  );
};
export default LoginIndex;
