import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/header/header";
import { Button, Table } from "antd";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import Avatar from "@/components/avatar/avatar";
import dayjs from "dayjs";
import { Board } from "@/interface/Board";
const { Column, ColumnGroup } = Table;
const Collect: React.FC = (props) => {
  const {} = props;
  const spaceKey = useSelector((state: RootState) => state.space.spaceKey);
  const dispatch = useDispatch();
  const [collectList, setCollectList] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    if (spaceKey) {
      getCollect(page);
    }
  }, [page, spaceKey]);
  const getCollect = async (newPage) => {
    let collectRes = (await api.request.get("book/fav", {
      spaceKey: spaceKey,
      favType:"book",
      page: newPage,
      limit: 30,
    })) as ResultProps;
    if (collectRes.msg === "OK") {
      setCollectList(collectRes.data);
      setTotal(collectRes.total as number);
    }
  };

  return (
    <div className="board">
      <Header title="收藏"></Header>
      <div className="box-table">
        <Table
          dataSource={collectList}
          pagination={{ pageSize: 30, total, hideOnSinglePage: true }}
          rowKey={(record) => "table" + record._key}
          onChange={(pagination) => {
            setPage(pagination.current as number);
          }}
        >
          <Column title="项目名称" dataIndex="name" key="name" align="center" />
          <Column
            title="所属空间"
            dataIndex="logo"
            key="logo"
            align="center"
            render={(logo, record: Board, index) => (
              <div className="common-logo">
                <div className="logo-box" style={{marginRight:'0.1rem'}}>
                  <Avatar
                    avatar={logo}
                    name={record.name}
                    type="group"
                    index={index}
                  />
                </div>
                {record.name}
              </div>
            )}
          />

          <Column
            title="收藏时间"
            dataIndex="updateTime"
            key="updateTime"
            align="center"
            render={(updateTime) => dayjs(updateTime).format("YYYY-MM-DD")}
          />

          <Column
            title="操作"
            key="action"
            align="center"
            render={(_: any, record: Board) => (
              <Button type="primary">取消收藏</Button>
            )}
          />
        </Table>
      </div>
    </div>
  );
};
export default Collect;
