import React, { useState, useEffect } from "react";
// import './.css';
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import Excel from "@/components/excel";
import api from "@/services/api";
import { setNodeDetail } from "@/store/node";
import { ResultProps } from "@/interface/Common";
import { Drawer } from "antd";
const Test: React.FC = (props) => {
  const {} = props;
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  useEffect(() => {
    getDetail();
  }, []);
  const getDetail = async () => {
    let detailRes = (await api.request.get("node/detail", {
      nodeKey: "1490063239",
    })) as ResultProps;
    if (detailRes.msg === "OK") {
      dispatch(setNodeDetail(detailRes.data));
    }
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Drawer
        title={"xxx"}
        placement="right"
        onClose={() => {}}
        open={true}
        destroyOnClose
        closeIcon={false}
        width={"60%"}
      >
        <Excel />
      </Drawer>
    </div>
  );
};
export default Test;
