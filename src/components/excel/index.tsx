import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
const Excel: React.FC = (props) => {
  const {} = props;
  const { nodeDetail } = useSelector((state: RootState) => state.node);
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  useEffect(() => {
    if (nodeDetail) {
      //@ts-ignore
      const luckysheet = window.luckysheet;
      console.log(luckysheet);
      var docName = nodeDetail.name || "请输入标题名";
      var luckysheetfile = _.cloneDeep(nodeDetail.detail);
      //配置项
      var options = {
        container: "luckysheet", //luckysheet为容器id
        title: docName,
        lang: "zh",
        myFolderUrl: "/",
        allowEdit: true,
        forceCalculation: false,
        // functionButton:
        //   res.result.readOnly || deviceType || viewState
        //     ? "<button'>仅支持查看</button>"
        //     : "<button id='save'>保存</button>",
        // data: [sheetFormula, sheetFormula2],
      };
      if (luckysheetfile instanceof Array && luckysheetfile.length) {
        options["data"] = luckysheetfile;
      }
      console.log(options);
      luckysheet.create(options);
    }
  }, [nodeDetail]);
  useEffect(() => {
    return () => {
      //@ts-ignore
      const luckysheet = window.luckysheet;
      luckysheet.destroy();
    };
  }, []);

  return (
    <div
      id="luckysheet"
      style={{
        margin: "0px",
        padding: "0px",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: "0px",
        top: "0px",
      }}
    ></div>
  );
};
export default Excel;
