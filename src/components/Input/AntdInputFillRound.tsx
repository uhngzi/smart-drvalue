import { componentsStylesType } from "@/data/type/componentStyles";
import { Input } from "antd"
import styled from "styled-components";

interface Props {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  className?: string;
  styles?: componentsStylesType;
  placeholder?: string;
  type?: "string" | "number";
}

const AntdInputFillRound: React.FC<Props> = ({
  value,
  onChange,
  name,
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
      $ht={styles?.ht?styles.ht:'30px'}
      $bg={styles?.bg?styles.bg:'#F9F9FB'}
      $bw={styles?.bw?styles.bw:'1px'}
      $bc={styles?.bc?styles.bc:'#D5D5D5'}
      className={`${className}`}
    >
      <Input
        value={value}
        onChange={handleInputChange}
        name={name}
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

export default AntdInputFillRound;