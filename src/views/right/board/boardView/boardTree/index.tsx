import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { MenuTree, Mind, Tree, TreeEditor } from "tree-graph-react";
import { Moveable } from "@/components/moveable";
import api from "@/services/api";
import _ from "lodash";
import { ResultProps } from "@/interface/Common";
import { message } from "@/hooks/EscapeAntd";
import {
  setNodeDetail,
  setNodes,
  setSelectedId,
  setStartId,
} from "@/store/node";
import { Drawer, Modal } from "antd";
import NodeDetail from "../../nodeDetail";
import FreeModal from "@/components/freeModal";
import BoardTreeType from "./boardTreeType";
import BoardTreeItem from "./boardTreeItem";
import FreeDialog from "@/components/freeDialog";
const { confirm } = Modal;

interface BoardTreeProps {
  menuKey: number;
}
const BoardTree: React.FC<BoardTreeProps> = (props) => {
  const { menuKey } = props;
  const { boardDetail, boardRole } = useSelector(
    (state: RootState) => state.board
  );
  const { nodes, startId, selectedId } = useSelector(
    (state: RootState) => state.node
  );
  const dispatch = useDispatch();

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedNodes, setSelectedNodes] = useState<any>([]);
  const [selectedPath, setSelectedPath] = useState<any>([]);
  const [treeMenuLeft, setTreeMenuLeft] = useState<number>(0);
  const [treeMenuTop, setTreeMenuTop] = useState<number>(0);
  const [itemVisible, setItemVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [moreState, setMoreState] = useState<string>("");
  const [fragment, setFragment] = useState<any>(null);
  const boxRef: React.RefObject<any> = useRef();
  let moveRef: any = useRef();
  const treeRef: React.RefObject<any> = useRef();

  const moreVisible = useMemo(() => {
    if (moreState === "peer" || moreState === "child") {
      return true;
    } else {
      return false;
    }
  }, [moreState]);

  const chooseNode = (node: any, type?: number) => {
    if (node) {
      setSelectedNode(node);
      dispatch(setSelectedId(node._key));
      if (type === 1) {
        treeRef.current.rename();
      }
    } else {
      setSelectedNode(null);
      setSelectedNodes([]);
    }
  };
  const addNode = async (
    selectedNode: any,
    type: string,
    nodeType: string,
    docType?: string
  ) => {
    let newNodes = _.cloneDeep(nodes);
    let obj: any = {};
    if (
      (type === "peer" || type === "elder-peer") &&
      boardDetail?.rootKey === selectedNode
    ) {
      message.error("根结点不能新建同级节点");
      return;
    }
    let fatherKey = "";
    if (type === "child") {
      fatherKey = selectedNode;
    } else {
      console.log(newNodes[selectedNode]);
      if (newNodes[selectedNode] && newNodes[selectedNode].father) {
        fatherKey = newNodes[selectedNode].father;
      } else {
        return;
      }
    }
    //peer弟弟 elder-peer哥哥
    obj = {
      type: nodeType,
      nodeKey: selectedNode,
      fatherKey: fatherKey,
      addType: type,
    };
    if (docType) {
      obj.docType = docType;
    }
    let addTaskRes: any = await api.request.post("node", { ...obj });
    if (addTaskRes.msg === "OK") {
      newNodes[addTaskRes.data._key] = { ...addTaskRes.data };
      newNodes[fatherKey].sortList.push(addTaskRes.data._key);
      dispatch(setNodes(newNodes));
      chooseNode(addTaskRes.data, 1);
    }
  };
  const deleteNode = async () => {
    console.log(selectedId);
    confirm({
      title: "删除节点",
      content: "是否删除节点",
      okText: "确认",
      cancelText: "取消",
      async onOk() {
        if (selectedId) {
          // if (taskItem.creatorGroupRole <= taskItem.groupRole) {
          if (selectedId === boardDetail?.rootKey) {
            message.error("根节点不允许删除");
            return;
          }
          if (boardRole < 2) {
            updateNode("status", 0, (newNodes) => {
              message.success("删除成功");
              let fatherKey = newNodes[selectedId].father;
              let index = newNodes[fatherKey].sortList.findIndex(
                (item) => item === selectedId
              );
              console.log(index);
              if (index !== -1) {
                newNodes[fatherKey].sortList.splice(index, 1);
              }
              delete newNodes[selectedId];
            });
          }
        }
      },
    });

    //}
  };
  const updateNode = async (key: string, value, callback, nodeKey?: string) => {
    console.log(selectedId);
    let newNodes = _.cloneDeep(nodes);
    let updateRes: any = await api.request.patch("node", {
      nodeKey: nodeKey ? nodeKey : selectedId,
      [key]: value,
    });
    if (updateRes.msg === "OK") {
      callback(newNodes);
      dispatch(setNodes(newNodes));
    }
  };
  const dragNode = async (dragInfo: any) => {
    console.log(dragInfo);
    let newNodes = _.cloneDeep(nodes);
    let nodeKey = dragInfo.dragNodeId;
    let oldFatherKey = newNodes[nodeKey].father;
    let fatherKey = "";

    if (dragInfo.placement === "in") {
      fatherKey = dragInfo.dropNodeId;
      newNodes[dragInfo.dropNodeId].sortList.push(dragInfo.dragNodeId);
    } else if (fatherKey) {
      fatherKey = newNodes[dragInfo.dropNodeId].father;
      let nodeIndex = newNodes[fatherKey].sortList.indexOf(dragInfo.dropNodeId);
      let childrenIndex =
        dragInfo.placement === "up" ? nodeIndex : nodeIndex + 1;
      console.log(childrenIndex);
      newNodes[fatherKey].sortList.splice(
        dragInfo.dragNodeId,
        0,
        childrenIndex
      );
    }
    let index = newNodes[oldFatherKey].sortList.indexOf(nodeKey);
    if (index !== -1) {
      newNodes[oldFatherKey].sortList.splice(index, 1);
    }
    newNodes[nodeKey].father = fatherKey;
    let dragRes: any = await api.request.patch("node/drag", {
      nodeKey: nodeKey,
      targetNodeKey: dragInfo.dropNodeId,
      placement: dragInfo.placement,
    });
    if (dragRes.msg === "OK") {
      dispatch(setNodes(newNodes));
    }
  };
  const editNodeText = async (nodeId: string, text: string) => {
    dispatch(setSelectedId(nodeId));
    if (text.trim() === "") {
      text = "新节点";
    }
    updateNode(
      "name",
      text,
      (newNodes) => {
        newNodes[nodeId].name = text;
      },
      nodeId
    );
  };
  const editSortList = async (nodeId: string, sortList: any, type: string) => {
    updateNode(
      "sortList",
      sortList,
      (newNodes) => {
        newNodes[newNodes[nodeId].father].sortList = sortList;
      },
      nodes[nodeId].father
    );
  };
  const pasteNode = async () =>
    // pasteNodeKey: string,
    // pasteType: any,
    // targetNodeKey: string
    {
      // if (pasteType === "copy") {
      //   let copyRes: any = await api.task.copyTreeTask(
      //     pasteNodeKey,
      //     targetNodeKey,
      //     groupInfo.taskTreeRootCardKey
      //   );
      //   if (copyRes.msg === "OK") {
      //     let targetIndex = _.findIndex(newGridList, {
      //       _key: targetNodeKey,
      //     });
      //     newNodeObj[targetNodeKey].sortList.push(copyRes.newRoot);
      //     newGridList[targetIndex].children.push(copyRes.newRoot);
      //     getData(copyRes.newRoot);
      //   } else {
      //     dispatch(setMessage(true, copyRes.msg, "error"));
      //   }
      // } else if (pasteType === "cut") {
      //   dragNode(
      //     {
      //       dragNodeId: pasteNodeKey,
      //       dropNodeId: targetNodeKey,
      //       placement: "in",
      //     },
      //     []
      //   );
      // }
    };

  const moreMenu = (
    <>
      <FreeModal
        visible={itemVisible}
        dropStyle={{
          width: "160px",
          // height: '70px',
          top: treeMenuTop + 35 + "px",
          left: treeMenuLeft + "px",
          color: "#333",
          overflow: "auto",
        }}
        onClose={() => {
          setItemVisible(false);
          // setMoreState("");
        }}
        // closeType={1}
      >
        <BoardTreeItem
          setMoreState={setMoreState}
          selectedId={selectedId}
          addNode={addNode}
        />
      </FreeModal>
      <FreeModal
        visible={moreVisible}
        dropStyle={{
          width: "180px",
          // height: '70px',
          top: treeMenuTop + 35,
          left: treeMenuLeft + 165,
          color: "#333",
          overflow: "auto",
        }}
        onClose={() => {
          // setItemDialogShow(false);
          setMoreState("");
        }}
        closeType={1}
      >
        <BoardTreeType
          nodeKey={selectedId}
          addNode={addNode}
          moreState={moreState}
          setMoreState={setMoreState}
        />
      </FreeModal>
    </>
  );
  return (
    <>
      {nodes && boardDetail?.tagInfo ? (
        <>
          <div className="tree-container">
            {boardDetail.tagInfo.defaultView < 3 ? (
              <Moveable
                scrollable={true}
                style={{ display: "flex" }}
                rightClickToStart={true}
                ref={moveRef}
              >
                <div className="tree-box" ref={boxRef}>
                  {boardDetail.tagInfo.defaultView === 1 ? (
                    <Tree
                      ref={treeRef}
                      nodes={nodes}
                      startId={startId}
                      singleColumn={menuKey === 4}
                      // renameSelectedNode={true}
                      showIcon={true}
                      showAvatar={true}
                      showMoreButton={true}
                      showAddButton={true}
                      showPreviewButton={true}
                      showChildNum={true}
                      // showStatus={true}
                      avatarRadius={13}
                      indent={22}
                      uncontrolled={false}
                      defaultSelectedId={selectedId}
                      handleAddChild={(selectedNode: any) => {
                        dispatch(setSelectedId(selectedNode));
                        addNode(selectedNode, "child", "fold");
                      }}
                      handleAddNext={(selectedNode: any) => {
                        dispatch(setSelectedId(selectedNode));
                        addNode(selectedNode, "peer", "fold");
                      }}
                      handleClickNode={(node: any) => chooseNode(node)}
                      handleDeleteNode={deleteNode}
                      handleChangeNodeText={editNodeText}
                      // handleCheck={editFinishPercent}
                      handleShiftUpDown={editSortList}
                      // handleClickExpand={editContract}
                      handleClickPreviewButton={(node: any) => {
                        if (node.type === "doc") {
                          dispatch(setSelectedId(node._key));
                          setDetailVisible(true);
                        }
                      }}
                      // handleClickAddButton={(node: any) => {
                      //   setSelectedId(node._key);
                      //   addChildrenNode(node._key, "child", 1);
                      // }}
                      handleDrag={dragNode}
                      handleContextMenu={(node: any) => {
                        console.log(node);
                        chooseNode(node);
                        setTreeMenuLeft(node.x);
                        setTreeMenuTop(node.y);
                        setItemVisible(true);
                      }}
                      // handleClickDot={
                      //   clickDot

                      // }
                      // handleClickAvatar={(node: any) => {
                      //   let newGridList = [...gridList];
                      //   let nodeIndex = _.findIndex(newGridList, {
                      //     _key: node._key,
                      //   });
                      //   chooseNode(node);
                      //   setTreeMenuLeft(node.x);
                      //   setTreeMenuTop(node.y);
                      //   dispatch(setChooseKey(node._key));
                      //   dispatch(setTaskInfo(newGridList[nodeIndex]));
                      //   setAvatarDialogShow(true);
                      // }}
                      // handleClickStatus={(node: any) => {
                      //   chooseNode(node);
                      //   setTreeMenuLeft(node.x);
                      //   setTreeMenuTop(node.y);
                      //   setStatusDialogShow(true);
                      // }}
                      // hideHour={!theme.hourVisible}
                      // handlePaste={pasteNode}
                      // handleMutiSelect={(nodeArray) => {
                      //   setTargetNodeArray(nodeArray);
                      // }}
                      // handlePasteText={batchAddTask}
                    />
                  ) : (
                    <Mind
                      ref={treeRef}
                      nodes={nodes}
                      startId={startId}
                      singleColumn={menuKey === 5}
                      // renameSelectedNode={true}
                      showIcon={true}
                      showAvatar={true}
                      showMoreButton={true}
                      showAddButton={true}
                      showPreviewButton={true}
                      showChildNum={true}
                      // showStatus={true}
                      avatarRadius={13}
                      indent={22}
                      uncontrolled={false}
                      defaultSelectedId={selectedId}
                      handleAddChild={(selectedNode: any) => {
                        setSelectedId(selectedNode);
                        addNode(selectedNode, "child", "fold");
                      }}
                      handleAddNext={(selectedNode: any) => {
                        setSelectedId(selectedNode);
                        addNode(selectedNode, "peer", "fold");
                      }}
                      handleClickNode={(node: any) => chooseNode(node)}
                      handleClickMoreButton={(node: any) => {
                        chooseNode(node);
                        setTreeMenuLeft(node.x);
                        setTreeMenuTop(node.y);
                        setItemVisible(true);
                      }}
                      handleDeleteNode={() => {
                        deleteNode();
                      }}
                      handleChangeNodeText={editNodeText}
                      // handleCheck={editFinishPercent}
                      handleShiftUpDown={editSortList}
                      // handleClickExpand={editContract}
                      // handleClickPreviewButton={(node: any) => {
                      //   if (node.type === 6) {
                      //     checkNode(node);
                      //   }
                      // }}
                      // handleClickAddButton={(node: any) => {
                      //   setSelectedId(node._key);
                      //   addChildrenNode(node._key, "child", 1);
                      // }}
                      handleClickPreviewButton={(node: any) => {
                        if (node.type === "doc") {
                          dispatch(setSelectedId(node._key));
                          setDetailVisible(true);
                        }
                      }}
                      handleDrag={dragNode}
                      // handleClickDot={
                      //   clickDot

                      // }
                      // handleClickAvatar={(node: any) => {
                      //   let newGridList = [...gridList];
                      //   let nodeIndex = _.findIndex(newGridList, {
                      //     _key: node._key,
                      //   });
                      //   chooseNode(node);
                      //   setTreeMenuLeft(node.x);
                      //   setTreeMenuTop(node.y);
                      //   dispatch(setChooseKey(node._key));
                      //   dispatch(setTaskInfo(newGridList[nodeIndex]));
                      //   setAvatarDialogShow(true);
                      // }}
                      // handleClickStatus={(node: any) => {
                      //   chooseNode(node);
                      //   setTreeMenuLeft(node.x);
                      //   setTreeMenuTop(node.y);
                      //   setStatusDialogShow(true);
                      // }}
                      // hideHour={!theme.hourVisible}
                      // handlePaste={pasteNode}
                      // handleMutiSelect={(nodeArray) => {
                      //   setTargetNodeArray(nodeArray);
                      // }}
                      // handlePasteText={batchAddTask}
                    />
                  )}
                  {/* {moreMenu} */}
                </div>
              </Moveable>
            ) : (
              <>
                {boardDetail.tagInfo.defaultView === 3 ? (
                  <TreeEditor
                    nodes={nodes}
                    startId={startId}
                    handlePasteFiles={pasteNode}
                    handleDeleteAttach={deleteNode}
                  />
                ) : (
                  <>
                    <div className="tree-leftMenu">
                      <MenuTree
                        nodes={nodes}
                        startId={startId}
                        backgroundColor={"#fff"}
                        color={"#333"}
                        handleClickNode={(node: any) => {
                          chooseNode(node);
                        }}
                      />
                    </div>
                    <div className="tree-right-box">
                      {selectedId ? (
                        <NodeDetail nodeKey={selectedId} noClose={true} />
                      ) : null}
                    </div>
                  </>
                )}
                {moreMenu}
              </>
            )}
          </div>

          <FreeDialog
            visible={detailVisible}
            onClose={() => {
              setDetailVisible(false);
            }}
            // onOK={() => {
            //   uploadImg();
            //   setPhotoVisible(false);
            // }}
            dialogStyle={{
              width: "60vw",
              height: "100vh",
              top: "0px",
              left: "40vw",
              position: "fixed",
              overflow: "auto",
              zIndex: 10,
            }}
          >
            <NodeDetail nodeKey={selectedId} />
          </FreeDialog>
        </>
      ) : null}
    </>
  );
};
export default BoardTree;
