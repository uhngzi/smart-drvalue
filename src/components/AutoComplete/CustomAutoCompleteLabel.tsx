import { AutoComplete, Input, InputRef } from "antd";
import { forwardRef, useEffect, useState } from "react";

interface Props {
  option?: { value: any; label: any }[];
  onChange?: (value: any) => void;
  className?: string;
  inputClassName?: string;
  addLabel?: string;
  handleAddData?: () => void;
  value?: any;
  label?: string | number;
  defaultValue?: any;
  placeholder?: string;
  onInputChange?: (value: string | number) => void;
  clear?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  tabIndex?: number;
}

const CustomAutoCompleteLabel = forwardRef<InputRef, Props>((
  { 
      option = [],
      onChange,
      className,
      inputClassName,
      handleAddData,
      value,
      label,
      addLabel,
      defaultValue,
      placeholder,
      onInputChange,
      clear = true,
      readonly,
      disabled,
      tabIndex,
  },
  ref
) => {
  const [inputValue, setInputValue] = useState<string | number>(""); // 입력창에 표시할 값
  const [filteredOptions, setFilteredOptions] = useState<{ value: any; label: any }[]>([]);

  useEffect(() => {
    if (label !== undefined) {
      setInputValue(label);
    } else {
      setInputValue("");
    }
  }, [label]);

  useEffect(() => {
    // 검색어에 따라 label을 필터링하는 함수
    const foption = option
        ?.filter((item) => typeof item.label === "string" && item.label.includes(inputValue.toString()))
        .map((item) => ({
          value: item.label, // 옵션 리스트에는 label이 표시되도록 설정
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

  // 선택했을 때 처리 (입력창에는 label이 표시되고, id(value)는 저장)
  const handleSelect = (label: string | number) => {
    if (label === "add_new_item") {
      handleAddData?.(); // "추가하기" 클릭 시 실행
    } else {
      const foundItem = option?.find((item) => item.label === label);
      if (foundItem) {
        setInputValue(foundItem.label); // 입력창에는 label 표시
        onChange?.(foundItem.value);
      }
    }
  };

  return (
    <AutoComplete
      options={readonly? [] :filteredOptions}
      value={inputValue} // 입력창에는 label 값만 보이도록 설정
      onSelect={!readonly ? handleSelect : undefined} // 선택하면 ID 저장, label 표시
      onSearch={!readonly ? setInputValue : undefined} // 검색할 때 label 기준으로 필터링
      placeholder={placeholder}
      className={className}
      onChange={(e)=>{
        if(!readonly) {
          const value:string | number = e;
          onInputChange?.(value);
        }
      }}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      <Input
        className={inputClassName ?? "w-full rounded-2 h-36"}
        ref={ref}
        onClick={()=>{
          if(clear && !readonly) {
            setInputValue("");
          }
        }}
        readOnly={readonly} disabled={disabled}
        // readonly일 때 포커스되면 바로 blur해서 커서가 보이지 않게 함
        onFocus={readonly ? (e) => e.target.blur() : undefined}
        style={readonly?{cursor:'no-drop', border: '1px solid #d9d9d9'}:{}}
      />
    </AutoComplete>
  );
});

CustomAutoCompleteLabel.displayName = "CustomAutoComplete";

export default CustomAutoCompleteLabel;