import { componentsStylesType } from "@/data/type/componentStyles";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import styled from "styled-components";

import Calendar from "@/assets/svg/icons/s_calendar.svg";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface Props {
  value?: any;
  onChange: (date:Date) => void;
  picker?: 'date' | 'month' | 'time' | 'year' | 'quarter' | 'week';
  format?: string;
  className?: string;
  status?: '' | 'error' | 'warning';
  showTime?: boolean;
  disabled?: boolean;
  presets?: 'pre' | 'post';
  placeholder?: string;
  styles?: componentsStylesType;
  suffixIcon?: null | 'down' | 'cal';
  defaultValue?: any;
}

const AntdDatePicker: React.FC<Props> = ({
  value,
  onChange,
  picker,
  format,
  className,
  status,
  showTime,
  disabled,
  presets,
  placeholder,
  styles,
  suffixIcon,
  defaultValue,
}) => {
  const datePresetsPre = [
    {label:'1일 전', value:dayjs().add(-1, 'day')},
    {label:'7일 전', value:dayjs().add(-7, 'day')},
    {label:'1개월 전', value:dayjs().add(-1, 'month')},
    {label:'3개월 전', value:dayjs().add(-3, 'month')},
    {label:'6개월 전', value:dayjs().add(-6, 'month')},
    {label:'1년 전', value:dayjs().add(-1, 'year')},
    {label:'2년 전', value:dayjs().add(-2, 'year')},
    {label:'3년 전', value:dayjs().add(-3, 'year')},
  ]
  const datePresetsPost = [
    {label:'1일 후', value:dayjs().add(1, 'day')},
    {label:'7일 후', value:dayjs().add(7, 'day')},
    {label:'1개월 후', value:dayjs().add(1, 'month')},
    {label:'3개월 후', value:dayjs().add(3, 'month')},
    {label:'6개월 후', value:dayjs().add(6, 'month')},
    {label:'1년 후', value:dayjs().add(1, 'year')},
    {label:'2년 후', value:dayjs().add(2, 'year')},
    {label:'3년 후', value:dayjs().add(3, 'year')},
  ]

  return (
    <AntdDatePickerStyled
      $bg={styles?.bg?styles.bg:'#FFF'}
      $bw={styles?.bw?styles.bw:'1px'}
      $bc={styles?.bc?styles.bc:'#979797'}
      $br={styles?.br?styles.br:'6px'}
    >
      <DatePicker 
        value={dayjs(value).isValid() ? value : null}
        onChange={onChange}
        picker={picker||'date'}
        format={{format:format||'YYYY-MM-DD'}}
        className={`${className} bg-[#000]`}
        status={status}
        showTime={showTime}
        disabled={disabled}
        presets={presets==='pre'?datePresetsPre:presets==='post'?datePresetsPost:[]}
        placeholder={placeholder}
        suffixIcon={suffixIcon==='down'?<DownOutlined />:suffixIcon==='cal'?<Calendar width="16" height="17"/>:null}
        defaultValue={defaultValue}
      />
    </AntdDatePickerStyled>
  )
}

const AntdDatePickerStyled = styled.div<{
  $bg: string;
  $bw: string;
  $bc: string;
  $br: string;
}>`
  .ant-picker {
    background: ${({ $bg }) => $bg} !important;
    border-radius: ${({ $br }) => $br} !important;
    border-width: ${({ $bw }) => $bw} !important;
    border-color: ${({ $bc }) => $bc} !important;
    
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  }
`

export default AntdDatePicker;