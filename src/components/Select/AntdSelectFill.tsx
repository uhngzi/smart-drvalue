import { componentsStylesType, selectType } from "@/data/type/componentStyles";
import { Select } from "antd";
import styled from "styled-components";

import Arrow from "@/assets/svg/icons/l_drop_down.svg";

interface Props {
  options: Array<selectType>;
  defaultValue?: any;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  styles?: componentsStylesType;
}

const AntdSelectFill : React.FC<Props> = ({ 
  options, 
  defaultValue, 
  disabled, 
  loading, 
  className,
  styles,
}) => {

  return (
    <AndtSelectStyled
      $ht={styles?.ht?styles.ht:'30px'}
      $bg={styles?.bg?styles.bg:'#F9F9FB'}
      $bw={styles?.bw?styles.bw:'1px'}
      $bc={styles?.bc?styles.bc:'#D5D5D5'}
      $fs={styles?.fs?styles.fs:'14px'}
    >
      <Select
        className={`w-full rounded-0 ${className}`}
        options={options}
        defaultValue={defaultValue}
        disabled={disabled}
        loading={loading}
        suffixIcon={<Arrow className="w-18 h-15" stroke="#979797" stroke-width="2.6px" />}
      />
    </AndtSelectStyled>
  )
}

const AndtSelectStyled = styled.div<{
  $ht: string;
  $bg: string;
  $bw: string;
  $bc: string;
  $fs: string;
}>`
  width: fit-content;
  display: contents;
  height: ${({ $ht }) => $ht} !important;
  font-size: 12px;

  .ant-select {
    border-radius: 0;
    height: ${({ $ht }) => $ht} !important;
  }

  .ant-select-selector {
    border-radius: 0;
    height: ${({ $ht }) => $ht} !important;
    background: ${({ $bg }) => $bg} !important;
    border-width: ${({ $bw }) => $bw} !important;
    border-color: ${({ $bc }) => $bc} !important;
    font-size: ${({ $fs }) => $fs} !important;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  }
`

export default AntdSelectFill;