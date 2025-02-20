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
      // 숫자 이외의 값 제거 (공백, 특수문자, 문자)
      const sanitizedValue = value.replace(/[^0-9.-]/g, ""); // 숫자와 '.', '-'만 허용
      const numericValue = parseFloat(sanitizedValue);
  
      if (isNaN(numericValue) || numericValue < 0) {
        return; // 숫자가 아니거나 0 미만이면 무시
      }
  
      // 새로운 이벤트로 value 전달
      const newEvent = Object.assign({}, e, {
        target: {
          ...e.target,
          value: Number(sanitizedValue).toLocaleString(),
        },
      });
  
      return onChange?.(newEvent);  
    }

    // 전달받은 onChange 핸들러 실행
    onChange?.(e);
  };

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
        onChange={handleInputChange}
        className={`${className}`}
        placeholder={placeholder}
        // type={type}
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