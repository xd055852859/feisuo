import { useState } from "react";
import "./App.scss";
import { RootState } from "@/store";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "./store/auth";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { setUser } from "@/store/auth";
import {
  setSpaceDetail,
  setSpaceKey,
  setSpaceList,
  setSpaceMemberList,
  setSpaceRole,
} from "@/store/space";
import { setBoardList } from "@/store/board";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const spaceKey = useSelector((state: RootState) => state.space.spaceKey);
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      let token = localStorage.getItem("auth_token") as string;
      dispatch(setToken(token));
      api.setToken(token);
      // navigate("/home");
    } else {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    if (token) {
      getUser();
      getSpaceList();
    }
  }, [token]);
  useEffect(() => {
    if (spaceKey) {
      getSpace();
      getSpaceMemberList();
    }
  }, [spaceKey]);
  const getUser = async () => {
    let userRes = (await api.request.get("user")) as ResultProps;
    if (userRes.msg === "OK") {
      dispatch(setUser(userRes.data));
      if (localStorage.getItem("spaceKey")) {
        dispatch(setSpaceKey(localStorage.getItem("spaceKey") as string));
      } else {
        dispatch(setSpaceKey(userRes.data.privateSpace));
      }
    }
  };
  const getSpaceList = async () => {
    let spaceRes = (await api.request.get("space")) as ResultProps;
    if (spaceRes.msg === "OK") {
      dispatch(setSpaceList(spaceRes.data));
    }
  };
  const getSpaceMemberList = async () => {
    let memberRes = (await api.request.get("spaceMember", {
      spaceKey: spaceKey,
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      dispatch(setSpaceMemberList(memberRes.data));
    }
  };
  const getSpace = async () => {
    let spaceRes = (await api.request.get("space/home", {
      spaceKey: spaceKey,
    })) as ResultProps;
    if (spaceRes.msg === "OK") {
      dispatch(setSpaceDetail(spaceRes.data));
      dispatch(setSpaceRole(spaceRes.data.role));
      dispatch(setBoardList(spaceRes.data.bookList));
    } else if (spaceRes.status === 202) {
      dispatch(setSpaceKey(user?.privateSpace as string));
      localStorage.removeItem("spaceKey");
    }
  };
  return <Outlet />;
};

export default App;
