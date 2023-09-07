import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import Header from "@/components/header/header";
import {
  Button,
  Drawer,
  Empty,
  Input,
  Modal,
  Select,
  Table,
  message,
} from "antd";
import { SpaceMember } from "@/interface/Space";
import Avatar from "@/components/avatar/avatar";
import { SPACE_ROLE_OPTIONS, ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { setSpaceMemberList } from "@/store/space";
const { Column, ColumnGroup } = Table;
const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;
const Member: React.FC = (props) => {
  const {} = props;
  const { spaceMemberList, spaceRole, spaceKey } = useSelector(
    (state: RootState) => state.space
  );
  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");

  const [memberList, setMemberList] = useState<SpaceMember[]>([]);

  const [memberInput, setMemberInput] = useState<string>("");
  const [memberType, setMemberType] = useState<string>("phone");
  const [searchList, setSearchList] = useState<any>([]);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const selectBefore = (
    <Select
      value={memberType}
      style={{ width: "100px" }}
      onChange={(value) => {
        setMemberType(value);
      }}
    >
      <Option value="phone">手机</Option>
      <Option value="name">用户名</Option>
    </Select>
  );

  useEffect(() => {
    if (spaceMemberList && !name) {
      setMemberList(_.cloneDeep(spaceMemberList));
    }
  }, [spaceMemberList, name]);
  const searchName = (value: string) => {
    if (value) {
      let list = _.cloneDeep(spaceMemberList).filter((item) => {
        return item.userName.includes(value);
      });
      setMemberList(list);
    }
  };
  const searchMember = async (value: string) => {
    if (value) {
      let reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/g;
      if (memberType === "phone" && !reg.test(value)) {
        message.error("请输入正确的手机号");
        return;
      }
      const searchRes = (await api.request.get("user/search", {
        keyWord: value,
      })) as ResultProps;
      if (searchRes.msg === "OK") {
        setSearchList(searchRes.data);
      }
    }
  };
  const changeRole = async (val, index, key) => {
    const roleRes = (await api.request.patch("spaceMember/role", {
      spaceKey: spaceKey,
      memberKey: key,
      newRole: val,
    })) as ResultProps;
    if (roleRes.msg === "OK") {
      let list = _.cloneDeep(memberList);
      list[index].role = val;
      dispatch(setSpaceMemberList(list));
    }
  };
  const addMember = async (index, userKey, phone) => {
    let list = _.cloneDeep(memberList);
    let newlist = _.cloneDeep(searchList);
    const memberRes = (await api.request.post("spaceMember", {
      spaceKey: spaceKey,
      memberKey: userKey,
      mobile: phone,
      mobileArea: "+86",
      role: 4,
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      message.success("添加成员成功");
      if (index !== -1) {
        newlist.splice(index, 1);
        setSearchList(newlist);
      }
      list.push(memberRes.data);
      dispatch(setSpaceMemberList(list));
    }
  };
  const deleteMember = async (index, userKey) => {
    confirm({
      title: "删除成员",
      content: "是否删除成员",
      okText: "确认",
      cancelText: "取消",
      async onOk() {
        let list = _.cloneDeep(memberList);
        const memberRes = (await api.request.delete("spaceKey", {
          spaceKey: spaceKey,
          memberKeyArr: [userKey],
        })) as ResultProps;
        if (memberRes.msg === "OK") {
          message.success("删除成员成功");
          list.splice(index, 1);
          dispatch(setSpaceMemberList(list));
        }
      },
    });
  };

  return (
    <div className="member box">
      <Header title="成员管理" />
      <div className="member-header box-header">
        <div>
          <Search
            placeholder="请输入成员名称"
            onSearch={searchName}
            onChange={(e) => {
              setName(e.target.value);
            }}
            style={{ width: 200 }}
            value={name}
          />
        </div>
        <div>
          <Button type="primary" style={{ margin: "0px 15px" }}>
            excel导入
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setAddVisible(true);
            }}
          >
            添加
          </Button>
        </div>
      </div>
      <div className="member-table box-table">
        <Table
          dataSource={memberList}
          rowKey={(record) => "table" + record.userKey}
          pagination={false}
        >
          <Column
            title="成员名称"
            dataIndex="userName"
            key="userName"
            align="center"
          />
          <Column
            title="头像"
            dataIndex="userAvatar"
            key="userAvatar"
            align="center"
            render={(userAvatar, record: SpaceMember, index) => (
              <div className="member-logo">
                <div className="logo-box">
                  <Avatar
                    avatar={userAvatar}
                    name={record.userName || ""}
                    type="person"
                    index={index}
                  />
                </div>
              </div>
            )}
          />
          <Column
            title="手机号"
            dataIndex="mobile"
            key="mobile"
            align="center"
          />
          <Column
            title="权限"
            dataIndex="role"
            key="role"
            align="center"
            render={(role, record: SpaceMember, index) => (
              <>
                {role > spaceRole ? (
                  <Select
                    value={role}
                    onChange={(e) => {
                      changeRole(e, index, record.userKey);
                    }}
                    options={SPACE_ROLE_OPTIONS}
                    style={{ width: "150px" }}
                  />
                ) : (
                  <div className="member-item-role">
                    {SPACE_ROLE_OPTIONS[role].label}
                  </div>
                )}
              </>
            )}
          />
          <Column
            title="操作"
            key="action"
            align="center"
            render={(_: any, record: SpaceMember, index) => (
              <>
                {record.role > spaceRole ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      deleteMember(index, record.userKey);
                    }}
                  >
                    移除
                  </Button>
                ) : null}
              </>
            )}
          />
        </Table>
      </div>
      <Modal
        title="添加"
        open={addVisible}
        footer={null}
        destroyOnClose
        onCancel={() => {
          setAddVisible(false);
        }}
      >
        <div className="member-search">
          <div className="member-search-title">
            <Search
              addonBefore={selectBefore}
              placeholder={`请输入${
                memberType === "phone" ? "手机号" : "名称"
              }`}
              value={memberInput}
              onSearch={searchMember}
              onChange={(e) => {
                setMemberInput(e.target.value);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div className="member-search-container">
            {searchList.length > 0 ? (
              searchList.map((item, index) => {
                return (
                  <div className="member-search-item" key={"search" + index}>
                    <div className="member-search-left">
                      <div className="member-search-avatar">
                        <Avatar
                          avatar={item.userAvatar}
                          name={item.userName}
                          type="person"
                          index={0}
                        />
                      </div>
                      <div>{item.userName}</div>
                    </div>
                    <div className="member-search-right">
                      <Button
                        type="primary"
                        onClick={() => {
                          addMember(index, item._key, "");
                        }}
                      >
                        添加
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="dp-center-center" style={{ height: "100%" }}>
                <Empty
                  // image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  // imageStyle={{ height: 60 }}
                  description={
                    <div>
                      {`未搜索到对应${
                        memberType === "phone" ? "手机号" : "名称"
                      }`}
                    </div>
                  }
                >
                  {memberType === "phone" ? (
                    <Button
                      type="primary"
                      onClick={() => {
                        addMember(-1, "", memberInput);
                      }}
                    >
                      添加成员
                    </Button>
                  ) : null}
                </Empty>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Member;
