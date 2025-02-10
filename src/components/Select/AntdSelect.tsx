import { componentsStylesType, selectType } from "@/data/type/componentStyles";
import { Select } from "antd";
import styled from "styled-components";

import Arrow from "@/assets/svg/icons/l_drop_down.svg";

interface Props {
  options: Array<selectType>;
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  styles?: componentsStylesType;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>;
}

const AntdSelect : React.FC<Props> = ({ 
  options, 
  defaultValue, 
  disabled, 
  loading, 
  className,
  styles,
  value,
  onChange,
  onKeyDown,
}) => {

  return (
    <AndtSelectStyled
      $ht={styles?.ht?styles.ht:'32px'}
      $bg={styles?.bg?styles.bg:'none'}
      $bw={styles?.bw?styles.bw:'1px'}
      $bc={styles?.bc?styles.bc:'#D9D9D9'}
      $pd={styles?.pd?styles.pd:'0 11px'}
    >
      <Select
        value={value}
        onChange={onChange}
        className={`w-full ${className}`}
        options={options}
        defaultValue={defaultValue}
        disabled={disabled}
        loading={loading}
        suffixIcon={<Arrow className="w-18 h-15" stroke="#979797" stroke-width="2.6px" />}
        onKeyDown={onKeyDown}
      />
    </AndtSelectStyled>
  )
}

const AndtSelectStyled = styled.div<{
  $ht: string;
  $bg: string;
  $bw: string;
  $bc: string;
  $pd: string;
}>`
  width: fit-content;
  display: contents;
  height: ${({ $ht }) => $ht} !important;

  .ant-select {
    height: ${({ $ht }) => $ht} !important;
  }

  .ant-select-selector {
    height: ${({ $ht }) => $ht} !important;
    background: ${({ $bg }) => $bg} !important;
    border-width: ${({ $bw }) => $bw} !important;
    border-color: ${({ $bc }) => $bc} !important;
    padding: ${({ $pd }) => $pd} !important;
    border-radius: 2px;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  }
`

export default AntdSelect;