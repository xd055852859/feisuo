import { message } from "@/hooks/EscapeAntd";
import { Board, BoardDetail, Member } from "@/interface/Board";
import { User } from "@/interface/User";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface nodeState {
  nodes: any;
  startId: string;
  selectedId: string;
  nodeDetail: any;
}

const initialState: nodeState = {
  nodes: [],
  startId: "",
  selectedId: "",
  nodeDetail: null,
};

export const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<any>) => {
      state.nodes = action.payload;
    },
    setStartId: (state, action: PayloadAction<string>) => {
      state.startId = action.payload;
    },
    setSelectedId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    setNodeDetail: (state, action: PayloadAction<any>) => {
      state.nodeDetail = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNodes, setStartId, setSelectedId, setNodeDetail } =
  nodeSlice.actions;

export default nodeSlice.reducer;
