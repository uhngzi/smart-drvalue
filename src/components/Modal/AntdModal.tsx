import { Modal } from "antd";
import styled from "styled-components";

import Close from "@/assets/svg/icons/s_close.svg";
import { createStyles } from "antd-style";
import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: any;
  contents?: any;
  footer?: any;
  width?: number | string;
  onClose?: () => void;
  full?: boolean;
  bgColor?: string;
  mask?: boolean;
  maskClosable?: boolean;
  draggable?: boolean;
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
  bgColor,
  mask,
  maskClosable = true,
  draggable,
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
      background: bgColor || '#F5F6FA',
      borderRadius: '14px',
      padding: 0,
      maxHeight: full ? '100vh' : '90vh'
    },
  };

  const [dragFlag, setDragFlag] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (open && draggable && !dragFlag) {
      const timer = setTimeout(() => {
        const el = modalRef.current;
        if (el) {
          const modalW = el.offsetWidth;
          const modalH = el.offsetHeight;
  
          const centerX = window.innerWidth / 2 - modalW / 2;
          const centerY = window.innerHeight / 2 - modalH / 2;
  
          setPosition({ x: centerX, y: centerY });
        }
      }, 0);
  
      return () => clearTimeout(timer);
    }
  }, [open, draggable]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return;
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !modalRef.current) return;
    
      const el = modalRef.current;
      const modalW = el.offsetWidth;
      const modalH = el.offsetHeight;
    
      let nextX = e.clientX - offset.current.x;
      let nextY = e.clientY - offset.current.y;
    
      // 화면 바깥으로 안 나가게 clamp
      nextX = Math.max(0, Math.min(nextX, window.innerWidth - modalW));
      nextY = Math.max(0, Math.min(nextY, window.innerHeight - modalH));
    
      setPosition({ x: nextX, y: nextY });
      setDragFlag(true);
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <Modal 
      classNames={classNames}
      styles={modalStyles}
      open={open}
      closeIcon={null}
      destroyOnClose={false}
      width={full ? '100%' : width}
      footer={footer||null}
      centered={!draggable ? dragFlag : true}
      mask={mask}
      maskClosable={maskClosable}
      modalRender={draggable ? (modal) => (
        <div
          ref={modalRef}
          style={dragFlag ? {
            position: "fixed",
            top: `${position.y}px`,
            left: `${position.x}px`,
            width: full ? '100%' : width || 600,
            minWidth: 320,
            maxWidth: "100vw",
            transform: "none",
          } : {
            width: full ? '100%' : width || 600,
            minWidth: 320,
            maxWidth: "100vw",
          }}
        >
          {modal}
        </div>
      ) : (modal) => (<div>{modal}</div>)}
    >
      <div
        className={`w-full h-80 shrink-0 px-30 v-between-h-center ${draggable ? "cursor-grab" : ""}`}
        onMouseDown={handleMouseDown}
      >
        <p className="text-20 font-medium ">{title}</p>
        <p 
          className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
          onClick={onClose ? () => {
            setDragFlag(false);
            onClose();
          } : ()=>{
            setDragFlag(false);
            setOpen(false);
          }}
        >
          <Close />
        </p>
      </div>
      <div className="w-full flex-1 px-20 pb-20 overflow-y-auto">
        {contents}
      </div>
    </Modal>
  )
}

export default AntdModal;

