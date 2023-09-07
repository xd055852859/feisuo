import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import Header from "@/components/header/header";
import { Button, Drawer, Input, Modal, Select, Table } from "antd";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { uploadFile } from "@/services/util";
import { message } from "@/hooks/EscapeAntd";
const { Column, ColumnGroup } = Table;
const { confirm } = Modal;
const Tag: React.FC = (props) => {
  const {} = props;
  const { spaceKey } = useSelector((state: RootState) => state.space);
  const dispatch = useDispatch();
  const [tagList, setTagList] = useState<any>([]);
  const [tagSelectList, setTagSelectList] = useState<any>([]);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [tagKey, setTagKey] = useState<string>("");
  const [defaultView, setDefaultView] = useState<number>(1);
  useEffect(() => {
    if (spaceKey) {
      getTag();
      getTagSelect();
    }
  }, [spaceKey]);
  const getTag = async () => {
    const dataRes = (await api.request.get("tag", {
      spaceKey: spaceKey,
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      setTagList(dataRes.data);
      console.log(dataRes.data);
    }
  };
  const getTagSelect = async () => {
    const dataRes = (await api.request.get("dict", {
      type: "viewType",
    })) as ResultProps;
    if (dataRes.msg === "OK") {
      let list = dataRes.data.map((item) => {
        return {
          value: item.defaultView,
          label: item.title,
        };
      });
      setTagSelectList(list);
    }
  };
  const uploadImage = (file, type) => {
    let mimeType = ["image/*"];
    if (file) {
      uploadFile(file, mimeType, async (url, name) => {
        setIcon(url);
      });
    }
  };
  const chooseTag = async (tag?: any) => {
    if (tag) {
      setTagKey(tag._key);
      setName(tag.name);
      setIcon(tag.icon);
      setDefaultView(tag.defaultView);
    } else {
      setTagKey("");
      setName("");
      setIcon("");
      setDefaultView(1);
    }
    setAddVisible(true);
  };
  const addTag = async () => {
    const addRes = (await api.request.post("tag", {
      spaceKey: spaceKey,
      name,
      icon,
      defaultView,
    })) as ResultProps;
    if (addRes.msg === "OK") {
      message.success("创建标签成功");
      let list = [...tagList];
      list.push(addRes.data);
      setTagList(list);
      setAddVisible(false);
    }
  };
  const editTag = async () => {
    const addRes = (await api.request.patch("tag", {
      tagKey: tagKey,
      name,
      icon,
    })) as ResultProps;
    if (addRes.msg === "OK") {
      message.success("创建标签成功");
      let list = [...tagList];
      list.push(addRes.data);
      setTagList(list);
    }
  };
  const deleteTag = async (index, tagKey) => {
    confirm({
      title: "删除标签",
      content: "是否删除标签",
      okText: "确认",
      cancelText: "取消",
      async onOk() {
        let list = [...tagList];
        const memberRes = (await api.request.delete("tag", {
          tagKey: tagKey,
        })) as ResultProps;
        if (memberRes.msg === "OK") {
          message.success("删除标签成功");
          list.splice(index, 1);
          setTagList(list);
        }
      },
    });
  };
  return (
    <div className="tag box">
      <Header title="标签设置" />
      <div className="tag-header box-header">
        <div></div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              chooseTag();
            }}
          >
            添加新的类型
          </Button>
        </div>
      </div>
      <div className="tag-table box-table">
        <Table
          dataSource={tagList}
          rowKey={(record) => "table" + record._key}
          pagination={false}
        >
          <Column
            title="图标"
            dataIndex="icon"
            key="icon"
            align="center"
            width={400}
            render={(icon, record, index) => (
              <div className="tag-logo">
                <div className="logo-box">
                  <img src={icon} alt="" />
                </div>
              </div>
            )}
          />
          <Column
            title="默认视图"
            dataIndex="name"
            key="name"
            align="center"
            render={(name, record, index) => (
              //   <>
              //     {role > spaceRole ? (
              //       <Select
              //         value={role}
              //         onChange={(e) => {
              //           changeRole(e, index, record.userKey);
              //         }}
              //         options={ROLE_OPTIONS}
              //       />
              //     ) : (
              //       <div className="member-item-role">
              //         {ROLE_OPTIONS[role + 2].label}
              //       </div>
              //     )}
              //   </>
              <div>{name}</div>
            )}
          />
          <Column
            title="操作"
            key="action"
            align="center"
            width={300}
            render={(_: any, record: any, index) => (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    chooseTag(record);
                  }}
                  style={{ margin: "0px 15px" }}
                >
                  编辑
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    deleteTag(index, record._key);
                  }}
                >
                  删除
                </Button>
              </>
            )}
          />
        </Table>
      </div>
      <Drawer
        title={"新建标签"}
        placement="right"
        onClose={() => {
          setAddVisible(false);
        }}
        open={addVisible}
        bodyStyle={{ padding: "12px 24px" }}
        destroyOnClose
      >
        <div className="tag-create form">
          <div className="tag-logo">
            <div className="upload-button upload-img-button logo-box">
              {icon ? (
                <img
                  src={icon}
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                  className="upload-cover"
                />
              ) : (
                <PlusOutlined className="logo-item" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  //@ts-ignore
                  uploadImage(e.target.files[0], "icon");
                }}
                className="upload-img"
              />
            </div>
          </div>
          <div className="tag-name">
            <Input
              placeholder="请输入标签名称"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          {!tagKey ? (
            <div>
              <div className="form-left">默认视图</div>
              <div className="form-right">
                <Select
                  value={defaultView}
                  onChange={(value) => {
                    setDefaultView(value);
                  }}
                  style={{ width: 250 }}
                  options={tagSelectList}
                />
              </div>
            </div>
          ) : null}
          <div className="form-save">
            <Button
              type="primary"
              style={{ width: "70%" }}
              onClick={() => {
                tagKey ? editTag() : addTag();
                // checkSameName();
              }}
            >
              {tagKey ?"编辑":"新建"}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default Tag;
