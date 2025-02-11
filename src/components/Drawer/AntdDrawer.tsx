import { Drawer } from "antd"
import styled, { css } from "styled-components";

interface Props {
  children: React.ReactNode;
  open: boolean;
  close: ()=>void;
  placement?: 'right' | 'left' | 'top' | 'bottom';
  width?: number;
  maskClosable?: boolean;
  mask?: boolean;
  getContainer?: boolean;
  style?: React.CSSProperties;
}

const AntdDrawer: React.FC<Props> = ({
  children,
  open,
  close,
  placement = "right",
  width = 510,
  maskClosable = true,
  mask = true,
  getContainer = true,
  style,
}) => {
  return (
    <AntdDrawerStyled
      closeIcon={null}
      placement={placement}
      open={open}
      onClose={close}
      width={width}
      maskClosable={maskClosable}
      mask={mask}
      getContainer={getContainer ? (typeof window !== 'undefined' ? () => document.body : undefined) : false}
      style={style}
    >
      {children}
    </AntdDrawerStyled>
  )
}

const AntdDrawerStyled = styled(Drawer)<{

}>`
  box-shadow: ${({ style }) =>
    style?.boxShadow ||
    `-6px 0 16px 0 rgba(0, 0, 0, 0.08),
     -3px 0 6px -4px rgba(0, 0, 0, 0.12), 
     -9px 0 28px 8px rgba(0, 0, 0, 0.05)`};

  .ant-drawer-body {
    padding:0;
    ${({ style }) =>
      style &&
      css`
        background-color: ${style.backgroundColor};
      `}
  }
`

export default AntdDrawer;