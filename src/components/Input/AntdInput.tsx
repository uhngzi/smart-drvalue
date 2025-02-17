import { componentsStylesType } from "@/data/type/componentStyles";
import { Input, InputRef } from "antd";
import { forwardRef } from "react";
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
  },
  ref
) => {
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    // 빈 문자열 허용
    if(value === "") {
      // 전달받은 onChange 핸들러 실행
      onChange?.(e);
      return;
    }

    // 숫자 타입일 때 0 이하 입력 제한
    if (type === "number") {
      const numericValue = parseFloat(value.replace(/\D/g, ""));
      if (numericValue < 0 || isNaN(numericValue)) {
        return; // 0 이하 값 무시
      }
    }

    // 전달받은 onChange 핸들러 실행
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
        value={value}
        onChange={handleInputChange}
        className={`${className}`}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
        onPressEnter={onPressEnter}
        onKeyDown={onKeyDown}
        readOnly={readonly}
        ref={ref}
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
