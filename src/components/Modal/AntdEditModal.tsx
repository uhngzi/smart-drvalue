import { Modal } from "antd";
import styled from "styled-components";

import Close from "@/assets/svg/icons/s_close.svg";
import DeleteCircle from "@/assets/svg/icons/delete-circle.svg";
import { createStyles } from "antd-style";
import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: any;
  contents?: any;
  footer?: any;
  width?: number;
  onClose?: () => void;
  full?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  draggable?: boolean;
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
  mask = true,
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
      background: '#F5F6FA',
      borderRadius: '14px',
      padding: 0,
      maxHeight: full ? '100vh' : '90vh'
    },
  };

  const modalRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

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
      if (!dragging) return;
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  console.log(draggable);
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
      maskClosable={maskClosable} mask={mask}
      modalRender={draggable ? (modal) => (
        <div
          ref={modalRef}
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            width: full ? '100%' : width || 600,
            minWidth: 320,
            maxWidth: "100vw",
            cursor: dragging ? "grabbing" : "grab",
          }}
        >
          {modal}
        </div>
      ) : (modal) => (<div>{modal}</div>)}
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

