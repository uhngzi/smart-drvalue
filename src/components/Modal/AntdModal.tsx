import { Modal } from "antd";
import styled from "styled-components";

import Close from "@/assets/svg/icons/s_close.svg";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: any;
  contents?: any;
  footer?: any;
  width?: number;
}

const CustomModal = styled(Modal)`
  .ant-modal-content {
    background: #F5F6FA;
    border-radius: 14px;
    padding: 0;
  }
`

const AntdModal: React.FC<Props> = ({
  open,
  setOpen,
  title,
  contents,
  footer,
  width,
}) => {
  return (
    <CustomModal 
      open={open}
      closeIcon={null}
      width={width}
      footer={footer||null}
      centered
    >
        <div className="w-full h-80 px-30 h-center justify-between">
          <p className="text-20 font-semibold ">{title}</p>
          <p 
            className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
            onClick={()=>setOpen(false)}
          >
            <Close />
          </p>
        </div>
        <div className="w-full px-20 pb-20">
          {contents}
        </div>
    </CustomModal>
  )
}

export default AntdModal;

