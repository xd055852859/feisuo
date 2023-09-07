import React, { useState, useEffect } from "react";
import "@/views/left/index.scss";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import Avatar from "@/components/avatar/avatar";
import { Dropdown, Tooltip, theme } from "antd";
import { setSpaceKey } from "@/store/space";
import { Space } from "@/interface/Space";
import { PoweroffOutlined } from "@ant-design/icons";
import arrowdownSvg from "@/assets/svg/common/arrowdown.svg";
const { useToken } = theme;
const Manage: React.FC = (props) => {
  const {} = props;
  const navigate = useNavigate();
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const { token } = useToken();
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  const { spaceList, spaceKey, spaceDetail, starList } = useSelector(
    (state: RootState) => state.space
  );
  const [] = useState<number[]>([]);
  const chooseSpace = (space: Space) => {
    dispatch(setSpaceKey(space._key));
  };
  return (
    <div className="manage">
      <div className="manage-left">
        <div className="left-title">
          <Dropdown
            dropdownRender={() => (
              <div style={contentStyle} className="left-title-box">
                {spaceList?.map((item, index) => {
                  return (
                    <div
                      className="title-text"
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
                    </div>
                  );
                })}
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
            to="/manage"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e9f1ff" : "",
              color: isActive ? "#0091ff" : "",
            })}
            end
          >
            {/* <img
              src={location.pathname === "/home" ? homeLSvg : homeSvg}
              alt=""
            /> */}
            基础设置
          </NavLink>
          <NavLink
            className="menu-item"
            to="/manage/member"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e9f1ff" : "",
              color: isActive ? "#0091ff" : "",
            })}
          >
            {/* <img
              src={location.pathname === "/home/plan" ? planLSvg : planSvg}
              alt=""
            /> */}
            成员管理
          </NavLink>
          <NavLink
            className="menu-item"
            to="/manage/tag"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#e9f1ff" : "",
              color: isActive ? "#0091ff" : "",
            })}
          >
            {/* <img
              src={
                location.pathname === "/home/execute" ? executeLSvg : executeSvg
              }
              alt=""
            /> */}
            标签设置
          </NavLink>
        </div>
        <div
          className="left-bottom"
          onClick={() => {
            navigate("/home");
          }}
        >
          <Tooltip title="退出中台">
            <PoweroffOutlined />
          </Tooltip>
        </div>
      </div>
      <div className="manage-right">
        <Outlet />
      </div>
    </div>
  );
};
export default Manage;
