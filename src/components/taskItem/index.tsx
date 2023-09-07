import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import ClickOutside from "../clickOutside";
import Editor from "../editor";
import Avatar from "../avatar/avatar";
interface TaskItemProps {
  item: any;
  boardKey: string;
}
const TaskItem: React.FC<TaskItemProps> = (props) => {
  const { item, boardKey } = props;
  const { taskKey } = useSelector((state: RootState) => state.task);
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  const editorRef = useRef<any>(null);
  return (
    <div className="task-item">
      <div className="task-item-top">
        <div className="task-item-check"></div>
        <div className="task-item-content">
          {taskKey === item._key ? (
            <Editor
              ref={editorRef}
              initData={null}
              isEdit={true}
              bookKey={boardKey}
              taskKey={item._key}
            />
          ) : (
            <>
              <div className="task-item-title single-to-long">{item.title}</div>
              <div className="task-item-summary">{item.summary}</div>
            </>
          )}
        </div>
      </div>
      <div className="task-item-bottom">
        <div className="task-item-executor">
          <div className="task-item-avatar">
            <Avatar
              avatar={item.assignerInfo?.userAvatar}
              name={item.assignerInfo?.userName}
              type="person"
              index={0}
            />
          </div>
          {item.assignerInfo?.userName}
          <span>⇀</span>
          <div className="task-item-avatar">
            <Avatar
              avatar={item.executorInfo?.userAvatar}
              name={item.executorInfo?.userName}
              type="person"
              index={0}
            />
          </div>
          {item.executorInfo?.userName}
        </div>
        <div className="task-item-button"></div>
      </div>
    </div>
  );
};
export default TaskItem;
