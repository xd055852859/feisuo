import { message } from "@/hooks/EscapeAntd";
import { Board, BoardDetail, Member } from "@/interface/Board";
import { User } from "@/interface/User";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface taskState {
  taskKey: string;
}

const initialState: taskState = {
  taskKey: "",
};

export const nodeSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskKey: (state, action: PayloadAction<string>) => {
      state.taskKey = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTaskKey } = nodeSlice.actions;

export default nodeSlice.reducer;
