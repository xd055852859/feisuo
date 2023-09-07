interface BoardTreeTypeProps {
  nodeKey: any;
  addNode: any;
  moreState: string;
  setMoreState: any;
}

const BoardTreeType: React.FC<BoardTreeTypeProps> = (props) => {
  const { nodeKey, addNode, moreState, setMoreState } = props;
  return (
    <>
      <div
        className="common-freeModal-item"
        onClick={() => {
          addNode(nodeKey, moreState, "fold");
        }}
      >
        新建节点
      </div>
      <div
        className="common-freeModal-item"
        onClick={() => {
          addNode(nodeKey, moreState, "doc", "text");
        }}
      >
        新建文档
      </div>
      <div
        className="common-freeModal-item"
        onClick={() => {
          addNode(nodeKey, moreState, "doc", "draw");
        }}
      >
        新建绘图
      </div>
      <div
        className="common-freeModal-item"
        onClick={() => {
          addNode(nodeKey, moreState, "doc", "mind");
        }}
      >
        新建脑图
      </div>
      {/* <div
        className="common-freeModal-item"
        onClick={() => {
          addNode(nodeKey, moreState, "doc", "table");
        }}
      >
        新建表格
      </div> */}
      {/* <div
        className="common-freeModal-item"
        onClick={() => {
          addNode(nodeKey, moreState, "link");
        }}
      >
      
      </div> */}
      {/* <div
        className="common-freeModal-item"
        onClick={() => {
          addNode(nodeKey, moreState, "doc", "ppt");
        }}
      >
        新建PPT
      </div> */}
    </>
  );
};
export default BoardTreeType;
