import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import type { MenuProps } from "antd";
import { Button, Dropdown, Input, Modal, theme } from "antd";
import { message } from "@/hooks/EscapeAntd";
import { PlusOutlined } from "@ant-design/icons";

import Avatar from "@/components/avatar/avatar";
import { Space } from "@/interface/Space";
import { ResultProps } from "@/interface/Common";
import { uploadFile } from "@/services/util";
import api from "@/services/api";
import {
  setSpaceDetail,
  setSpaceKey,
  setSpaceList,
  setSpaceRole,
  setStarList,
} from "@/store/space";
import { SettingOutlined } from "@ant-design/icons";

import { setUser } from "@/store/auth";
import { User } from "@/interface/User";

import arrowdownSvg from "@/assets/svg/common/arrowdown.svg";
import deleteSvg from "@/assets/svg/common/delete.svg";
import homeSvg from "@/assets/left/home.svg";
import homeLSvg from "@/assets/left/homeL.svg";
import planSvg from "@/assets/left/plan.svg";
import planLSvg from "@/assets/left/planL.svg";
import executeSvg from "@/assets/left/execute.svg";
import executeLSvg from "@/assets/left/executeL.svg";
import collectSvg from "@/assets/left/collect.svg";
import collectLSvg from "@/assets/left/collectL.svg";
import taskSvg from "@/assets/left/task.svg";
import taskLSvg from "@/assets/left/taskL.svg";
import starSvg from "@/assets/left/star.svg";
import lockSvg from "@/assets/left/lock.svg";
const { useToken } = theme;
const Left: React.FC = (props) => {
  const {} = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useToken();
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const user = useSelector((state: RootState) => state.auth.user);
  const { spaceList, spaceKey, spaceDetail, starList } = useSelector(
    (state: RootState) => state.space
  );

  const dispatch = useDispatch();
  const [spaceVisible, setSpaceVisible] = useState<boolean>(false);
  const [spaceLogo, setSpaceLogo] = useState<string>("");
  const [spaceName, setSpaceName] = useState<string>("");
  const [userVisible, setUserVisible] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");

  useEffect(() => {
    if (spaceList && spaceList.length === 1) {
      setSpaceVisible(true);
    }
  }, [spaceList]);
  useEffect(() => {
    if (spaceKey) {
      getStar();
    }
  }, [spaceKey]);
  const getStar = async () => {
    let starRes = (await api.request.get("book/lock", {
      spaceKey: spaceKey,
    })) as ResultProps;
    if (starRes.msg === "OK") {
      dispatch(setStarList(starRes.data));
    }
  };
  const createSpace = async () => {
    let createRes = (await api.request.post("space", {
      name: spaceName,
      logo: spaceLogo,
    })) as ResultProps;
    if (createRes.msg === "OK") {
      message.success("新建空间成功");
      dispatch(setSpaceKey(createRes.data._key));
      setSpaceVisible(false);
      const list = [...(spaceList as Space[])];
      list.unshift(createRes.data);
      dispatch(setSpaceList(list));
    }
  };
  const chooseSpace = (space: Space) => {
    dispatch(setSpaceKey(space._key));
  };
  const uploadImage = (file, type) => {
    let mimeType = ["image/*"];
    if (file) {
      uploadFile(file, mimeType, async (url, name) => {
        switch (type) {
          case "space":
            setSpaceLogo(url);
            break;
          case "avatar":
            setUserAvatar(url);
            break;
        }
      });
    }
  };
  const updateUser = async () => {
    let userRes = (await api.request.patch("user", {
      userName: userName,
      userAvatar: userAvatar,
    })) as ResultProps;
    if (userRes.msg === "OK") {
      //@ts-ignore
      let newUser: User = {
        userName: userName,
        userAvatar: userAvatar,
        ...user,
      };
      message.success("编辑用户成功");
      setUserVisible(false);
      dispatch(setUser(newUser));
    }
  };
  return (
    <>
      <div className="left">
        <div className="left-title">
          <Dropdown
            dropdownRender={() => (
              <div style={contentStyle} className="left-title-box">
                <div
                  className="left-user"
                  onClick={() => {
                    setUserVisible(true);
                  }}
                >
                  <div className="user-avatar">
                    <Avatar
                      avatar={user?.userAvatar}
                      name={user?.userName}
                      type="person"
                      index={0}
                    />
                  </div>
                  <div className="user-name">{user?.userName}</div>
                </div>
                {spaceList?.map((item, index) => {
                  return (
                    <div
                      className="title-text dp-space-center"
                      onClick={() => {
                        chooseSpace(item);
                      }}
                      key={"space" + index}
                    >
                      <div className="title-logo">
                        <Avatar
                          avatar={item.logo}
                          name={item.name}
                          type="group"
                          index={0}
                        />
                      </div>
                      {item.name}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setSpaceKey(item._key));
                          navigate("/manage");
                        }}
                      >
                        <SettingOutlined />
                      </div>
                    </div>
                  );
                })}

                <div
                  className="title-button"
                  onClick={() => {
                    setSpaceVisible(true);
                  }}
                >
                  <Button type="primary" style={{ width: "100%" }}>
                    新建空间
                  </Button>
                </div>
              </div>
            )}
          >
            <div className="title-text">
              <div className="title-logo">
                <Avatar
                  avatar={spaceDetail?.spaceInfo.logo}
                  name={spaceDetail?.spaceInfo.name}
                  type="group"
                  index={0}
                />
              </div>
              {spaceDetail?.spaceInfo.name}
              <img
                className="title-arrow"
                src={arrowdownSvg}
                alt=""
                style={{ marginLeft: "5px" }}
              />
            </div>
          </Dropdown>
        </div>
        <div className="left-menu">
          <NavLink
            className="menu-item"
            to="/home"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e9f1ff" : "",
              color: isActive ? "#0091ff" : "",
            })}
            end
          >
            <img
              src={location.pathname === "/home" ? homeLSvg : homeSvg}
              alt=""
            />
            首页
          </NavLink>
          <NavLink
            className="menu-item"
            to="/home/plan"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e9f1ff" : "",
              color: isActive ? "#0091ff" : "",
            })}
          >
            <img
              src={location.pathname === "/home/plan" ? planLSvg : planSvg}
              alt=""
            />
            计划
          </NavLink>
          <NavLink
            className="menu-item"
            to="/home/execute"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e9f1ff" : "",
              color: isActive ? "#0091ff" : "",
            })}
          >
            <img
              src={
                location.pathname === "/home/execute" ? executeLSvg : executeSvg
              }
              alt=""
            />
            复盘
          </NavLink>

          <NavLink
            className="menu-item"
            to="/home/collect"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e9f1ff" : "",
              color: isActive ? "#0091ff" : "",
            })}
          >
            <img
              src={
                location.pathname === "/home/collect" ? collectLSvg : collectSvg
              }
              alt=""
            />
            收藏
          </NavLink>
          <NavLink
            className="menu-item"
            to="/home/task"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e9f1ff" : "",
              color: isActive ? "#0091ff" : "",
            })}
          >
            <img
              src={location.pathname === "/home/task" ? taskLSvg : taskSvg}
              alt=""
            />
            任务
          </NavLink>
        </div>
        <div className="left-star">
          <div className="star-title">
            <img src={starSvg} alt="" />
            复盘
          </div>
          {starList.map((starItem, starIndex) => {
            return (
              <div
                className="star-item"
                key={"star" + starIndex}
                onClick={() => {
                  navigate(`/boardView/${starItem._key}`);
                }}
              >
                <img src={lockSvg} alt="" />
                {starItem.name}
              </div>
            );
          })}
        </div>
        <div className="left-bottom">
          <img className="bottom-icon" src={deleteSvg} alt="" />
          回收站
        </div>
      </div>
      <Modal
        title="新建空间"
        open={spaceVisible}
        onOk={createSpace}
        onCancel={() => {
          setSpaceVisible(false);
        }}
        okText={"新建"}
        cancelText={"取消"}
        destroyOnClose
      >
        <div className="space-create">
          <div className="create-logo">
            <div className="upload-button upload-img-button logo-box">
              {spaceLogo ? (
                <img
                  src={spaceLogo}
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                  className="upload-cover"
                />
              ) : (
                <PlusOutlined className="logo-item" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  //@ts-ignore
                  uploadImage(e.target.files[0], "space");
                }}
                className="upload-img"
              />
            </div>
          </div>
          <div className="create-name">
            <Input
              placeholder="请输入空间名称"
              value={spaceName}
              onChange={(e) => {
                setSpaceName(e.target.value);
              }}
            />
          </div>
        </div>
      </Modal>
      <Modal
        title="用户设置"
        open={userVisible}
        onOk={updateUser}
        onCancel={() => {
          setUserVisible(false);
        }}
        okText={"确认"}
        cancelText={"取消"}
        destroyOnClose
      >
        <div className="space-create">
          <div className="create-logo">
            <div className="upload-button upload-img-button logo-box">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                  className="upload-cover"
                />
              ) : (
                <PlusOutlined className="logo-item" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  //@ts-ignore
                  uploadImage(e.target.files[0], "avatar");
                }}
                className="upload-img"
              />
            </div>
          </div>
          <div className="create-name">
            <Input
              placeholder="请输入用户名"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Left;
