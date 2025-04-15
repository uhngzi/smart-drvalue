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
  value?: any;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  readonly?: boolean;
  placeholder?: string;
  tabIndex?: number;
  dropWidth?: string;
}

const AntdSelectFill : React.FC<Props> = ({ 
  options, 
  defaultValue, 
  disabled, 
  loading, 
  className,
  styles,
  value,
  onChange,
  readonly,
  placeholder,
  tabIndex,
  dropWidth,
}) => {

  return (
    <AndtSelectStyled
      $ht={styles?.ht?styles.ht:'30px'}
      $bg={styles?.bg?styles.bg:'#F9F9FB'}
      $bw={styles?.bw?styles.bw:'1px'}
      $bc={styles?.bc?styles.bc:'#D5D5D5'}
      $fs={styles?.fs?styles.fs:'14px'}
      $pd={styles?.pd?styles.pd:'0 11px'}
      $br={styles?.br?styles.br:'0'}
      $readOnly={readonly ?? false}
    >
      <Select
        value={value}
        onChange={onChange}
        className={`w-full rounded-0 ${className}`}
        options={options}
        defaultValue={defaultValue}
        disabled={disabled ?? readonly}
        loading={loading}
        suffixIcon={<Arrow className="w-18 h-15" stroke="#979797" stroke-width="2.6px" />}
        style={readonly?{color:"#222222 !important"}:{}}
        dropdownStyle={dropWidth ? { minWidth: "max-content", width: dropWidth } : { minWidth: "max-content" }}
        placeholder={placeholder}
        tabIndex={tabIndex}
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
  $pd: string;
  $br: string;
  $readOnly: boolean;
}>`
  width: fit-content;
  display: contents;
  height: ${({ $ht }) => $ht} !important;
  font-size: 14px;

  .ant-select {
    border-radius: ${({ $br }) => $br} !important;
    height: ${({ $ht }) => $ht} !important;
  }

  .ant-select-selector {
    border-radius: ${({ $br }) => $br} !important;
    height: ${({ $ht }) => $ht} !important;
    background: ${({ $bg }) => $bg} !important;
    border-width: ${({ $bw }) => $bw} !important;
    border-color: ${({ $bc }) => $bc} !important;
    font-size: ${({ $fs }) => $fs} !important;
    padding: ${({ $pd }) => $pd} !important;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    ${({ $readOnly }) =>
      $readOnly &&
      `
      color: #222222 !important;
    `}
  }

  .ant-select-selection-item {
    ${({ $readOnly }) =>
      $readOnly &&
      `
      color: #222222 !important;
    `}
  }
`

export default AntdSelectFill;