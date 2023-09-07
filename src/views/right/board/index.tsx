import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import {
  PlusOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  MoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/header/header";
import { Button, Drawer, Dropdown, Input, Modal, Select, Switch } from "antd";
import { uploadFile } from "@/services/util";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { message } from "@/hooks/EscapeAntd";
import { setBoardList } from "@/store/board";
import { Board as BoardInterface } from "@/interface/Board";

import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import Avatar from "@/components/avatar/avatar";
import SpaceMember from "@/views/home/spaceMember";
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const { confirm } = Modal;
const Board: React.FC = (props) => {
  const {} = props;
  const navigate = useNavigate();
  const spaceKey = useSelector((state: RootState) => state.space.spaceKey);
  const boardList = useSelector((state: RootState) => state.board.boardList);
  const dispatch = useDispatch();
  const [tagList, setTagList] = useState<any>([]);
  const [tagKey, setTagKey] = useState<string>("");
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [tagVisible, setTagVisible] = useState<boolean>(false);
  const [boardLogo, setBoardLogo] = useState<string>("");
  const [boardName, setBoardName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [noVerify, setNoVerify] = useState<boolean>(false);
  const [showInHomePage, setShowInHomePage] = useState<boolean>(true);
  const [defaultRole, setDefaultRole] = useState<number>(4);
  const [memberVisible, setMemberVisible] = useState<boolean>(false);
  const dropMenu: MenuProps["items"] = [
    {
      key: "collect",
      label: "收藏",
    },
    {
      key: "star",
      label: "星标",
    },
    {
      key: "showInHomePage",
      label: "取消首页显示",
    },
  ];
  const checkSameName = async () => {
    let boardRes = (await api.request.get("book/sameName", {
      spaceKey: spaceKey,
      name: boardName,
    })) as ResultProps;
    if (boardRes.msg === "OK") {
      if (boardRes.data) {
        confirm({
          title: "重名知识库",
          content: "有重名知识库，是否加入",
          okText: "加入",
          cancelText: "创建",
          onOk() {
            joinBoard(boardRes.data._key);
          },
          onCancel() {
            createBoard();
          },
        });
      } else {
        createBoard();
      }
    }
  };
  const createBoard = async () => {
    let boardRes = (await api.request.post("book", {
      spaceKey: spaceKey,
      name: boardName,
      logo: boardLogo,
      isPublic,
      noVerify,
      showInHomePage,
      defaultRole,
      tagKey,
    })) as ResultProps;
    if (boardRes.msg === "OK") {
      let list = _.cloneDeep(boardList);
      message.success("创建知识库成功");
      list.push(boardRes.data);
      dispatch(setBoardList(list));
      setInfoVisible(false);
      clearBoard();
    }
  };
  const clearBoard = () => {
    setBoardName("");
    setBoardLogo("");
    setIsPublic(false);
    setNoVerify(false);
    setShowInHomePage(true);
    setDefaultRole(4);
    setTagKey("");
  };
  const deleteBoard = async (index) => {
    let list = _.cloneDeep(boardList);
    confirm({
      title: "删除知识库",
      content: "是否删除知识库",
      okText: "确认",
      cancelText: "取消",
      async onOk() {
        let boardRes = (await api.request.delete("book", {
          bookKey: list[index],
        })) as ResultProps;
        if (boardRes.msg === "OK") {
          message.success("删除知识库成功");
          list.splice(index, 1);
          dispatch(setBoardList(list));
        }
      },
    });
  };
  const uploadImage = (file, type) => {
    let mimeType = ["image/*"];
    if (file) {
      uploadFile(file, mimeType, async (url, name) => {
        switch (type) {
          case "logo":
            setBoardLogo(url);
            break;
        }
      });
    }
  };
  const joinBoard = async (key: string) => {};
  const operateBoard = async (boardItem, key, boardIndex) => {
    let list = _.cloneDeep(boardList);
    switch (key) {
      case "collect":
        let collectRes = (await api.request.patch("book/fav", {
          bookKey: boardItem._key,
          fav: !boardItem.hasFav,
        })) as ResultProps;
        if (collectRes.msg === "OK") {
          message.success("收藏知识库成功");
          list[boardIndex].hasFav = !boardItem.hasFav;
        }
        break;
      case "star":
        let starRes = (await api.request.patch("book/lock", {
          bookKey: boardItem._key,
          lock: !boardItem.lock,
        })) as ResultProps;
        if (starRes.msg === "OK") {
          message.success("设置星标成功");
          list[boardIndex].lock = !boardItem.lock;
        }
        break;
      case "showInHomePage":
        let boardRes = (await api.request.patch("book/showInHomePage", {
          bookKey: boardItem._key,
          showInHomePage: !boardItem.showInHomePage,
        })) as ResultProps;
        if (boardRes.msg === "OK") {
          message.success("取消首页显示成功");
          list.splice(boardIndex, 1);
        }
        break;
    }
    dispatch(setBoardList(list));
  };
  const getTag = async () => {
    const dataRes = (await api.request.get("tag", {
      spaceKey: spaceKey,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      setTagList(dataRes.data);
      setTagVisible(true);
    }
  };
  return (
    <div className="board">
      <Header title="首页">
        <div
          className="button-img"
          onClick={() => {
            navigate("/boardSet");
          }}
        >
          <SettingOutlined />
        </div>
        <div
          className="button-img"
          onClick={() => {
            setMemberVisible(true);
          }}
        >
          <TeamOutlined />
        </div>
        <div
          className="button-img"
          onClick={() => {
            getTag();
          }}
        >
          <PlusCircleOutlined />
        </div>

        <div className="button-img">
          <SearchOutlined />
        </div>
      </Header>
      <div className="board-box">
        {boardList &&
          boardList.map((item, index) => {
            return (
              <div
                className="board-item"
                key={"board" + index}
                onClick={() => {
                  navigate(`/boardView/${item._key}`);
                }}
              >
                <div className="item-top">
                  <div className="top-left">
                    <Avatar
                      avatar={item.logo}
                      name={item.name}
                      type="person"
                      index={index}
                    />
                  </div>
                  <div className="top-right">{item.name}</div>
                  <div className="top-button">
                    <Dropdown
                      menu={{
                        items: dropMenu,
                        onClick: (menuItem) => {
                          console.log(menuItem);
                          menuItem.domEvent.stopPropagation();
                          operateBoard(item, menuItem.key, index);
                        },
                      }}
                    >
                      <div className="top-icon">
                        <MoreOutlined />
                      </div>
                    </Dropdown>
                  </div>
                </div>
                <div className="item-bottom">
                  {dayjs(item.updateTime).fromNow()} 更新
                </div>
                <div className="item-button">
                  <div></div>
                </div>
              </div>
            );
          })}
      </div>
      <Modal
        open={tagVisible}
        title="选择视图"
        footer={null}
        destroyOnClose
        centered
        onCancel={() => {
          setTagVisible(false);
        }}
        width="8.3rem"
      >
        <div className="tag-box">
          {tagList.map((item, index) => {
            return (
              <div
                key={"tag" + index}
                onClick={() => {
                  setTagKey(item._key);
                  setInfoVisible(true);
                  setTagVisible(false);
                }}
                className="tag-box-item"
              >
                <div className="tag-box-icon">
                  <img src={item.icon} alt="" />
                </div>
                <div className="tag-box-name">{item.name}</div>
              </div>
            );
          })}
        </div>
      </Modal>
      <Drawer
        title="新建知识库"
        placement="right"
        onClose={() => {
          setInfoVisible(false);
        }}
        open={infoVisible}
        bodyStyle={{ padding: "12px 24px" }}
        destroyOnClose
      >
        <div className="board-create form">
          <div className="board-logo">
            <div className="upload-button upload-img-button logo-box">
              {boardLogo ? (
                <img
                  src={boardLogo}
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
                  uploadImage(e.target.files[0], "logo");
                }}
                className="upload-img"
              />
            </div>
          </div>
          <div className="board-name">
            <Input
              placeholder="请输入知识库名称"
              value={boardName}
              onChange={(e) => {
                setBoardName(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="form-left">内部公开,内部成员免审核加入</div>
            <div className="form-right">
              <Switch
                checked={noVerify}
                onChange={(checked) => {
                  setNoVerify(checked);
                }}
              />
            </div>
          </div>
          <div>
            <div className="form-left">外部公开,全网免登录可查看</div>
            <div className="form-right">
              <Switch
                checked={isPublic}
                onChange={(checked) => {
                  setIsPublic(checked);
                }}
              />
            </div>
          </div>
          <div>
            <div className="form-left">设为首页</div>
            <div className="form-right">
              <Switch
                checked={showInHomePage}
                onChange={(checked) => {
                  setShowInHomePage(checked);
                }}
              />
            </div>
          </div>
          <div>
            <div className="form-left">视图</div>
            <div className="form-right">
              <Select
                value={tagKey}
                onChange={(value) => {
                  setDefaultRole(+value);
                }}
                options={tagList.map((item, index) => {
                  return { value: item._key, label: item.name };
                })}
              />
            </div>
          </div>
          <div>
            <div className="form-left">新成员默认权限</div>
            <div className="form-right">
              <Select
                value={defaultRole}
                onChange={(value) => {
                  setDefaultRole(+value);
                }}
                options={[
                  { value: 2, label: "编辑（可改）" },
                  { value: 3, label: "作者（可新增节点）" },
                  { value: 4, label: "成员（只读）" },
                ]}
              />
            </div>
          </div>
          <div className="form-save">
            <Button
              type="primary"
              style={{ width: "70%" }}
              onClick={() => {
                checkSameName();
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </Drawer>
      <Drawer
        title="伙伴"
        placement="right"
        onClose={() => {
          setMemberVisible(false);
        }}
        open={memberVisible}
        bodyStyle={{ padding: "12px 24px" }}
        destroyOnClose
      >
        <SpaceMember />
      </Drawer>
    </div>
  );
};
export default Board;
