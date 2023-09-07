import React, { useState, useEffect } from "react";
import "./index.scss";

import { useDispatch, useSelector } from "react-redux";

import Left from "@/views/left";
import Right from "@/views/right";

const Home: React.FC = (props) => {
  const {} = props;

  const dispatch = useDispatch();
  const [] = useState<number[]>([]);

  return (
    <div className="home">
      <Left />
      <Right />
    </div>
  );
};
export default Home;
