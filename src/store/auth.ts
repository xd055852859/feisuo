import { message } from "@/hooks/EscapeAntd";
import { User } from "@/interface/User";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import space from "./space";

export interface AuthState {
  token: string;
  loginState: string;
  user: User | null;
  inviteKey: string;
}

const initialState: AuthState = {
  token: "",
  loginState: "login",
  user: null,
  inviteKey: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.token = action.payload;
      }
    },
    setLoginState: (state, action: PayloadAction<string>) => {
      state.loginState = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setInviteKey: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        localStorage.setItem("inviteKey", action.payload);
      } else {
        localStorage.removeItem("inviteKey");
      }
      state.inviteKey = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken, setLoginState, setUser } = authSlice.actions;

export default authSlice.reducer;
