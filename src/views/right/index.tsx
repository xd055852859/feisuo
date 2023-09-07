import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
const Right: React.FC = (props) => {
  const {} = props;
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  return (
    <div className="right">
      <Outlet />
    </div>
  );
};
export default Right;
