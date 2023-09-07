import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/views/login";
import Home from "@/views/home";
import Execute from "@/views/right/execute";
import App from "@/App";
import Board from "@/views/right/board";
import Plan from "@/views/right/plan";
import Effects from "@/views/right/effects";
import BoardSet from "@/views/right/board/boardSet/boardSet";
import BoardView from "@/views/right/board/boardView";
import Collect from "@/views/right/collect";
import Task from "@/views/right/task";
import NodeDetail from "@/views/right/board/nodeDetail";
import Test from "@/views/test";
import Manage from "@/views/manage";
import Basic from "@/views/manage/basic";
import Member from "@/views/manage/member";
import Tag from "@/views/manage/tag";
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Login />} />
          <Route path="home" element={<Home />}>
            <Route index element={<Board />} />
            <Route path="execute" element={<Execute />} />
            <Route path="plan" element={<Plan />} />
            <Route path="collect" element={<Collect />} />
            <Route path="task" element={<Task />} />
            <Route path="effects" element={<Effects />} />
            <Route path="test" element={<Test />} />
          </Route>
          <Route path="manage" element={<Manage />}>
            <Route index element={<Basic />} />
            <Route path="member" element={<Member />} />
            <Route path="tag" element={<Tag />} />
          </Route>
          <Route path="boardSet" element={<BoardSet />} />
          <Route path="boardView/:boardKey" element={<BoardView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
