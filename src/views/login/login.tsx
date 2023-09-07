import React, { useState, useEffect } from "react";
import "./login.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setLoginState, setToken } from "@/store/auth";
import { Button, Input } from "antd";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { message } from "@/hooks/EscapeAntd";
import { setSpaceKey } from "@/store/space";
const Login: React.FC = (props) => {
  const navigate = useNavigate();
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const login = async () => {
    let loginRes = (await api.request.post("account/loginByPassword", {
      mobileArea: "+86",
      mobile: mobile,
      password: password,
      appHigh: 1,
    })) as ResultProps;
    if (loginRes.msg === "OK") {
      localStorage.clear();
      dispatch(setSpaceKey(""));
      message.success("登录成功");
      dispatch(setToken(loginRes.data.token));
      api.setToken(loginRes.data.token);
      navigate("/home");
    }
  };
  return (
    <div className="login-content">
      <Input
        addonBefore="+86"
        placeholder="请输入手机号"
        className="login-input"
        value={mobile}
        onChange={(e) => {
          setMobile(e.target.value);
        }}
      />
      <Input.Password
        placeholder="输入密码"
        className="login-input"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <div className="login-reset">
        <div
          onClick={() => {
            dispatch(setLoginState("codeLogin"));
          }}
        >
          验证码登录
        </div>
        <div
          onClick={() => {
            dispatch(setLoginState("reset"));
          }}
        >
          找回密码
        </div>
      </div>
      <Button type="primary" className="login-button" onClick={login}>
        登录
      </Button>
      <div
        className="login-prompt"
        onClick={() => {
          dispatch(setLoginState("register"));
        }}
      >
        没有飞梭账户？<span>立即注册</span>
      </div>
    </div>
  );
};
export default Login;
