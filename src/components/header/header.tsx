import React, { useState, useEffect } from "react";
import "./header.scss";
import { LeftOutlined } from "@ant-design/icons";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  title: string;
  children?: any;
  backPath?: string;
}
const Header: React.FC<HeaderProps> = (props) => {
  const { title, children, backPath } = props;
  const navigate = useNavigate();
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  return (
    <div className="header">
      <div className="header-title">
        {backPath ? (
          <div
            onClick={() => {
              navigate(backPath);
            }}
            className="header-back"
          >
            <LeftOutlined />
          </div>
        ) : null}
        {title}
      </div>
      <div className="header-button">{children}</div>
    </div>
  );
};
export default Header;
