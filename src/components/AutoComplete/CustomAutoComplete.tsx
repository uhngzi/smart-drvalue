import { AutoComplete, Input } from "antd";
import { SetStateAction, use, useEffect, useState } from "react";

interface Props {
  option?: {value: any, label: any}[];
  onChange?: (value: any) => void;
  inputClassName?: string;
  handleAddData?: () => void;
  value?: any;
}

const CustomAutoComplete:React.FC<Props> = ({
  option,
  onChange,
  inputClassName,
  handleAddData,
  value,
}) => {
  const [inputValue, setInputValue] = useState<string>(""); // 입력창에 표시할 값

  const [filteredOptions, setFilteredOptions] = useState<{ value: any; label: any; }[]>([]);
  useEffect(()=>{
    // 검색어에 따라 label을 필터링하는 함수
    const foption = option
      ?.filter((item) => typeof item.label === "string" && item.label.includes(inputValue)) // label 기준으로 필터링
      .map((item) => ({
        value: item.label, // 검색 리스트에는 label이 보이도록 설정
        label: item.label,
      }));
    if(foption)
      setFilteredOptions(foption);
  }, [option, inputValue]);

  useEffect(()=>{
    if(value) {
      const label = option?.find(f => f.value === value )?.label;
      if(label) setInputValue(label);
    }
  }, [value, option]) // 값 추가 후 refetch 됐을 때도 확인하기 위해 option도 조건에 넣음

  // 선택했을 때 처리 (입력창에는 label이 표시되고, id(value)는 저장)
  const handleSelect = (label: string) => {
    const foundItem = option?.find((item) => item.label === label);
    if (foundItem) {
      setInputValue(foundItem.label); // 입력창에는 label 표시
      onChange?.(foundItem.value);
    }
  };

  return (
    <AutoComplete
      options={filteredOptions}
      value={inputValue} // 입력창에는 label 값만 보이도록 설정
      onSelect={handleSelect} // 선택하면 ID 저장, label 표시
      onSearch={setInputValue} // 검색할 때 label 기준으로 필터링
    >
      <Input
        className={inputClassName ?? "w-full rounded-2 h-36"}
        suffix={
          handleAddData &&
          <div
            style={{
              cursor: "pointer",
              color: "#4880FF",
              fontSize: "18px",
              padding: "0 5px",
              fontWeight: 500,
            }}
            onClick={handleAddData}
          >
            +
          </div>
        }
      />
    </AutoComplete>
  );
};

export default CustomAutoComplete;
