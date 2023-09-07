import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/header/header";
const Plan: React.FC = (props) => {
  const {} = props;
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  const dragProgram = (result) => {
    console.log(result)
  };
  return (
    <div className="execute box">
       <Header title="执行"></Header>
      <DragDropContext onDragEnd={dragProgram}>
        <div className="execute-box">
          <Droppable droppableId="tree">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="execute-tree"
              >
                <Draggable
                  key={"tree" + 0}
                  draggableId={"tree" + 0}
                  // isDragDisabled={!taskNameitem.key}
                  index={0}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // style={{ marginRight: '15px' }}
                      className="tree-item"
                    >
                      <div className="tree-item-title"> 123</div>
                    </div>
                  )}
                </Draggable>
                <Draggable key={"tree" + 1} draggableId={"tree" + 1} index={1}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // style={{ marginRight: '15px' }}
                      className="tree-item"
                    >
                      <div className="tree-item-title"> 456</div>
                    </div>
                  )}
                </Draggable>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="menu">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="execute-menu"
              >
                <Draggable
                  key={"menu" + 0}
                  draggableId={"menu" + 0}
                  // isDragDisabled={!taskNameitem.key}
                  index={0}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="menu-item"
                    >
                      abc
                    </div>
                  )}
                </Draggable>
                <Draggable key={"menu" + 1} draggableId={"menu" + 1} index={1}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="menu-item"
                    >
                      def
                    </div>
                  )}
                </Draggable>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};
export default Plan;
