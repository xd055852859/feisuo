import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import Excel from "@/components/excel";
import { setNodeDetail } from "@/store/node";
import IframeView from "@/components/ifameView";
import Editor from "@/components/editor";
import { SaveOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

interface NodeDetailProps {
  nodeKey: string;
  noClose?: boolean;
}
const NodeDetail: React.FC<NodeDetailProps> = (props) => {
  const { nodeKey, noClose } = props;
  const { token } = useSelector((state: RootState) => state.auth);
  const { nodeDetail } = useSelector((state: RootState) => state.node);
  const dispatch = useDispatch();
  const [fragment, setFragment] = useState<any>(null);
  const containerRef: React.RefObject<any> = useRef();
  const iframeRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (nodeKey) {
      getDetail();
    }
  }, [nodeKey]);
  const getDetail = async () => {
    let detailRes = (await api.request.get("node/detail", {
      nodeKey: nodeKey,
    })) as ResultProps;
    if (detailRes.msg === "OK") {
      dispatch(setNodeDetail(detailRes.data));
    }
  };
  const getFragment = () => {
    if (nodeDetail?.docType) {
      console.log(nodeDetail?.docType);
      let newFragment: any = null;
      const getApi = api.API_URL + "node/detail";
      const getParams = `{"nodeKey": "${nodeDetail._key}" }`;
      const patchApi = api.API_URL + "node";
      const patchData = `["content", "name"]`;
      const uptokenApi = api.API_URL + "account/qiniuToken";
      const uptokenParams = `{"target": "cdn-org"}`;

      // const patchParams = { nodeKey: nodeDetail._key };
      switch (nodeDetail.docType) {
        case "text":
          newFragment = (
            <IframeView
              url={
                `https://notecute.com/#/editor?token=${token}&getDataApi={"url":"${getApi}","params":${getParams}}&patchDataApi={"url":"${patchApi}","params":${getParams},"docDataName":"content"}&getUptokenApi={"url":"${uptokenApi}","params":${uptokenParams}}`
                // ${type !== "h5" ? "&hideHead=1" : ""}`
              }
              title={nodeDetail.name}
            />
          );
          break;
        case "draw":
          newFragment = (
            <IframeView
              url={
                `https://draw.workfly.cn/?token=${token}&getDataApi={"url":"${getApi}","params":${getParams}}&patchDataApi={"url":"${patchApi}","params":${getParams},"docDataName":${patchData}}&getUptokenApi={"url":"${uptokenApi}","params":${uptokenParams}}&isEdit=2`
                // ${type !== "h5" ? "&hideHead=1" : ""}`
              }
              title={nodeDetail.name}
            />
          );
          break;
        // case "table":
        //   newFragment = <Excel />;
        //   break;
        // case "ppt":
        //   newFragment = (
        //     <IframeView
        //       url={
        //         `https://ppt.mindcute.com/?token=${token}&getDataApi={"url":"${getApi}","params":${getParams}}&patchDataApi={"url":"${patchApi}","params":${getParams},"docDataName":"detail"}&getUptokenApi={"url":"${uptokenApi}","params":${uptokenParams}}&isEdit=2`
        //         // ${type !== "h5" ? "&hideHead=1" : ""}`
        //       }
        //       title={nodeDetail.name}
        //     />
        //   );
        //   break;
        case "mind":
          newFragment = (
            <IframeView
              url={
                `https://mind.qingtime.cn/?token=${token}&getDataApi={"url":"${getApi}","params":${getParams}}&patchDataApi={"url":"${patchApi}","params":${getParams},"docDataName":"content"}&getUptokenApi={"url":"${uptokenApi}","params":${uptokenParams}}&isEdit=2&hideHead=1`
                // ${type !== "h5" ? "&hideHead=1" : ""}`
              }
              title={nodeDetail.name}
            />
          );
      }
      return newFragment;
    }
  };
  return (
    <div className="nodeDetail-container">
      {nodeDetail?.docType === "table" && (
        <div className="nodeDetail-button">
          <Tooltip title="保存">
            <Button shape="circle" icon={<SaveOutlined />} />
          </Tooltip>
        </div>
      )}

      {!noClose ? (
        <div className="nodeDetail-close">
          <CloseCircleOutlined />
        </div>
      ) : null}
      <>{getFragment()}</>

      {/* {node.docType === "link" ? (
          // <Link targetData={node} setContent={setContent} />
        ) : null} */}
    </div>
  );
};
export default NodeDetail;
