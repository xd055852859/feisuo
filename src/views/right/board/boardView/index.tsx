import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api";
import { TeamOutlined, LeftOutlined } from "@ant-design/icons";
import { ResultProps } from "@/interface/Common";
import {
  setBoardDetail,
  setBoardKey,
  setBoardMemberList,
  setBoardRole,
} from "@/store/board";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { setNodes, setSelectedId, setStartId } from "@/store/node";
import { Button, Drawer, Menu, Modal, Tooltip, Dropdown } from "antd";
import type { MenuProps } from "antd/es/menu";
import BoardMember from "./boardMember";
import BoardTree from "./boardTree";
import Avatar from "@/components/avatar/avatar";

import treeSvg from "@/assets/svg/tree.svg";
import planSvg from "@/assets/svg/plan.svg";
import { getDocIcon } from "@/services/util";

type MenuItem = Required<MenuProps>["items"][number];

const BoardView: React.FC = (props) => {
  const {} = props;
  const navigate = useNavigate();
  let { boardKey } = useParams();
  const spaceKey = useSelector((state: RootState) => state.space.spaceKey);
  const boardDetail = useSelector(
    (state: RootState) => state.board.boardDetail
  );
  const dispatch = useDispatch();
  const [memberVisible, setMemberVisible] = useState<boolean>(false);
  const [menuKey, setMenuKey] = useState<number>(3);
  const [secondVisible, setSecondVisible] = useState<boolean>(false);
  const [thirdVisible, setThirdVisible] = useState<boolean>(false);
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  const [fragment, setFragment] = useState<any>(null);
  useEffect(() => {
    getData();
    getMember();
    dispatch(setBoardKey(boardKey as string));
  }, []);

  const helpMenu: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="help-item">
          <span>创建同级节点</span> <span>Enter</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="help-item">
          <span>创建下级节点</span> <span>Tab</span>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="help-item">
          <span>拖动视图</span> <span>按住鼠标右键并拖动</span>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <div className="help-item">
          <span>选中节点</span> <span>鼠标单击</span>
        </div>
      ),
    },
    {
      key: "5",
      label: (
        <div className="help-item">
          <span>编辑节点名</span> <span>鼠标双击</span>
        </div>
      ),
    },
    {
      key: "6",
      label: (
        <div className="help-item">
          <span>复制节点</span> <span>Ctrl + C</span>
        </div>
      ),
    },
    {
      key: "7",
      label: (
        <div className="help-item">
          <span>剪切节点</span> <span>Ctrl + X</span>
        </div>
      ),
    },
    {
      key: "8",
      label: (
        <div className="help-item">
          <span>粘贴节点</span> <span>Ctrl + V</span>
        </div>
      ),
    },
    {
      key: "9",
      label: (
        <div className="help-item">
          <span>删除节点</span> <span>Delete</span>
        </div>
      ),
    },
    {
      key: "10",
      label: (
        <div className="help-item">
          <span>向上调整</span> <span>shift + ↑</span>
        </div>
      ),
    },
    {
      key: "11",
      label: (
        <div className="help-item">
          <span>向下调整</span> <span>shift + ↓</span>
        </div>
      ),
    },
  ];
  const getData = async () => {
    let dataRes = (await api.request.get("book/detail", {
      bookKey: boardKey,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      dispatch(setBoardDetail(dataRes.data));
      dispatch(setBoardRole(dataRes.data.role));
      getNode(dataRes.data.rootKey);
    }
  };
  const getMember = async () => {
    let memberRes = (await api.request.get("bookMember", {
      bookKey: boardKey,
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      dispatch(setBoardMemberList(memberRes.data));
    }
  };
  useEffect(() => {
    if (boardDetail) {
    }
  }, [boardDetail]);
  const getNode = async (nodeKey) => {
    let dataRes: any = (await api.request.get("node/tree", {
      nodeKey: nodeKey,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      for (let key in dataRes.data) {
        let value = dataRes.data[key];
        value.icon = getDocIcon(value.docType);
        console.log(value.icon);
      }
      dispatch(setNodes(dataRes.data));
      dispatch(setStartId(nodeKey));
    }
  };
  return (
    <div className="boardView box">
      {/* {boardDetail ?  */}
      <div className="boardView-header">
        <div className="boardView-header-left">
          <div
            onClick={() => {
              navigate("/home");
            }}
          >
            <LeftOutlined />
          </div>
          <div className="common-logo">
            <div
              className="logo-box"
              style={{
                margin: "0px 0.1rem",
                width: "0.2rem",
                height: "0.2rem",
              }}
            >
              <Avatar
                avatar={boardDetail?.logo}
                name={boardDetail?.name}
                type="group"
                index={0}
              />
            </div>
            {boardDetail?.name}
          </div>
        </div>
        <div className="boardView-header-right">
          <div
            className="button-img"
            onClick={() => {
              setMemberVisible(true);
            }}
          >
            <TeamOutlined />
          </div>
        </div>
      </div>
      {boardDetail?.tagInfo.defaultView === 1 ||
      boardDetail?.tagInfo.defaultView === 2 ? (
        <div className="boardView-left">
          {/* <Menu
          style={{ height: "100%", width: "100%", background: "#f9f9f9" }}
          selectedKeys={[menuKey]}
          mode={"inline"}
          items={menuItems}
          inlineCollapsed={true}
          onClick={clickMenu}
        /> */}
          <div
            className="menu-item"
            onMouseEnter={() => {
              setThirdVisible(true);
            }}
          >
            <div className="menu-item-img">
              <img src={treeSvg} alt="" />
            </div>
            <div className="menu-item-title">视图</div>
          </div>
          {/* <div
            className="menu-item"
            onClick={() => {
              setMenuKey(11);
            }}
            onMouseEnter={() => {
              setSecondVisible(false);
            }}
          >
            <div className="menu-item-img">
              <img src={planSvg} alt="" />
            </div>
            <div className="menu-item-title">计划</div>
          </div> */}
        </div>
      ) : null}
      <div className="boardView-right">
        <BoardTree menuKey={menuKey} />
      </div>
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
        <BoardMember />
      </Drawer>
      {/* {secondVisible || thirdVisible ? (
        <div
          className="boardView-mask"
          onMouseLeave={() => {
            setSecondVisible(false);
          }}
          onMouseEnter={() => {
            setSecondVisible(true);
          }}
        >
          <div className="boardView-dialog">
            <div
              className="boardView-item"
              onMouseEnter={() => {
                setThirdVisible(true);
              }}
            >
              脑图
            </div>
            <div
              className="boardView-item"
              onMouseEnter={() => {
                setThirdVisible(false);
              }}
              onClick={() => {
                setMenuKey(7);
              }}
            >
              大纲
            </div>
            <div
              className="boardView-item"
              onMouseEnter={() => {
                setThirdVisible(false);
              }}
              onClick={() => {
                setMenuKey(8);
              }}
            >
              电子书
            </div>
            <div
              className="boardView-item"
              onMouseEnter={() => {
                setThirdVisible(false);
              }}
              onClick={() => {
                setMenuKey(9);
              }}
            >
              Doc
            </div>
            <div
              className="boardView-item"
              onMouseEnter={() => {
                setThirdVisible(false);
              }}
              onClick={() => {
                setMenuKey(10);
              }}
            >
              成员看板
            </div>
          </div>
        </div>
      ) : null} */}
      {thirdVisible ? (
        <div
          className="boardView-mask boardView-second-mask"
          onMouseLeave={() => setThirdVisible(false)}
        >
          <div className="boardView-dialog">
            <div
              className="boardView-item"
              onClick={() => {
                setMenuKey(3);
              }}
            >
              组织结构图
            </div>
            <div
              className="boardView-item"
              onClick={() => {
                setMenuKey(4);
              }}
            >
              单列
            </div>
            <div
              className="boardView-item"
              onClick={() => {
                setMenuKey(5);
              }}
            >
              向右
            </div>
            <div
              className="boardView-item"
              onClick={() => {
                setMenuKey(6);
              }}
            >
              八爪鱼
            </div>
          </div>
        </div>
      ) : null}
      <div className="help-container">
        <Dropdown
          menu={{ items: helpMenu }}
          placement="top"
          overlayStyle={{ width: "300px" }}
        >
          <QuestionCircleOutlined style={{ fontSize: "25px" }} />
        </Dropdown>
      </div>
    </div>
  );
};
export default BoardView;
