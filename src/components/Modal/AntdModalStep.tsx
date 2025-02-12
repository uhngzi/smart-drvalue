import { Modal, Steps } from "antd";
import styled from "styled-components";

import Close from "@/assets/svg/icons/s_close.svg";
import { createStyles } from "antd-style";

interface Props {
  items: any[];
  current: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: any;
  contents?: any;
  footer?: any;
  width?: number;
  isInnerDrawer?: boolean;
  drawerContents?: any;
  onClose?: () => void;
  full?: boolean;
}

export const AntdModalStep2: React.FC<Props> = ({
  items,
  current,
  open,
  setOpen,
  title,
  contents,
  footer,
  width,
  isInnerDrawer,
  drawerContents,
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
      centered
    >
      <div className="relative overflow-y-auto" style={{height: full ? '100%' : 'fit-content'}}>

        <div className="w-full h-80 shrink-0 gap-10 px-30 v-between-h-center">
          <Steps
            current={current}
            items={items}
          />
          <p className="text-20 font-medium ">{title}</p>
          <p 
            className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
            onClick={onClose || (()=>setOpen(false))}
          >
            <Close />
          </p>
        </div>
        <div className="w-full flex-1 px-20 pb-20" style={{ height: 'calc(100% - 80px)' }}>
          {contents}
        </div>
      {!!isInnerDrawer && (<>{drawerContents}</>)}
      </div>
    </Modal>
  )
}

