import { componentsStylesType } from "@/data/type/componentStyles";
import { Input, InputRef } from "antd";
import { forwardRef, MouseEventHandler } from "react";
import styled from "styled-components";

interface Props {
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  styles?: componentsStylesType;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  readonly?: boolean;
  onPressEnter?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>;
  disabled?:boolean,
  onClick?: MouseEventHandler<HTMLInputElement>;
}

const AntdInput = forwardRef<InputRef, Props>((
  { 
    value,
    onChange,
    className,
    styles,
    placeholder,
    type,
    defaultValue,
    readonly,
    onPressEnter,
    onKeyDown,
    disabled,
    onClick,
  },
  ref
) => {
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let { value } = e.target;
    
    // 빈 문자열 허용
    if (value === "") {
      onChange?.(e);
      return;
    }

    // 숫자 타입일 경우
    if (type === "number") {
      // 입력값에서 콤마를 제거한 후 숫자, 소수점 부호만 남김
      const sanitizedValue = value
        .replace(/,/g, "")
        .replace(/[^0-9.]/g, "");
      
        console.log(sanitizedValue.split(".").length);
      
      // 마지막에 소수점이 올 때 숫자로 변환하지 않고 소수점 입력도 하기 위함 :: ex) 1. 일 경우 허용
      if(sanitizedValue[sanitizedValue.length-1] === "."
        // 소수점이 2개 이상일 경우 허용하지 않기 위함 ex) 1.5. 일 경우 허용 안함
        && sanitizedValue.split(".").length < 3) {
        const newEvent = Object.assign({}, e, {
          target: {
            ...e.target,
            value: sanitizedValue,
          },
        });
        return onChange?.(newEvent);
      }

      const numericValue = parseFloat(sanitizedValue);
  
      // 숫자가 아니거나 0 미만이면 무시
      if (isNaN(numericValue) || numericValue < 0) {
        return;
      }
  
      // onChange에 전달할 때는 포맷팅 없이 저장 (콤마 제거된 값)
      const newEvent = Object.assign({}, e, {
        target: {
          ...e.target,
          value: numericValue,
        },
      });
      return onChange?.(newEvent);
    }
    
    // 숫자 타입이 아닐 경우 원본 이벤트 전달
    onChange?.(e);
  };

  return (
    <AntdInputStyled
      $ht={styles?.ht ? styles.ht : "32px"}
      $bg={styles?.bg ? styles.bg : "white"}
      $bw={styles?.bw ? styles.bw : "1px"}
      $bc={styles?.bc ? styles.bc : "#D9D9D9"}
      className={`${className}`}
    >
      <Input
        // 숫자 타입이면 내부 값은 숫자 그대로 저장되지만 화면에는 콤마 포맷팅 적용
        value={
          type === "number" && value !== undefined && value !== ""
          // 마지막에 소수점이 올 경우 허용하기 위함 (위와 동일)
          && value?.toString()[value?.toString().length - 1] !== "."
            ? Number(value).toLocaleString()
            : value
        }
        onChange={handleInputChange}
        className={`${className}`}
        placeholder={placeholder}
        // type={type}
        defaultValue={defaultValue}
        onPressEnter={onPressEnter}
        onKeyDown={onKeyDown}
        readOnly={readonly}
        ref={ref}
        disabled={disabled}
        onClick={onClick}
      />
    </AntdInputStyled>
  );
});

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
    border-radius: 2px;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  }
`;

AntdInput.displayName = "AntdInput";

export default AntdInput;
