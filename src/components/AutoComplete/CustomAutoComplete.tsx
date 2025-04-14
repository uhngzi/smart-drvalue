import { AutoComplete, Input } from "antd";
import { useEffect, useState } from "react";

interface Props {
  option?: { value: any; label: any }[];
  onChange?: (value: any) => void;
  className?: string;
  inputClassName?: string;
  addLabel?: string;
  handleAddData?: () => void;
  value?: any;
  defaultValue?: any;
  placeholder?: string;
  onInputChange?: (value: string) => void;
  clear?: boolean;
  readonly?: boolean;
}

const CustomAutoComplete: React.FC<Props> = ({
  option = [],
  onChange,
  className,
  inputClassName,
  handleAddData,
  value,
  addLabel,
  defaultValue,
  placeholder,
  onInputChange,
  clear = true,
  readonly,
}) => {
  const [inputValue, setInputValue] = useState<string>(""); // 입력창에 표시할 값
  const [filteredOptions, setFilteredOptions] = useState<{ value: any; label: any }[]>([]);

  useEffect(() => {
    // 기본값이 있으면 초기 inputValue 설정
    if (defaultValue) {
      const label = option?.find((f) => f.value === defaultValue)?.label;
      if (label) setInputValue(label);
    }
  }, [defaultValue, option]);

  useEffect(() => {
    // 검색어에 따라 label을 필터링하는 함수
    let foption = option
      ?.filter((item) => typeof item.label === "string" && item.label.includes(inputValue)) // label 기준으로 필터링
      .map((item) => ({
        value: item.value, // 검색 리스트에는 label이 보이도록 설정
        label: item.label,
      })) ?? [];

    // "추가하기" 버튼 옵션 추가 (handleAddData가 있을 때만)
    if (handleAddData) {
      foption.push({
        value: "add_new_item",
        label: <span style={{ color: "#4880FF", fontWeight: 500 }}>+ {addLabel ?? "추가하기"}</span>,
      });
    }

    setFilteredOptions(foption);
  }, [option, inputValue, handleAddData]);

  useEffect(() => {
    if (value) {
      const label = option?.find((f) => f.value === value)?.label;
      if (label) setInputValue(label);
    } else {
      setInputValue("");
    }
  }, [value, option]); // 값 추가 후 refetch 됐을 때도 확인하기 위해 option도 조건에 넣음

  // 선택했을 때 처리 (입력창에는 label이 표시되고, id(value)는 저장)
  const handleSelect = (selectedValue: any) => {
    if (selectedValue === "add_new_item") {
      handleAddData?.(); // "추가하기" 클릭 시 실행
    } else {
      const foundItem = option?.find((item) => item.value === selectedValue);
      if (foundItem) {
        setInputValue(foundItem.label); // 입력창에는 label 표시
        onChange?.(foundItem.value);
      }
    }
  };

  return (
    <AutoComplete
      // readonly일 경우 옵션은 표시하지 않음
      options={readonly ? [] : filteredOptions}
      value={inputValue}
      // readonly이면 검색 및 선택 이벤트를 비활성화
      onSelect={!readonly ? handleSelect : undefined}
      onSearch={!readonly ? setInputValue : undefined}
      placeholder={placeholder}
      className={className}
      onChange={(e) => {
        if(!readonly) {
          const value: string = e;
          onInputChange?.(value);
        }
      }}
    >
      <Input
        className={inputClassName ?? "w-full rounded-2 h-36"}
        onClick={()=>{
          if(clear && !readonly) {
            setInputValue("");
          }
        }}
        readOnly={readonly}
        // readonly일 때 포커스되면 바로 blur해서 커서가 보이지 않게 함
        onFocus={readonly ? (e) => e.target.blur() : undefined}
        style={readonly?{cursor:'no-drop', border: '1px solid #d9d9d9'}:{}}
      />
    </AutoComplete>
  );
};

export default CustomAutoComplete;
