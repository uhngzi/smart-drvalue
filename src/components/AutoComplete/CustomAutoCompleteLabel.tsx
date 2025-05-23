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
  label?: string;
  defaultValue?: any;
  placeholder?: string;
  onInputChange?: (value: string) => void;
  clear?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  dropdownStyle?: React.CSSProperties;
}

const CustomAutoCompleteLabel = forwardRef<InputRef, Props>(
  (
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
      dropdownStyle,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>(""); // 입력창에 표시할 값
    const [filteredOptions, setFilteredOptions] = useState<
      { value: any; label: any }[]
    >([]);

    // 초기 label 표시
    useEffect(() => {
      setInputValue(label ?? "");
    }, [label]);

    // useEffect(() => {
    //   if (label !== undefined) {
    //     setInputValue(label);
    //   } else {
    //     setInputValue("");
    //   }
    // }, [label]);

    useEffect(() => {
      // 검색어에 따라 label을 필터링하는 함수
      const foption =
        option
          ?.filter(
            (item) =>
              typeof item.label === "string" &&
              item.label.includes(inputValue.toString())
          )
          .map((item, idx) => ({
            value: `${item.value}__${idx}`,
            label: item.label,
            _realValue: item.value,
          })) ?? [];

      // "추가하기" 버튼 옵션 추가 (handleAddData가 있을 때만)
      if (handleAddData) {
        foption.push({
          value: "add_new_item",
          label: (
            <span style={{ color: "#4880FF", fontWeight: 500 }}>
              + {addLabel ?? "추가하기"}
            </span>
          ),
          _realValue: "add_new_item",
        });
      }

      setFilteredOptions(foption);
    }, [option, inputValue, handleAddData]);

    // 선택했을 때 처리 (입력창에는 label이 표시되고, id(value)는 저장)
    const handleSelect = (selected: string) => {
      if (selected === "add_new_item") {
        handleAddData?.(); // "추가하기" 클릭 시 실행
      } else {
        const rawValue = selected.split("__")[0];
        const foundItem = option.find(
          (item) => String(item.value) === rawValue
        );
        if (foundItem) {
          setInputValue(foundItem.label);
          onChange?.(foundItem.value);
        }
        // const foundItem = option?.find((item) => item.label === label);
        // if (foundItem) {
        //   setInputValue(foundItem.label); // 입력창에는 label 표시
        //   onChange?.(foundItem.value);
        // }
      }
    };

    return (
      <AutoComplete
        options={readonly ? [] : filteredOptions}
        value={inputValue} // 입력창에는 label 값만 보이도록 설정
        onSelect={!readonly ? handleSelect : undefined} // 선택하면 ID 저장, label 표시
        onSearch={!readonly ? setInputValue : undefined} // 검색할 때 label 기준으로 필터링
        placeholder={placeholder}
        className={className}
        onChange={(e) => {
          if (!readonly) {
            const value: string | number = e;
            onInputChange?.(value);
          }
        }}
        tabIndex={tabIndex}
        disabled={disabled}
        dropdownStyle={dropdownStyle}
      >
        <Input
          className={inputClassName ?? "w-full rounded-2 h-36"}
          ref={ref}
          onClick={() => {
            if (clear && !readonly) {
              setInputValue("");
            }
          }}
          readOnly={readonly}
          disabled={disabled}
          // readonly일 때 포커스되면 바로 blur해서 커서가 보이지 않게 함
          onFocus={readonly ? (e) => e.target.blur() : undefined}
          style={
            readonly ? { cursor: "no-drop", border: "1px solid #d9d9d9" } : {}
          }
        />
      </AutoComplete>
    );
  }
);

CustomAutoCompleteLabel.displayName = "CustomAutoComplete";

export default CustomAutoCompleteLabel;
