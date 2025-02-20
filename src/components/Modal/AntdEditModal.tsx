import { Modal } from "antd";
import styled from "styled-components";

import Close from "@/assets/svg/icons/s_close.svg";
import DeleteCircle from "@/assets/svg/icons/delete-circle.svg";
import { createStyles } from "antd-style";

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

const AntdEditModal: React.FC<Props> = ({
  open,
  setOpen,
  title,
  contents,
  footer,
  width,
  onClose,
  full,
}) => {
  const useStyle = createStyles(({ token }) => ({
    'my-modal-body': {
      overflow: 'hidden',
      maxHeight: full ? '100vh' : '90vh',
      display: 'flex',
      flexDirection: 'column',
    },
    'my-modal-content': {
      background: '#F5F6FA',
      borderRadius: '14px',
      padding: 0,
      maxHeight: full ? '100vh' : '90vh',
    },
  }));
  
  const { styles } = useStyle();

  const classNames = {
    body: styles['my-modal-body'],
    content: styles['my-modal-content'],
  };

  const modalStyles = {
    body: {
      maxHeight: full ? '100vh' : '90vh',
    },
    content: {
      background: '#F5F6FA',
      borderRadius: '14px',
      padding: 0,
      maxHeight: full ? '100vh' : '90vh'
    },
  };

  return (
    <Modal 
      classNames={classNames}
      styles={modalStyles}
      open={open}
      closeIcon={null}
      destroyOnClose={false}
      width={full ? '100%' : width}
      footer={footer||null}
      zIndex={1999}
      centered
    >
      <div className="w-full flex-1 px-20 pb-20 overflow-y-auto relative">
        <div className="w-24 h-24 cursor-pointer absolute" style={{right: 30, top: 20}} onClick={onClose||(()=>setOpen(false))}>
          <DeleteCircle />
        </div>
        {contents}
      </div>
    </Modal>
  )
}

export default AntdEditModal;

