import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal, Select } from "antd";
import { ResultProps, ROLE_OPTIONS } from "@/interface/Common";
import api from "@/services/api";
import { Member } from "@/interface/Board";
import { message } from "@/hooks/EscapeAntd";
import { setBoardMemberList } from "@/store/board";
const { confirm } = Modal;
const BoardMember: React.FC = (props) => {
  const {} = props;
  const boardKey = useSelector((state: RootState) => state.board.boardKey);
  const boardMemberList = useSelector(
    (state: RootState) => state.board.boardMemberList
  );
  const dispatch = useDispatch();
  const [searchName, setSearchName] = useState<string>("");
  const [searchMemberList, setSearchMemberList] = useState<any>([]);
  const [workMemberList, setWorkMemberList] = useState<any>([]);
  //   const [memberList, setMemberList] = useState<any>([]);
  const memberKeyList = useMemo(() => {
    if (boardMemberList) {
      return boardMemberList.map((item) => item.userKey);
    }
  }, [boardMemberList]);

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
    const roleRes = (await api.request.patch("bookMember/role", {
      bookKey: boardKey,
      memberKey: key,
      newRole: val,
    })) as ResultProps;
    if (roleRes.msg === "OK") {
      // memberList.value[index].role = val;
    }
  };
  const deleteMember = async (index) => {
    let list: Member[] = [...boardMemberList];
    const memberRes = (await api.request.delete("bookMember", {
      bookKey: boardKey,
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
            dispatch(setBoardMemberList(list));
          }
        },
      });
    }
  };
  return (
    <div className="member">
      {boardMemberList.map((item, index) => {
        return (
          <div className="member-item" key={item.userKey}>
            <div className="member-item-left">
              <div className="member-item-avatar">
                <img src={item.userAvatar} alt="" />
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
                  options={ROLE_OPTIONS}
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
                {ROLE_OPTIONS[item.role + 2].label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default BoardMember;
