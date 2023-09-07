import React, { useState, useEffect } from "react";
import "./index.scss";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
// import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js";
// import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip.js";
// import "dhtmlx-gantt/codebase/locale/locale_cn.js";

import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Header from "@/components/header/header";
interface ExecuteProps {}
const Gannt: React.FC<ExecuteProps> = (props) => {
  const {} = props;
  // const  = useSelector((state: RootState) => state.common.value);
  const dispatch = useDispatch();
  const ganttRef: any = useRef();
  const data = {
    data: [
      {
        id: 1,
        text: "Project",
        start_date: "2023-02-03",
        duration: 18,
        progress: 1,
        open: true,
      },
      {
        id: 2,
        text: "Task",
        start_date: "2023-02-04",
        duration: 8,
        progress: 0.6,
        parent: 1,
      },
      {
        id: 3,
        text: "Task",
        start_date: "2022-02-05",
        duration: 8,
        progress: 0.6,
        parent: 1,
      }
    ],
    // links: [{ id: 1, source: 1, target: 2, type: "0" }],
  };
  useEffect(() => {
    init();
    return () => {};
  }, []);
  //   this.ganttInstance.init(this.gantt());
  // gantt.clearAll();
  // this.ganttInstance.parse(this.tasks);
  const init = () => {
    // gantt.i18n.setLocale("cn"); //中文
    gantt.config.date_format = "%Y-%m-%d %H:%i";

    gantt.config.show_links = false; //禁用连线
    gantt.config.drag_progress = false; // 允许用户推拽条形图上用来调整进度百分比的小按钮
    gantt.config.drag_resize = true; // 允许用户通过拖拽任务的条形图的两端来改变工期
    gantt.config.drag_move = true; // 允许用户拖动条形图来改变位置

    gantt.config.autoscroll = true;
    // gantt.config.start_date = new Date(2018, 1, 1);
    // gantt.config.end_date = new Date(2018, 12, 31);
    // 自动大小自适应
    leftFormat();
    rightFormat();
    //添加今日的 Marker Line
    gantt.plugins({
      marker: true,
    });
    gantt.addMarker({
      start_date: new Date(),
      text: "今日",
    });
    //禁用原来自带的弹窗
    gantt.attachEvent(
      "onBeforeLightbox",
      () => false, // 返回 false
      {}
    );
    //双击事件

    // gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
    //   //any custom logic here
    //   console.log(id, mode, e);
    // });
    gantt.attachEvent("onAfterTaskUpdate", function (id, item) {
      //any custom logic here
      console.log(id, item);
    });
    gantt.attachEvent(
      "onTaskDblClick",
      function (id, e) {
        console.log("id", id, e);
        return false;
      },
      {}
    );
    //空点击
    gantt.attachEvent("onTaskRowClick", function (id, row) {
      //any custom logic here
      console.log(id, row);
    });
    gantt.attachEvent("onGridHeaderClick", function (name, e) {
      //any custom logic here
      console.log(name, e);
    });
    gantt.init(ganttRef.current);
    gantt.parse(data);
  };
  const leftFormat = () => {
    // 参数简析： **ColumsItem[]**
    // 1. name: 'text' [String] , 索取的 tasks 里 **Task[]** 的 Task 的属性
    // 2. label: 'xxx' [String], 当前栏显示的文本
    // 3. tree: true [Boolean]，当前的任务是否为树结构这样
    // 4. align: [String: left|right|center]，label文本位置属性
    // 5. template: [Function]，函数类型，入参是 obj，即为当前的 Task 对象
    gantt.config.columns = [
      {
        name: "text",
        label: "任务名称",
        tree: true,
        width: "120",
        align: "left",
        template: function (obj: any) {
          return obj.text;
        },
      },
      {
        name: "start_date",
        label: "开始时间",
        width: "140",
        align: "center",
        template: function (obj: any) {
          return obj.start_date;
        },
      },
      {
        name: "duration",
        label: "周期",
        width: "40",
        align: "center",
        template: function (obj: any) {
          return `${obj.duration} 天`;
        },
      },
      // {
      //   name: "progress",
      //   label: "进度",
      //   width: "*",
      //   align: "center",
      //   template: function (obj: any) {
      //     return `${obj.progress * 100}%`;
      //   },
      // },
    ];
  };
  const rightFormat = () => {
    gantt.config.xml_date = "%Y-%m-%d"; // 日期格式化的匹配格式
    gantt.config.scale_height = 90; // 日期栏的高度

    gantt.config.scales = [
      { unit: "year", step: 1, format: "%Y" },
      { unit: "week", step: 1, format: weekFormat },
      { unit: "day", step: 1, format: dayFormat },
    ];
  };
  const weekFormat = function (date: any) {
    const mouthMap: { [key: string]: string } = {
      Jan: "一月",
      Feb: "二月",
      Mar: "三月",
      Apr: "四月",
      May: "五月",
      Jun: "六月",
      Jul: "七月",
      Aug: "八月",
      Sept: "九月",
      Oct: "十月",
      Nov: "十一月",
      Dec: "十二月",
    };
    // 可以时使用dayjs 处理返回
    const dateToStr = gantt.date.date_to_str("%d");
    const mToStr = gantt.date.date_to_str("%M");
    const endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
    // 处理一下月份
    return `${dateToStr(date)} 日 - ${dateToStr(endDate)} 日 (${
      mouthMap[mToStr(date) as string]
    })`;
  };
  const dayFormat = function (date: any) {
    const weeks = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    return `${weeks[dayjs(date).day()]}( ${dayjs(date).date()} )`;
  };
  // 切换 年 季 月 周 日视图
  // const ganttChangeDateView = (type) => {
  //   switch (type) {
  //     case "y":
  //       gantt.config.scale_unit = "year";
  //       gantt.config.step = 1;
  //       gantt.config.date_scale = "%Y年";
  //       gantt.templates.date_scale = null;
  //       break;
  //     case "m":
  //       gantt.config.scale_unit = "month";
  //       gantt.config.step = 1;
  //       gantt.config.date_scale = "%m月";
  //       gantt.templates.date_scale = null;

  //       break;
  //     case "w":
  //       gantt.config.scale_unit = "week";
  //       gantt.config.step = 1;
  //       gantt.config.date_scale = "第%w周";
  //       gantt.templates.date_scale = null;

  //       break;
  //     case "d":
  //       gantt.config.scale_unit = "day";
  //       gantt.config.step = 1;
  //       gantt.config.date_scale = "%m月%d日";
  //       gantt.templates.date_scale = null;
  //       break;
  //   }
  //   gantt.render();
  // };
  return (
    <div className="plan">
      <Header title="执行"></Header>
      <div ref={ganttRef} className="plan-gantt"></div>
    </div>
  );
};
export default Gannt;
