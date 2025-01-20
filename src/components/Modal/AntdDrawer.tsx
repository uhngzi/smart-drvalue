import { Drawer } from "antd"
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  open: boolean;
  close: ()=>void;
  placement?: 'right' | 'left' | 'top' | 'bottom';
  width?: number;
}

const AntdDrawer: React.FC<Props> = ({
  children,
  open,
  close,
  placement = "right",
  width = 510,
}) => {
  return (
    <AntdDrawerStyled
      closeIcon={null}
      placement={placement}
      open={open}
      onClose={close}
      width={width}
    >
        {children}
    </AntdDrawerStyled>
  )
}

const AntdDrawerStyled = styled(Drawer)<{

}>`
  .ant-drawer-body {
    padding:0
  }
`

export default AntdDrawer;