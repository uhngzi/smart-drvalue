import { componentsStylesType } from "@/data/type/componentStyles";
import { Input } from "antd"
import styled from "styled-components";

interface Props {
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  styles?: componentsStylesType;
  placeholder?: string;
  type?: "string" | "number";
}

const AntdInputRound: React.FC<Props> = ({
  value,
  onChange,
  className,
  styles,
  placeholder,
  type,
}) => {
  return (
    <AntdInputStyled
      $ht={styles?.ht?styles.ht:'30px'}
      $bg={styles?.bg?styles.bg:'none'}
      $bw={styles?.bw?styles.bw:'1px'}
      $bc={styles?.bc?styles.bc:'#D9D9D9'}
      className={`${className}`}
    >
      <Input
        value={value}
        onChange={onChange}
        className={`${className}`}
        placeholder={placeholder}
        type={type}
      />
    </AntdInputStyled>
  )
}

const AntdInputStyled = styled.div<{
  $ht: string;
  $bg: string;
  $bw: string;
  $bc: string;
}>`
  width: 100%;
  height: ${({ $ht }) => $ht} !important;

  .ant-input {
    height: ${({ $ht }) => $ht} !important;
    background: ${({ $bg }) => $bg} !important;
    border-width: ${({ $bw }) => $bw} !important;
    border-color: ${({ $bc }) => $bc} !important;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  }
`

export default AntdInputRound