import React, { useState, useEffect } from "react";
import "./reset.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "antd";
import { setLoginState, setToken } from "@/store/auth";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { message } from "@/hooks/EscapeAntd";
import { setSpaceKey } from "@/store/space";
const Reset: React.FC = (props) => {
  const loginState = useSelector((state: RootState) => state.auth.loginState);
  const {} = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [codeState, setCodeState] = useState<boolean>(false);
  const [codeTime, setCodeTime] = useState<number>(60);
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const getCode = async () => {
    const codeRes = (await api.request.post("account/vertifyCode", {
      mobileArea: "+86",
      mobile: mobile,
      source: loginState === "register" ? 1 : loginState === "reset" ? 3 : 2,
    })) as ResultProps;
    if (codeRes.msg === "OK") {
      message.success("发送成功");
      setCodeState(true);
      let timer = setInterval(() => {
        setCodeTime((prevTime) => {
          if (prevTime === 0) {
            setCodeState(false);
            clearInterval(timer);
            return 60;
          }
          prevTime = prevTime - 1;
          return prevTime;
        });
      }, 1000);
    }
  };
  const changeState = async () => {
    if (loginState === "register") {
      const registerRes = (await api.request.post("account", {
        mobileArea: "+86",
        mobile: mobile,
        password: password,
        code: code,
      })) as ResultProps;
      if (registerRes.msg === "OK") {
        message.success("注册成功");
        dispatch(setLoginState("login"));
      }
    } else if (loginState === "reset") {
      const registerRes = (await api.request.patch("account/pwdSet", {
        mobileArea: "+86",
        mobile: mobile,
        password: password,
        code: code,
      })) as ResultProps;
      if (registerRes.msg === "OK") {
        message.success("重置密码成功");
        dispatch(setLoginState("login"));
      }
    } else if (loginState === "codeLogin") {
      const registerRes = (await api.request.get("account/getTempToken", {
        mobileArea: "+86",
        mobile: mobile,
        code: code,
      })) as ResultProps;
      if (registerRes.msg === "OK") {
        localStorage.clear();
        dispatch(setSpaceKey(""));
        message.success("登录成功");
        dispatch(setToken(registerRes.data.token));
        api.setToken(registerRes.data.token);
        navigate("/home");
      }
    }
  };
  return (
    <div className="reset-content">
      <Input
        addonBefore="+86"
        placeholder="请输入手机号"
        className="login-input"
        value={mobile}
        onChange={(e) => {
          setMobile(e.target.value);
        }}
      />
      <div className="reset-code">
        <Input
          placeholder="输入验证码"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <Button className="reset-button" onClick={getCode} disabled={codeState}>
          {codeState ? `剩余${codeTime}秒` : "获取验证码"}
        </Button>
      </div>
      {loginState !== "codeLogin" && (
        <Input.Password
          placeholder="输入密码"
          className="login-input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      )}
      <Button type="primary" className="login-button" onClick={changeState}>
        {loginState === "register"
          ? "注册账号"
          : loginState === "reset"
          ? "重置密码"
          : "验证码登录"}
      </Button>

      {loginState === "register" ? (
        <div
          className="login-prompt"
          onClick={() => {
            dispatch(setLoginState("login"));
          }}
        >
          已有账号？<span>直接登录</span>
        </div>
      ) : (
        <div
          className="login-prompt"
          onClick={() => {
            dispatch(setLoginState("register"));
          }}
        >
          没有飞梭账户？<span>立即注册</span>
        </div>
      )}
    </div>
  );
};
export default Reset;
