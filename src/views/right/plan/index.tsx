import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Header from "@/components/header/header";
import { Drawer, Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import api from "@/services/api";
import _ from "lodash";
import { ResultProps } from "@/interface/Common";
import TaskList from "./taskList";
const Plan: React.FC = (props) => {
  const {} = props;
  const { user } = useSelector((state: RootState) => state.auth);
  const { spaceList, spaceMemberList, spaceRole, spaceKey } = useSelector(
    (state: RootState) => state.space
  );
  const dispatch = useDispatch();
  const [planDate, setPlanDate] = useState<any>([]);
  const [plans, setPlans] = useState<any>({});
  const [plan, setPlan] = useState<any>(null);
  const [targetMemberkey, setTargetMemberkey] = useState<string>("");
  const [targetBoardkey, setTargetBoardkey] = useState<string>("");
  const [planBoard, setPlanBoard] = useState<any>(null);
  const [joined, setJoined] = useState<boolean>(true);
  const [planMonth, setPlanMonth] = useState<number>(0);
  const [moveState, setMoveState] = useState<boolean>(false);
  const [moveIndex, setMoveIndex] = useState<number>(-1);
  const [monthStart, setMonthStart] = useState<number>(0);
  const [monthEnd, setMonthEnd] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [taskVisible, setTaskVisible] = useState<boolean>(false);
  useEffect(() => {
    if (spaceList) {
      getDate();
    }
  }, [spaceList, month]);
  useEffect(() => {
    if (user) {
      setTargetMemberkey(user._key);
    }
  }, [user]);
  useEffect(() => {
    let monthDate: any = dayjs().add(planMonth, "month");
    // if (planMonth > 0) {
    //   monthDate = dayjs().add(planMonth, "month");
    // } else if (planMonth < 0) {
    //   monthDate = dayjs().add(planMonth, "month");
    // } else {
    //   month = dayjs().month() + 1;
    // }
    setMonth(monthDate.month() + 1);
    setMonthStart(monthDate.startOf("month").startOf("day").valueOf());
    setMonthEnd(monthDate.endOf("month").endOf("day").valueOf());
  }, [planMonth]);
  useEffect(() => {
    if (targetMemberkey) {
      chooseMember();
    }
  }, [targetMemberkey, month, joined]);
  //获取新增日期
  const getDate = () => {
    let listDate: any = [];
    for (
      let index = 0;
      index <
      dayjs()
        .month(month - 1)
        .daysInMonth();
      index++
    ) {
      let day = dayjs()
        .month(month - 1)
        .startOf("month")
        .startOf("day")
        .add(index, "day");
      listDate.push({
        day: day.date(),
        week: ["日", "一", "二", "三", "四", "五", "六"][day.day()],
        year: day.year(),
        month: day.month() + 1,
        time: day.startOf("day").valueOf(),
      });
    }
    setPlanDate(listDate);
  };
  // const getDatePlan = (daylist, dayDate) => {
  //   let obj = {};
  //   daylist.forEach((item) => {
  //     let list: any = [];
  //     for (let index = 0; index < dayDate.daysInMonth(); index++) {
  //       let day = dayDate.startOf("month").startOf("day").add(index, "day");
  //       list.unshift({
  //         key: day.format("YYYY-MM-DD"),
  //         time: day.startOf("day").valueOf(),
  //         choose: false,
  //       });
  //     }
  //     obj[item._key] = {
  //       planDate: list,
  //     };
  //   });
  //   setPlans(obj);
  // };
  const chooseMember = async () => {
    const planRes = (await api.request.get("plan/space", {
      spaceKey: spaceKey,
      memberKey: targetMemberkey,
      begTime: monthStart,
      endTime: monthEnd,
      joined: joined,
    })) as ResultProps;
    if (planRes.msg === "OK") {
      let nameList: any = [];
      let planList: any = [];
      planRes.data.forEach((item) => {
        planList.push(item.dateArr ? item.dateArr : []);
      });
      // getDatePlan(planRes.data, dayDate);
      setPlanBoard(planRes.data);
      setPlan(planList);
    }
  };
  const chooseDate = (time, planIndex) => {
    let list = _.cloneDeep(plan);
    let index = list[planIndex].indexOf(time);
    if (index === -1) {
      list[planIndex].push(time);
    } else {
      list[planIndex].splice(index, 1);
    }
    setPlan(list);
  };
  const saveDate = async (index, list) => {
    const saveRes = (await api.request.patch("bookMember/plan", {
      bookKey: planBoard[index]._key,
      memberKey: targetMemberkey,
      dateArr: list[index],
      begTime: monthStart,
      endTime: monthEnd,
    })) as ResultProps;
    if (saveRes.msg === "OK") {
      console.log("保存成功");
    }
  };
  return (
    <div className="plan">
      <Header title="计划" />
      <div className="plan-header">
        <div className="plan-header-left">
          {/* <Select
            value={targetSpacekey}
            onChange={(value) => {
              setTargetSpacekey(value);
            }}
            style={{ marginRight: "20px" }}
            options={spaceList?.map((item) => {
              return { value: item._key, label: item.name };
            })}
          /> */}
          <Select
            value={targetMemberkey}
            onChange={(value) => {
              setTargetMemberkey(value);
            }}
            options={spaceMemberList?.map((item) => {
              return { value: item.userKey, label: item.userName };
            })}
          />
          <div className="plan-header-month">
            <div
              className="icon-point"
              onClick={() => {
                setPlanMonth(planMonth - 1);
              }}
            >
              <LeftOutlined />
            </div>
            {month}月
            <div
              className="icon-point"
              onClick={() => {
                setPlanMonth(planMonth + 1);
              }}
            >
              <RightOutlined />
            </div>
          </div>
        </div>
        <div className="plan-header-right">
          <Select
            value={joined}
            onChange={(value) => {
              setJoined(value);
            }}
            options={[
              { value: true, label: "已加入" },
              { value: false, label: "全部" },
            ]}
          />
        </div>
      </div>
      <div className="plan-container">
        <div className="plan-left">
          <div className="plan-left-header"></div>
          <div className="plan-right-container">
            {planBoard?.map((item, index) => {
              return (
                <div
                  className="plan-left-item"
                  key={"space" + index}
                  onClick={() => {
                    setTaskVisible(true);
                    setTargetBoardkey(item._key);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="plan-right">
          <div className="plan-right-container">
            <div className="plan-right-date">
              {planDate.map((item, index) => {
                return (
                  <div className="plan-date-item" key={"date" + index}>
                    <div>{item.day}</div>
                    <div>{item.week}</div>
                  </div>
                );
              })}
            </div>
            {plan?.map((planItem: any, planIndex: number) => {
              return (
                <div className="plan-right-day" key={"plan" + planIndex}>
                  {planDate.map((item, index) => {
                    return (
                      <div
                        className="plan-right-item"
                        key={"plan" + index + item.time}
                        style={{
                          background:
                            planItem.indexOf(item.time) !== -1 ? "#0091ff" : "",
                        }}
                        // onClick={() => {
                        //   chooseDate(item.time, planIndex);
                        // }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setMoveState(true);
                          setMoveIndex(planIndex);
                          chooseDate(item.time, planIndex);
                        }}
                        onMouseEnter={(e) => {
                          e.preventDefault();
                          if (moveState && planIndex === moveIndex) {
                            chooseDate(item.time, planIndex);
                          }
                        }}
                        onMouseUp={(e) => {
                          e.preventDefault();
                          setMoveState(false);
                          setMoveIndex(-1);
                          saveDate(planIndex, plan);
                        }}
                      >
                        {planItem.indexOf(item.time) !== -1}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Drawer
        title={"任务列表"}
        placement="right"
        onClose={() => {
          setTaskVisible(false);
        }}
        headerStyle={{ display: "none" }}
        open={taskVisible}
        destroyOnClose
        // closeIcon={false}
        width={"35%"}
      >
        <TaskList boardKey={targetBoardkey} />
      </Drawer>
    </div>
  );
};
export default Plan;
