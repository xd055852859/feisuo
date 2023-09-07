import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
const Effects: React.FC = (props) => {
  const {} = props;
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const [] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // useEffect(() => {
  //   var wordList = [
  //     ["各位观众", 25],
  //     ["词云", 21],
  //     ["来啦!!!", 13],
  //     ["各位观众1", 25],
  //     ["词云1", 21],
  //     ["来啦1!!!", 13],
  //     ["各位观众2", 25],
  //     ["词云2", 21],
  //     ["来啦2!!!", 13],
  //     ["各位观众3", 25],
  //     ["词云3", 21],
  //     ["来啦3!!!", 13],
  //     ["各位观众4", 25],
  //     ["词云4", 21],
  //     ["来啦4!!!", 13],
  //     ["各位观众5", 25],
  //     ["词云5", 21],
  //     ["来啦5!!!", 13],
  //     ["各位观众6", 25],
  //     ["词云6", 21],
  //     ["来啦6!!!", 13],
  //     ["各位观众7", 25],
  //     ["词云7", 21],
  //     ["来啦7!!!", 13],
  //     ["各位观众8", 25],
  //     ["词云8", 21],
  //     ["来啦8!!!", 13],
  //     ["各位观众9", 25],
  //     ["词云9", 21],
  //     ["来啦9!!!", 13],
  //     ["各位观众", 25],
  //     ["词云", 21],
  //     ["来啦!!!", 13],
  //     ["各位观众1", 25],
  //     ["词云1", 21],
  //     ["来啦1!!!", 13],
  //     ["各位观众2", 25],
  //     ["词云2", 21],
  //     ["来啦2!!!", 13],
  //     ["各位观众3", 25],
  //     ["词云3", 21],
  //     ["来啦3!!!", 13],
  //     ["各位观众4", 25],
  //     ["词云4", 21],
  //     ["来啦4!!!", 13],
  //     ["各位观众5", 25],
  //     ["词云5", 21],
  //     ["来啦5!!!", 13],
  //     ["各位观众6", 25],
  //     ["词云6", 21],
  //     ["来啦6!!!", 13],
  //     ["各位观众7", 25],
  //     ["词云7", 21],
  //     ["来啦7!!!", 13],
  //     ["各位观众8", 25],
  //     ["词云8", 21],
  //     ["来啦8!!!", 13],
  //     ["各位观众9", 25],
  //     ["词云9", 21],
  //     ["来啦9!!!", 13],
  //   ];
  //   var options = {
  //     shape: "star",
  //     list: wordList, //或者[['各位观众',25],['词云', 21],['来啦!!!',13]],只要格式满足这样都可以
  //     gridSize: 6, // 密集程度 数字越小越密集
  //     weightFactor: 1, // 字体大小=原始大小*weightFactor
  //     maxFontSize: 40, //最大字号
  //     minFontSize: 14, //最小字号
  //     fontWeight: "normal", //字体粗细
  //     fontFamily: "Times, serif", // 字体
  //     color: "random-light", // 字体颜色 'random-dark' 或者 'random-light'
  //     backgroundColor: "transparent", // 背景颜色
  //     rotateRatio: 0.5, // 字体倾斜(旋转)概率，1代表总是倾斜(旋转)
  //   };
  //   //@ts-ignore
  //   // window.WordCloud(canvasRef.current, options);
  // }, []);
  return (
    <div className="effects">
      <div className="effects-box">
        {/* <canvas ref={canvasRef} className="effects-canvas"></canvas> */}
      </div>
    </div>
  );
};
export default Effects;
