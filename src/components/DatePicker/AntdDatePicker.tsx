import { componentsStylesType } from "@/data/type/componentStyles";
import { ConfigProvider, DatePicker } from "antd";
import { DownOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import styled from "styled-components";
import koKR from "antd/locale/ko_KR";

import Calendar from "@/assets/svg/icons/newcalendar.svg";

interface Props {
  value?: any;
  onChange: (date: Date) => void;
  picker?: "date" | "month" | "time" | "year" | "quarter" | "week";
  format?: string;
  className?: string;
  status?: "" | "error" | "warning";
  showTime?: boolean;
  disabled?: boolean;
  presets?: "pre" | "post";
  placeholder?: string;
  styles?: componentsStylesType;
  suffixIcon?: null | "down" | "cal";
  defaultValue?: any;
  afterDate?: Date | Dayjs | null;
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
  afterDate,
}) => {
  const minDate = afterDate ? dayjs(afterDate) : null;
  
  const disabledDate = (current: Dayjs) => {
    return minDate ? current.isBefore(minDate, "day") : false;
  }

  const datePresetsPre = [
    { label: "1일 전", value: dayjs().add(-1, "day") },
    { label: "7일 전", value: dayjs().add(-7, "day") },
    { label: "1개월 전", value: dayjs().add(-1, "month") },
    { label: "3개월 전", value: dayjs().add(-3, "month") },
    { label: "6개월 전", value: dayjs().add(-6, "month") },
    { label: "1년 전", value: dayjs().add(-1, "year") },
    { label: "2년 전", value: dayjs().add(-2, "year") },
    { label: "3년 전", value: dayjs().add(-3, "year") },
  ];
  const datePresetsPost = [
    { label: "1일 후", value: dayjs().add(1, "day") },
    { label: "7일 후", value: dayjs().add(7, "day") },
    { label: "1개월 후", value: dayjs().add(1, "month") },
    { label: "3개월 후", value: dayjs().add(3, "month") },
    { label: "6개월 후", value: dayjs().add(6, "month") },
    { label: "1년 후", value: dayjs().add(1, "year") },
    { label: "2년 후", value: dayjs().add(2, "year") },
    { label: "3년 후", value: dayjs().add(3, "year") },
  ];

  return (
    <ConfigProvider locale={koKR}>
    <AntdDatePickerStyled
      $bg={styles?.bg ? styles.bg : "#FFF"}
      $bw={styles?.bw ? styles.bw : "1px"}
      $bc={styles?.bc ? styles.bc : "#979797"}
      $br={styles?.br ? styles.br : "6px"}
      $pd={styles?.pd ? styles.pd : "0 11px"}
      $wd={styles?.wd ? styles.wd : "unset"}
      >
      <DatePicker
        value={dayjs(value).isValid() ? dayjs(value) : null}
        onChange={(date) => {
          onChange(date?.toDate() || new Date());
        }}
        onOpenChange={(open) => {
          if (open && !value) {
            onChange(new Date());
          }
        }}
        picker={picker || "date"}
        format={format || "YYYY-MM-DD"}
        className={`${className} bg-[#000]`}
        status={status}
        showTime={showTime}
        disabled={disabled}
        disabledDate={disabledDate}
        presets={presets === "pre" ? datePresetsPre : presets === "post" ? datePresetsPost : []}
        placeholder={placeholder}
        suffixIcon={suffixIcon === "down" ? <DownOutlined /> : suffixIcon === "cal" ? <Calendar /> : null}
        // allowClear={false}
      />
    </AntdDatePickerStyled>
    </ConfigProvider>
  );
};

const AntdDatePickerStyled = styled.div<{
  $bg: string;
  $bw: string;
  $bc: string;
  $br: string;
  $pd: string;
  $wd: string
}>`
  width: ${({ $wd }) => $wd};
  .ant-picker {
    background: ${({ $bg }) => $bg};
    border-radius: ${({ $br }) => $br};
    border-width: ${({ $bw }) => $bw};
    border-color: ${({ $bc }) => $bc};
    padding: ${({ $pd }) => $pd};
    font-family: "Spoqa Han Sans Neo", "sans-serif";
  }
`;

export default AntdDatePicker;
