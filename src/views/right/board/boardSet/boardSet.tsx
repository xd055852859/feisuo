import React, { useState, useEffect } from "react";
import "./boardSet.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Board } from "@/interface/Board";
import { Button, Checkbox, Table } from "antd";
import { imageInfo } from "qiniu-js";
import dayjs from "dayjs";
import Avatar from "@/components/avatar/avatar";
import { message } from "@/hooks/EscapeAntd";
import Header from "@/components/header/header";
const { Column, ColumnGroup } = Table;
const BoardSet: React.FC = (props) => {
  const {} = props;
  const spaceKey = useSelector((state: RootState) => state.space.spaceKey);
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const [boardList, setBoardList] = useState<Board[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    getBoard(page);
  }, [page]);
  const getBoard = async (newPage) => {
    let boardRes = (await api.request.get("book", {
      spaceKey: spaceKey,
      page: newPage,
      limit: 30,
    })) as ResultProps;
    if (boardRes.msg === "OK") {
      setBoardList(boardRes.data);
      setTotal(boardRes.total as number);
    }
  };
  const changeBoardProp = async (key, value, index) => {
    console.log(key, value, index);
    let list = [...boardList];
    list[index][key] = value;
    setBoardList(list);
    if (key === "showInHomePage") {
      let boardRes = (await api.request.patch("book/showInHomePage", {
        bookKey: boardList[index]._key,
        showInHomePage:value
      })) as ResultProps;
      if (boardRes.msg === "OK") {
        message.success("设置首页成功");
      }
    } else {
      let obj = { [key]: value };
      let boardRes = (await api.request.patch("book", {
        ...obj,
      })) as ResultProps;
      if (boardRes.msg === "OK") {
        message.success("设置成功");
      }
    }
  };
  return (
    <div className="boardSet box">
      <Header title="资源库" backPath="/home"></Header>
      <div className="box-table">
        <Table
          dataSource={boardList}
          pagination={{ pageSize: 30, total, hideOnSinglePage: true }}
          rowKey={(record) => "table" + record._key}
          onChange={(pagination) => {
            setPage(pagination.current as number);
          }}
        >
          <Column
            title="图标"
            dataIndex="logo"
            key="logo"
            align="center"
            render={(logo, record: Board, index) => (
              <div className="boardSet-logo">
                <div className="logo-box">
                  <Avatar
                    avatar={logo}
                    name={record.name}
                    type="group"
                    index={index}
                  />
                </div>
              </div>
            )}
          />
          <Column title="项目名称" dataIndex="name" key="name" align="center" />
          <Column
            title="修改时间"
            dataIndex="updateTime"
            key="updateTime"
            align="center"
            render={(updateTime) => dayjs(updateTime).format("YYYY-MM-DD")}
          />
          <Column
            title="创建人"
            dataIndex="creatorInfo"
            key="creatorInfo"
            align="center"
            render={(creatorInfo) => creatorInfo.userName}
          />
          <Column
            title="对外开放"
            dataIndex="noVerify"
            key="noVerify"
            align="center"
            render={(noVerify, record, index) => (
              <Checkbox
                checked={noVerify}
                onChange={() => {
                  changeBoardProp("noVerify", !noVerify, index);
                }}
              />
            )}
          />
          <Column
            title="开放加入"
            dataIndex="isPublic"
            key="isPublic"
            align="center"
            render={(isPublic, record, index) => (
              <Checkbox
                checked={isPublic}
                onChange={() => {
                  changeBoardProp("isPublic", !isPublic, index);
                }}
              />
            )}
          />
          <Column
            title="加入首页"
            dataIndex="showInHomePage"
            key="showInHomePage"
            align="center"
            render={(showInHomePage, record, index) => (
              <>
                <Checkbox
                  checked={showInHomePage}
                  onChange={() => {
                    changeBoardProp("showInHomePage", !showInHomePage, index);
                  }}
                />
              </>
            )}
          />
          <Column
            title="操作"
            key="action"
            align="center"
            render={(_: any, record: Board) => (
              <>
                {isNaN(record.role) ? (
                  <Button type="primary">加入</Button>
                ) : record.role > 0 ? (
                  <Button type="primary">退出</Button>
                ) : (
                  "已加入"
                )}
              </>
            )}
          />
        </Table>
      </div>
    </div>
  );
};
export default BoardSet;
