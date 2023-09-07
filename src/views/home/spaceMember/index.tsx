import React, { useState, useEffect } from "react";
import "@/views/right/board/boardView/boardMember/index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Select } from "antd";
import api from "@/services/api";
import _ from "lodash";
import { SpaceMember as Member } from "@/interface/Space";
import { message } from "@/hooks/EscapeAntd";
import { setSpaceMemberList } from "@/store/space";
import { SPACE_ROLE_OPTIONS, ResultProps } from "@/interface/Common";
const { confirm } = Modal;
const SpaceMember: React.FC = (props) => {
  const {} = props;
  const { spaceMemberList, spaceKey } = useSelector(
    (state: RootState) => state.space
  );
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [searchMemberList, setSearchMemberList] = useState<any>([]);
  const [workMemberList, setWorkMemberList] = useState<any>([]);
  //   const [memberList, setMemberList] = useState<any>([]);
  const memberKeyList = useMemo(() => {
    if (spaceMemberList) {
      return spaceMemberList.map((item) => item.userKey);
    }
  }, [spaceMemberList]);
  const searchMember = async () => {
    // const memberRes = (await api.request.get("user/search", {
    //   keyWord: searchName.value,
    // })) as ResultProps;
    // if (memberRes.msg === "OK") {
    //   searchMemberList.value = [...memberRes.data];
    // }
  };
  const addMember = (item) => {};
  const changeRole = async (val, index, key) => {
    const roleRes = (await api.request.patch("spaceMember/role", {
      spaceKey: spaceKey,
      memberKey: key,
      newRole: val,
    })) as ResultProps;
    if (roleRes.msg === "OK") {
      // memberList.value[index].role = val;
    }
  };
  const deleteMember = async (index) => {
    let list: Member[] = _.cloneDeep();
    const memberRes = (await api.request.delete("bookMember", {
      spaceKey: spaceKey,
      memberKeyArr: [list[index].userKey],
    })) as ResultProps;
    if (memberRes.msg === "OK") {
      confirm({
        title: "删除协作者",
        content: "是否删除协作者",
        okText: "确认",
        cancelText: "取消",
        async onOk() {
          let boardRes = (await api.request.delete("book", {
            bookKey: list[index],
          })) as ResultProps;
          if (boardRes.msg === "OK") {
            message.success("删除协作者成功");
            list.splice(index, 1);
            dispatch(setSpaceMemberList(list));
          }
        },
      });
    }
  };
  return (
    <div className="member">
      {spaceMemberList &&
        spaceMemberList.map((item, index) => {
          return (
            <div className="member-item" key={item.userKey}>
              <div className="member-item-left">
                <div className="member-item-avatar">
                  <img src={item?.userAvatar ? item.userAvatar : ""} alt="" />
                </div>
                <div className="member-item-nickName">{item.userName}</div>
              </div>
              {item.role ? (
                <>
                  <Select
                    value={item.role}
                    onChange={(e) => {
                      changeRole(e, index, item.userKey);
                    }}
                    style={{width:'100px'}}
                    options={SPACE_ROLE_OPTIONS}
                  />
                  <Button
                    type="primary"
                    onClick={() => {
                      deleteMember(index);
                    }}
                  >
                    删除
                  </Button>
                </>
              ) : (
                <div className="member-item-role">
                  {SPACE_ROLE_OPTIONS[item.role].label}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
export default SpaceMember;
