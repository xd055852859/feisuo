
import ClickOutSide from "@/components/clickOutside";
import "./index.scss";
interface FreeModalProp {
  children: any;
  visible: boolean;
  dropStyle: any;
  onClose?: any;
  title?: string | null;
  closeType?: number;
  showCloseIcon?: boolean;
}

const FreeModal: React.FC<FreeModalProp> = (prop) => {
  const {
    children,
    visible,
    dropStyle,
    onClose,
    title,
    closeType,
    showCloseIcon,
  } = prop;
  return (
    <>
      {visible ? (
        <ClickOutSide onClickOutside={onClose ? onClose : () => {}}>
            <div
              className="common-freeModal"
              style={dropStyle}
              onMouseLeave={() => {
                if (closeType === 1) {
                  onClose();
                }
              }}
            >
              {title ? (
                <div className="common-freeModal-title">
                  {title}
                  {showCloseIcon ? <div></div> : null}
                </div>
              ) : null}
              <div
                className="common-freeModal-info"
                style={{ height: title ? "calc(100% - 53px)" : "100%" }}
              >
                {children}
              </div>
            </div>
        </ClickOutSide>
      ) : null}
    </>
  );
};
export default FreeModal;
