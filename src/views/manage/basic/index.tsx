import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/header/header";
import { Button, Input } from "antd";
import { uploadFile } from "@/services/util";
import { message } from "@/hooks/EscapeAntd";
import api from "@/services/api";
import _ from "lodash";
import { setSpaceDetail } from "@/store/space";
import { SpaceDetail } from "@/interface/Space";
import { ResultProps } from "@/interface/Common";
const Basic: React.FC = (props) => {
  const {} = props;
  const { spaceKey, spaceDetail } = useSelector(
    (state: RootState) => state.space
  );
  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  useEffect(() => {
    if (spaceDetail?.spaceInfo) {
      setName(spaceDetail.spaceInfo.name);
      setLogo(spaceDetail.spaceInfo.logo);
    }
  }, [spaceDetail?.spaceInfo]);
  const updateSpace = async () => {
    let updateRes = (await api.request.patch("space", {
      spaceKey: spaceKey,
      name: name,
      logo: logo,
    })) as ResultProps;
    if (updateRes.msg === "OK") {
      message.success("编辑空间成功");
      let detail = _.cloneDeep(spaceDetail);
      detail.spaceInfo = {
        ...detail.spaceInfo,
        name: name,
        logo: logo,
        
      };
      dispatch(setSpaceDetail(detail));
    }
  };
  const uploadImage = (file, type) => {
    let mimeType = ["image/*"];
    if (file) {
      uploadFile(file, mimeType, async (url, name) => {
        setLogo(url);
      });
    }
  };
  return (
    <div className="basic box">
      <Header title="基础设置">
        <Button type="primary" onClick={updateSpace}>
          保存
        </Button>
      </Header>
      <div className="basic-container">
        <div className="basic-logo">
          <div className="upload-button upload-img-button logo-box">
            {logo ? (
              <img
                src={logo}
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
                uploadImage(e.target.files[0], "space");
              }}
              className="upload-img"
            />
          </div>
        </div>
        <div className="basic-input">
          <div>拥有者 : </div>
          <div>{spaceDetail?.spaceInfo.ownerInfo.userName}</div>
        </div>
        <div className="basic-input">
          <div>空间名 : </div>
          <div>
            <Input
              placeholder="请输入空间名"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="basic-input">
          <div>成员数 : </div>
          <div>{spaceDetail?.spaceInfo.memberCount}</div>
        </div>
        <div className="basic-input">
          <div>空间容量 : </div>
          <div>{}</div>
        </div>
      </div>
    </div>
  );
};
export default Basic;
