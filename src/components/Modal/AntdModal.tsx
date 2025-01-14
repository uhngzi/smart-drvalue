import { Modal } from "antd";
import styled from "styled-components";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: any;
  contents?: any;
  footer?: any;
  width?: number;
}

const AntdModal: React.FC<Props> = ({
  open,
  setOpen,
  title,
  contents,
  footer,
  width,
}) => {

  return (
    <>
      <Modal 
        open={open}
        closeIcon={null}
        width={width}
        footer={footer||null}
        centered
      >
        <div className="w-full h-70 text-20 font-semibold">
          {title}
        </div>
        <div className="w-full">
          {contents}
        </div>
      </Modal>
    </>
  )
}

const AntdModalStyled = styled.div<{

}>`

`

export default AntdModal;

