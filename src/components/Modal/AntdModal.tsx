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
  onClose?: () => void;
  full?: boolean;
}

const AntdModal: React.FC<Props> = ({
  open,
  setOpen,
  title,
  contents,
  footer,
  width,
  onClose,
  full,
}) => {
  const CustomModal = styled(Modal)<{
    full?: boolean
  }>`
    & .ant-modal-content {
      background: #F5F6FA;
      border-radius: 14px;
      padding: 0;
      max-height: ${full ? '100vh' : '90vh'} !important;
      overflow: hidden;
  
      & .ant-modal-body {
        overflow: hidden;
        max-height: ${full ? '100vh' : '90vh'} !important;
        display: flex;
        flex-direction: column;
      }
    }
  `

  return (
    <CustomModal 
      open={open}
      closeIcon={null}
      width={full ? '100%' : width}
      footer={footer||null}
      destroyOnClose={false}
      centered
    >
      <div className="w-full h-80 shrink-0 px-30 h-center justify-between">
        <p className="text-20 font-medium ">{title}</p>
        <p 
          className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
          onClick={onClose || (()=>setOpen(false))}
        >
          <Close />
        </p>
      </div>
      <div className="w-full flex-1 px-20 pb-20 overflow-y-auto">
        {contents}
      </div>
    </CustomModal>
  )
}

export default AntdModal;

