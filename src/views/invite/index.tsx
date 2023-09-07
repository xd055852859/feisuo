import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
const Invite: React.FC = (props) => {
  const {} = props;
  const { inviteKey } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {});
  useEffect(() => {}, [inviteKey]);
  const inviteMember = () => {
    
  };
  return <div></div>;
};
export default Invite;
