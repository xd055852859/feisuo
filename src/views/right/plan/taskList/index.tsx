import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Select } from "antd";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import Editor from "@/components/editor";
import TaskItem from "@/components/taskItem";

interface TaskProps {
  boardKey: string;
}
const TaskList: React.FC<TaskProps> = (props) => {
  const { boardKey } = props;
  const { user } = useSelector((state: RootState) => state.auth);
  const { spaceMemberList, spaceRole } = useSelector(
    (state: RootState) => state.space
  );
  const dispatch = useDispatch();
  const [taskArray, setTaskArray] = useState<any>([]);
  const [filterType, setFilterType] = useState<number>(0);
  const [executor, setExecutor] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const editorRef = useRef<any>(null);
  useEffect(() => {
    if (user) {
      setExecutor(user._key);
    }
  }, [user]);
  useEffect(() => {
    if (executor) {
      getTask();
    }
  }, [page, executor, filterType]);
  const getTask = async () => {
    const taskRes = (await api.request.get("task", {
      bookKey: boardKey,
      executor: executor,
      filterType: filterType,
      page: page,
      limit: 50,
    })) as ResultProps;
    if (taskRes.msg === "OK") {
      setTaskArray(taskRes.data);
      setTotal(taskRes.total as number);
    }
  };
  const saveTask = async () => {
    editorRef.current.handlePost((data) => {
      console.log(data);
    });
  };
  return (
    <div className="taskList">
      <div className="taskList-input">
        <div className="taskList-input-editor">
          <Editor
            ref={editorRef}
            initData={null}
            isEdit={true}
            bookKey={boardKey}
            executor={executor}
          />
        </div>
        <div className="taskList-input-button">
          <Button type="primary" onClick={saveTask}>
            发布
          </Button>
        </div>
      </div>
      <div className="taskList-filter">
        <div className="taskList-filter-left">
          执行人:
          <Select
            value={executor}
            onChange={(value) => {
              setExecutor(value);
            }}
            options={spaceMemberList?.map((item) => {
              return { value: item.userKey, label: item.userName };
            })}
          />
        </div>
        <div className="taskList-filter-right">
          <Select
            value={filterType}
            onChange={(value) => {
              setFilterType(value);
            }}
            options={[
              { value: 0, label: "全部" },
              { value: 1, label: "未完成" },
              { value: 2, label: "已完成" },
              { value: 3, label: "指派他人" },
            ]}
          />
        </div>
      </div>
      <div className="taskList-container">
        {taskArray.map((item, index) => {
          return (
            <TaskItem boardKey={boardKey} item={item} key={"item" + index} />
          );
        })}
      </div>
    </div>
  );
};
export default TaskList;
