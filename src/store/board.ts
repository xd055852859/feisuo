import { message } from "@/hooks/EscapeAntd";
import { Board, BoardDetail, Member } from "@/interface/Board";
import { User } from "@/interface/User";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface boardState {
  boardList: Board[] | null;
  boardKey: string;
  boardDetail: BoardDetail | null;
  boardRole: number;
  boardMemberList: Member[];
}

const initialState: boardState = {
  boardList: [],
  boardKey: localStorage.getItem("boardKey") || "",
  boardDetail: null,
  boardRole: 5,
  boardMemberList: [],
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoardList: (state, action: PayloadAction<Board[]>) => {
      state.boardList = action.payload;
    },
    setBoardKey: (state, action: PayloadAction<string>) => {
      state.boardKey = action.payload;
    },
    setBoardDetail: (state, action: PayloadAction<BoardDetail>) => {
      state.boardDetail = action.payload;
    },
    setBoardRole: (state, action: PayloadAction<number>) => {
      state.boardRole = action.payload;
    },
    setBoardMemberList: (state, action: PayloadAction<Member[]>) => {
      state.boardMemberList = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBoardList, setBoardDetail, setBoardKey, setBoardRole,setBoardMemberList} =
  boardSlice.actions;

export default boardSlice.reducer;
