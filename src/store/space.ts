import { message } from "@/hooks/EscapeAntd";
import { Space, SpaceDetail, SpaceMember } from "@/interface/Space";
import { User } from "@/interface/User";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SpaceState {
  spaceList: Space[] | null;
  spaceKey: string;
  spaceDetail: SpaceDetail | null;
  spaceRole: number;
  starList: any;
  spaceMemberList: SpaceMember[]|null;
}

const initialState: SpaceState = {
  spaceList: null,
  spaceKey: "",
  spaceDetail: null,
  spaceRole: 5,
  starList: [],
  spaceMemberList: [],
};

export const spaceSlice = createSlice({
  name: "space",
  initialState,
  reducers: {
    setSpaceList: (state, action: PayloadAction<Space[]>) => {
      state.spaceList = action.payload;
    },
    setSpaceKey: (state, action: PayloadAction<string>) => {
      state.spaceKey = action.payload;
      localStorage.setItem("spaceKey", action.payload);
    },
    setSpaceDetail: (state, action: PayloadAction<SpaceDetail>) => {
      state.spaceDetail = action.payload;
    },
    setSpaceRole: (state, action: PayloadAction<number>) => {
      state.spaceRole = action.payload;
    },
    setStarList: (state, action: PayloadAction<any>) => {
      state.starList = action.payload;
    },
    setSpaceMemberList: (state, action: PayloadAction<any>) => {
      state.spaceMemberList = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSpaceList,
  setSpaceDetail,
  setSpaceKey,
  setSpaceRole,
  setStarList,
  setSpaceMemberList
} = spaceSlice.actions;

export default spaceSlice.reducer;
