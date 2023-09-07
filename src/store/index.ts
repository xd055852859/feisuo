import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./common";
import authReducer from "./auth";
import spaceReducer from "./space";
import boardReducer from "./board";
import nodeReducer from "./node";
import taskReducer from "./task";
export const store = configureStore({
  reducer: {
    common: commonReducer,
    auth: authReducer,
    space: spaceReducer,
    board: boardReducer,
    node: nodeReducer,
    task: taskReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
