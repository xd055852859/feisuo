import ClickOutSide from "@/components/clickOutside";
import "./index.scss";
import { Button } from "antd";
import closePng from "@/assets/img/common/close.png";
interface FreeDialogProp {
  children: any;
  visible: boolean;
  dialogStyle: any;
  onOK?: any;
  onClose?: any;
  title?: string;
  footer?: boolean;
  showMask?: boolean;
  closePngState?: boolean;
  unOut?: boolean;
  noAnimate?: boolean;
}

const FreeDialog: React.FC<FreeDialogProp> = (prop) => {
  const {
    children,
    visible,
    dialogStyle,
    onClose,
    onOK,
    title,
    footer,
    showMask,
    closePngState,
    unOut,
  } = prop;
  const dialog = () => {
    return (
      <div
        className="dialog"
        //     : 'dialog animate__animated animate__slideInRight'
        // }
        style={dialogStyle}
        id="dialog"
      >
        {title ? (
          <div className="dialog-title">
            {title}
            {!showMask && !closePngState ? (
              <img
                src={closePng}
                onClick={onClose}
                style={{ height: "25px", width: "25px", cursor: "pointer" }}
                alt=""
              />
            ) : null}
          </div>
        ) : null}
        {showMask ? (
          <img
            src={closePng}
            className="dialog-close"
            onClick={onClose}
            style={title ? { top: "17px" } : {}}
            alt=""
          />
        ) : null}
        <div className="dialog-info" style={!title ? { height: "100%" } : {}}>
          <div
            className="dialog-container"
            style={
              !footer
                ? { height: "100%" }
                : {
                    overflow: "auto",
                  }
            }
          >
            {children}
          </div>
          {footer ? (
            <div className="dialog-button">
              <Button
                type="primary"
                onClick={onOK}
                style={{ marginRight: "10px" }}
              >
                确认
              </Button>
              <Button onClick={onClose}>取消</Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };
  return (
    <>
      {visible ? (
        showMask ? (
          <div className="mask">{dialog()}</div>
        ) : (
          <ClickOutSide
            onClickOutside={() => {
              if (unOut) {
                onClose();
              }
            }}
          >
            {dialog()}
          </ClickOutSide>
        )
      ) : null}
    </>
  );
};
export default FreeDialog;
