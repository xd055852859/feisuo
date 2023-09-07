import React from "react";

interface BoardTreeItemProps {
  setMoreState: any;
  selectedId: string;
  addNode: any;
}

const BoardTreeItem: React.FC<BoardTreeItemProps> = (props) => {
  const { setMoreState, addNode, selectedId } = props;
  return (
    <>
      <div
        className="common-freeModal-item"
        onMouseEnter={() => {
          setMoreState("peer");
        }}
      >
        新建节点
      </div>
      <div
        className="common-freeModal-item"
        onMouseEnter={() => {
          setMoreState("child");
        }}
      >
        新建子节点
      </div>
      <div
        className="common-freeModal-item"
        onClick={() => {
          setMoreState("import");
        }}
        onMouseEnter={() => {
          setMoreState("");
        }}
      >
        批量导入
      </div>
      <div
        className="common-freeModal-item"
        onClick={() => {
          setMoreState("restore");
        }}
        onMouseEnter={() => {
          setMoreState("");
        }}
      >
        还原节点
      </div>
      <div
        className="common-freeModal-item"
        onClick={() => {
          setMoreState("delete");
        }}
        onMouseEnter={() => {
          setMoreState("");
        }}
      >
        删除节点
      </div>
    </>
  );
};
export default BoardTreeItem;
