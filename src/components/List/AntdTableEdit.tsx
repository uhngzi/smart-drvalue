import dayjs from "dayjs";
import styled from "styled-components";
import { get, set } from "lodash";
import React, { Key, SetStateAction, useEffect, useState } from "react";
import {
  ConfigProvider,
  Table,
  Form,
  DatePicker,
  Switch,
  Modal,
  Tooltip,
} from "antd";
import { ColumnGroupType, ColumnsType, ColumnType } from "antd/es/table";
import koKR from "antd/locale/ko_KR";

import AntdSelect from "../Select/AntdSelect";
import AntdInput from "../Input/AntdInput";
import AntdAlertModal from "../Modal/AntdAlertModal";

// 셀 수정을 위한 Props (컴포넌트 내 onCell에서 적용됨)
interface EditableCellProps {
  cellAlign: "center" | "right" | "left"; // 셀의 위치
  editing: boolean; // 수정 모드
  dataIndex: string; // 객채 내 key 값
  title: string; // 컬럼명
  children?: React.ReactNode; // 내부 내용
  record: any; // 행의 값
  value: string; // 내부 내용 (string)
  req?: boolean; // 컬럼의 필수 여부   ** 현재 필수 체크 없음
  editType?: "select" | "input" | "date" | "toggle" | "none"; // 셀의 타입
  inputType?: "string" | "number"; // 셀의 타입이 INPUT일 경우 INPUT의 타입
  selectOptions: any[]; // 셀의 타입이 SELECT일 경우의 SELECT 옵션
  selectValue: any; // SELECT시 VALUE 값을 넣어줄 곳 (ex. process : id - value / prcNm - label)
}

// 셀 수정 Node
const EditableCell: React.FC<
  EditableCellProps & {
    onFieldChange: (value: any, label?: string) => void;
  } & { enterSubmit?: (id: any, value: any) => void }
> = ({
  cellAlign = "center",
  editing,
  dataIndex,
  title,
  children,
  record,
  value,
  editType,
  req,
  inputType,
  selectOptions,
  selectValue,
  onFieldChange,
  enterSubmit,
  ...restProps
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && enterSubmit) {
      enterSubmit(record.id, value);
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <td
      {...restProps}
      style={{
        textAlign: cellAlign,
        background: record?.disabled ? "#F2F2F2" : "#FFF",
      }}
    >
      {editing ? (
        <>
          {editType === "date" ? (
            <ConfigProvider locale={koKR}>
              <DatePicker
                className={`date-picker-${record?.id}-${dataIndex}`} // record.key를 이용해 고유 클래스명 부여
                value={value ? dayjs(value) : null}
                onChange={(date) => {
                  if (date) {
                    onFieldChange(dayjs(date).toDate() || new Date());
                    // 날짜 선택 후 해당 셀의 DatePicker 입력창에 포커스
                    setTimeout(() => {
                      const inputEl = document.querySelector<HTMLInputElement>(
                        `.date-picker-${record?.id}-${dataIndex} .ant-picker-input input`
                      );
                      if (inputEl) {
                        inputEl.focus();
                      }
                    }, 0);
                  } else {
                    onFieldChange(null);
                  }
                }}
                onOpenChange={(open) => {
                  if (open && !value) {
                    onFieldChange(new Date());
                  }
                }}
                style={{ borderRadius: "2px", height: 32, width: "95%" }}
                disabled={record?.disabled ?? undefined}
                onKeyDown={handleKeyDown}
                placeholder={enterSubmit ? "엔터 시 저장" : ""}
              />
            </ConfigProvider>
          ) : editType === "select" ? (
            <AntdSelect
              defaultValue={selectValue}
              options={selectOptions}
              onChange={(e) => {
                const value = e + "";
                const label = selectOptions.find(
                  (f) => f.value === value
                )?.label;
                onFieldChange(value, label);
              }}
              disabled={record?.disabled ?? undefined}
            />
          ) : editType === "toggle" ? (
            <Switch
              defaultValue={Number(value) === 1 ? true : false}
              onChange={(e) => {
                // 숫자로 변경    ** render에 if문 추가되므로 간략화 하기 위해 true, false가 아닌 숫자로 사용
                onFieldChange(e ? 1 : 0);
              }}
              disabled={record?.disabled ?? undefined}
            />
          ) : editType === "none" ? (
            children
          ) : (
            <AntdInput
              value={value}
              onChange={(e) => {
                let value = e.target.value;
                if (inputType === "number") {
                  if (Number(value) < 0) {
                    value = "0";
                  }
                }
                onFieldChange(value);
              }}
              onFocus={(e) => {
                if (dataIndex === "wkProcStCnt") {
                  if (record.rowIndex === 0 && (!value || value === "")) {
                    onFieldChange(record.prdCnt);
                  }
                  // 두 번째 이상의 행이면 이전 행의 완료량을 자동 입력
                  if (record.rowIndex > 0 && (!value || value === "")) {
                    if (record.prevWkProcEdCnt !== undefined) {
                      onFieldChange(record?.prevWkProcEdCnt);
                    }
                  }
                }
              }}
              type={inputType}
              readonly={record?.disabled ?? undefined}
              styles={{ bg: "none" }}
              onKeyDown={handleKeyDown}
              className="!w-[95%]"
            />
          )}
        </>
      ) : (
        children
      )}
    </td>
  );
};

// 컬럼 커스텀
export type CustomColumn = ColumnType<any> & { tooltip?: string } & {
  // 헤더 툴팁
  cellAlign?: "center" | "left" | "right";
} & { editable?: boolean } & { allEdit?: boolean } & {
  // 셀의 위치 // 수정 가능 여부 // 모든 셀 수정 가능 여부
  editType?: "input" | "select" | "date" | "toggle" | "none";
} & { enter?: boolean } & { enterSubmit?: (id: string, value: any) => void } & {
  // 수정 시 셀의 타입 (toggle은 true, false 값만 필요할 경우 사용) // 수정 시 엔터 저장 여부 // 수정 시 엔터 호출
  req?: boolean;
} & { inputType?: "string" | "number" } & {
  // 수정 시 필수 여부 // 셀의 타입이 INPUT일 경우의 INPUT의 TYPE
  selectOptions?: any[] | ((record: any) => any[]);
} & { selectValue?: any } & { leftPin?: boolean } & { rightPin?: boolean }; // 셀의 타입이 SELECT일 경우의 SELECT 옵션 // SELECT시 VALUE 값을 넣어줄 곳 (ex. process : id - value / prcNm - label) // 셀 고정 여부 (왼쪽) // 셀 고정 여부 (오른쪽)

// 테이블 테마 스타일
const AntdTableTheme = {
  components: {
    Table: {
      headerSplitColor: "transparent",
    },
  },
};

// 행(record) 타입
interface DataType {
  key: React.Key;
  [key: string]: any; // 추가 필드 허용
}

// 현재 컴포넌트의 Props
interface Props {
  columns: CustomColumn[] | (() => CustomColumn[]);
  data?: any[];
  setData?: React.Dispatch<SetStateAction<any[]>>;
  styles?: {
    pd?: string;
    round?: string;
    line?: "y" | "n";
    th_ht?: string;
    th_bg?: string;
    th_pd?: string;
    th_fw?: string;
    td_ht?: string;
    td_bg?: string;
    td_pd?: string;
    td_al?: string;
    fs?: string;
  };
  className?: string;
  tableProps?: {
    rowSelection?: "radio" | "checkbox";
    split?: "none";
  };
  create?: boolean;
  setEditIndex?: React.Dispatch<SetStateAction<number>>;
  selectedRowKey?: string | number | null;
  setSelectedRowKey?: React.Dispatch<SetStateAction<string | number | null>>;
  loading?: boolean;
}

// 컴포넌트
const AntdTableEdit: React.FC<Props> = ({
  columns,
  data,
  setData,
  styles,
  className,
  tableProps,
  create, //create가 true일 때는 생성 모드 (무조건 입력창 있어야 함)
  setEditIndex, // 수정 모드일 경우 수정된 CELL INDEX
  selectedRowKey,
  setSelectedRowKey,
  loading,
}) => {
  const [form] = Form.useForm();

  // 데이터
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 저장 전 데이터 (esc 누를 경우 원래 값으로 돌아오기 위함)
  const [realDataSource, setRealDataSource] = useState<any[]>([]);
  const [editingKey, setEditingKey] = useState<React.Key>("");

  // 데이터가 load 됐을 때 각각 값 넣어줌
  useEffect(() => {
    const updatedDataSource = (data ?? []).map((item: any, index: number) => ({
      ...item,
      key: item.key ?? index?.toString(),
      rowIndex: index, // 행 번호 추가
    }));

    setDataSource(updatedDataSource);
    setRealDataSource(updatedDataSource);

    // id가 "new"를 포함하는 레코드의 key를 edit 모드로 설정
    if (!create) {
      const newRecord = updatedDataSource.find(
        (item: any) => typeof item.id === "string" && item.id.includes("new")
      );

      if (newRecord) {
        setEditingKey(newRecord.key);
        form.setFieldsValue({ ...newRecord });
      }
    }
  }, [data]);

  // 값 수정될 경우 (더블 클릭 시) - editingKey에 행의 key 값을 넣어줌
  const isEditing = (record: DataType) => create || record.key === editingKey;

  // 값 수정 시 실행되는 함수
  const handleFieldChange = (
    key: React.Key,
    dataIndex: string,
    value: any,
    editType?: "select" | "input" | "date" | "toggle" | "none",
    selectKey?: string, //SELECT의 value 값을 변경하기 위해 가져옴
    label?: string //SELECT의 라벨 값을 직접 변경해줌
  ) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      if (editType === "select" && selectKey) {
        newData[index] = { ...newData[index] };
        //SELECT Value 값 변경 (value는 selectKey에 저장)
        set(newData[index], selectKey, value);
        //SELECT Label 값 변경 (label은 dataIndex에 저장)
        set(newData[index], dataIndex, label);
      } else {
        newData[index] = { ...newData[index] };
        set(newData[index], dataIndex, value);
      }

      // 인수량 변경 시 불량 자동 계산 (인수량 - 완료량)
      if (dataIndex === "wkProcStCnt") {
        const edCnt = Number(newData[index]["wkProcEdCnt"]) || 0;
        // 완료량이 유효한 숫자이고 0 이상일 경우에만 불량 계산
        if (!isNaN(edCnt) && edCnt > 0) {
          const stCnt = Number(value) || 0;
          set(newData[index], "wkProcBadCnt", stCnt - edCnt);
        }
        // 인수일 자동 입력
        if (!newData[index]["wkProcStDtm"]) {
          set(newData[index], "wkProcStDtm", new Date());
        }
      }

      // 완료량 변경 시 불량 자동 계산 및 완료일 자동 입력
      if (dataIndex === "wkProcEdCnt") {
        const stCnt = Number(newData[index]["wkProcStCnt"]) || 0;
        const edCnt = Number(value) || 0;
        set(newData[index], "wkProcBadCnt", stCnt - edCnt);
        if (!newData[index]["wkProcEdDtm"]) {
          set(newData[index], "wkProcEdDtm", new Date());
        }
      }

      setDataSource(newData);
      // 생성 모드일 때는 값 자동 저장
      if (create && setData) {
        setData(newData);
      }
    }
  };

  // 수정 모드로 전환
  const edit = (record: DataType) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const handleSave = async () => {
    if (!create && editingKey !== "") {
      await save(editingKey);
    }
  };

  // 값 저장, 이때 real에도 값이 저장됨
  const save = async (key: React.Key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        newData[index] = { ...newData[index], ...row };
        setDataSource(newData);
        setRealDataSource(newData);
        setEditingKey("");
        setData?.(newData);
        setEditIndex?.(index);
      }
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  // 값 이전으로 복구
  const cancel = () => {
    if (!create) {
      setEditingKey("");
      setDataSource(realDataSource);
    }
  };

  // Column이 그룹인지 확인하는 타입 가드 함수
  const isColumnGroup = (
    col: ColumnGroupType<any> | ColumnType<any>
  ): col is ColumnGroupType<any> => {
    return "children" in col;
  };

  const resolvedColumns = typeof columns === "function" ? columns() : columns;

  // ColumnType만 onCell을 추가할 수 있도록
  const mergedColumns: ColumnsType<any> = (resolvedColumns ?? []).map(
    (col, index) => {
      if (isColumnGroup(col)) {
        return col; // 그룹 컬럼이면 그대로 반환
      }

      const column = col as CustomColumn; // 일반 컬럼으로 변환
      let mergedCol: CustomColumn;

      // 생성 모드 시
      if (create) {
        if (column.editable === false) {
          mergedCol = {
            ...column,
            title: column.tooltip ? (
              <Tooltip
                title={column.tooltip}
                placement="top"
                className="cursor-pointer"
              >
                <span className="cursor-pointer">
                  {typeof column.title === "string" ? column.title : ""}
                </span>
              </Tooltip>
            ) : (
              column.title
            ),
            onCell: (record: DataType) => ({
              className: column.leftPin
                ? `ant-table-cell-fix-left ant-table-cell-custom-left-${index}`
                : column.rightPin
                ? `ant-table-cell-fix-right ant-table-cell-custom-right-${index}`
                : "",
            }),
            render: column.render
              ? column.render
              : (value: any, record: any) => {
                  if (value) {
                    if (!Number.isNaN(value))
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {value}
                        </div>
                      );
                    if (dayjs(value).isValid())
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {dayjs(value).format("YYYY-MM-DD")}
                        </div>
                      );
                    return (
                      <div
                        className="w-full h-full h-center"
                        style={{ justifyContent: column.cellAlign ?? "center" }}
                      >
                        {value}
                      </div>
                    );
                  } else {
                    const v = get(record, column.dataIndex);
                    if (!Number.isNaN(v))
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {v}
                        </div>
                      );
                    if (dayjs(v).isValid())
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {dayjs(v).format("YYYY-MM-DD")}
                        </div>
                      );
                    return (
                      <div
                        className="w-full h-full h-center"
                        style={{ justifyContent: column.cellAlign ?? "center" }}
                      >
                        {v}
                      </div>
                    );
                  }
                },
          };
        } else {
          mergedCol = {
            onCell: (record: DataType) => ({
              className: column.leftPin
                ? `ant-table-cell-fix-left ant-table-cell-custom-left-${index}`
                : column.rightPin
                ? `ant-table-cell-fix-right ant-table-cell-custom-right-${index}`
                : "",
              cellAlign: column.cellAlign,
              title:
                typeof column.title === "string" ? column.title : undefined,
              dataIndex: column.dataIndex,
              editing: column.allEdit || isEditing(record) ? "true" : undefined,
              value: get(record, column.dataIndex),
              editType: column.editType,
              record: record,
              req: column.req,
              inputType: column.inputType,
              selectOptions:
                typeof column.selectOptions === "function"
                  ? column.selectOptions(record)
                  : column.selectOptions,
              selectValue: get(record, column.selectValue),
              tooltip: column.tooltip,
              onFieldChange: (value: any, label?: string) =>
                handleFieldChange(
                  record.key,
                  column.dataIndex as string,
                  value,
                  column.editType,
                  column.selectValue,
                  label
                ),
              enterSubmit: column.enterSubmit,
            }),
            ...column,
            title: column.tooltip ? (
              <Tooltip
                title={column.tooltip}
                placement="top"
                className="cursor-pointer"
              >
                <span className="cursor-pointer">
                  {typeof column.title === "string" ? column.title : ""}
                </span>
              </Tooltip>
            ) : (
              column.title
            ),
            render: column.render
              ? column.render
              : (value: any, record: any) => {
                  if (value) {
                    if (!Number.isNaN(value))
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {value}
                        </div>
                      );
                    if (dayjs(value).isValid())
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {dayjs(value).format("YYYY-MM-DD")}
                        </div>
                      );
                    return (
                      <div
                        className="w-full h-full h-center"
                        style={{ justifyContent: column.cellAlign ?? "center" }}
                      >
                        {value}
                      </div>
                    );
                  } else {
                    const v = get(record, column.dataIndex);
                    if (!Number.isNaN(v))
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {v}
                        </div>
                      );
                    if (dayjs(v).isValid())
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {dayjs(v).format("YYYY-MM-DD")}
                        </div>
                      );
                    return (
                      <div
                        className="w-full h-full h-center"
                        style={{ justifyContent: column.cellAlign ?? "center" }}
                      >
                        {v}
                      </div>
                    );
                  }
                },
          };
        }
      } else {
        // 수정 모드 아닐 때
        if (!column.editable) {
          mergedCol = {
            onCell: (record: DataType) => ({
              className: column.leftPin
                ? `ant-table-cell-fix-left ant-table-cell-custom-left-${index}`
                : column.rightPin
                ? `ant-table-cell-fix-right ant-table-cell-custom-right-${index}`
                : "",
              cellAlign: column.cellAlign,
              title:
                typeof column.title === "string" ? column.title : undefined,
              dataIndex: column.dataIndex,
              value: get(record, column.dataIndex),
              record: record,
              req: column.req,
              tooltip: column.tooltip,
            }),
            ...column,
            title: column.tooltip ? (
              <Tooltip
                title={column.tooltip}
                placement="top"
                className="cursor-pointer"
              >
                <span className="cursor-pointer">
                  {typeof column.title === "string" ? column.title : ""}
                </span>
              </Tooltip>
            ) : (
              column.title
            ),
            render: column.render
              ? column.render
              : (value: any, record: any) => {
                  if (value) {
                    if (!Number.isNaN(value))
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {value}
                        </div>
                      );
                    if (dayjs(value).isValid())
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {dayjs(value).format("YYYY-MM-DD")}
                        </div>
                      );
                    return (
                      <div
                        className="w-full h-full h-center"
                        style={{ justifyContent: column.cellAlign ?? "center" }}
                      >
                        {value}
                      </div>
                    );
                  } else {
                    const v = get(record, column.dataIndex);
                    if (!Number.isNaN(v))
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {v}
                        </div>
                      );
                    if (dayjs(v).isValid())
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {dayjs(v).format("YYYY-MM-DD")}
                        </div>
                      );
                    return (
                      <div
                        className="w-full h-full h-center"
                        style={{ justifyContent: column.cellAlign ?? "center" }}
                      >
                        {v}
                      </div>
                    );
                  }
                },
          };
        } else {
          // 수정모드일 때
          mergedCol = {
            ...column,
            onCell: (record: DataType) => ({
              className: column.leftPin
                ? `ant-table-cell-fix-left ant-table-cell-custom-left-${index}`
                : column.rightPin
                ? `ant-table-cell-fix-right ant-table-cell-custom-right-${index}`
                : "",
              cellAlign: column.cellAlign,
              title:
                typeof column.title === "string" ? column.title : undefined,
              dataIndex: column.dataIndex,
              editing: column.allEdit || isEditing(record) ? "true" : undefined,
              value: get(record, column.dataIndex),
              editType: column.editType,
              record: record,
              req: column.req,
              inputType: column.inputType,
              selectOptions:
                typeof column.selectOptions === "function"
                  ? column.selectOptions(record)
                  : column.selectOptions,
              selectValue: get(record, column.selectValue),
              tooltip: column.tooltip,
              onFieldChange: (value: any, label?: string) =>
                handleFieldChange(
                  record.key,
                  column.dataIndex as string,
                  value,
                  column.editType,
                  column.selectValue,
                  label
                ),
              enterSubmit: column.enterSubmit,
            }),
            render: column.render
              ? column.render
              : (value: any, record: any) => {
                  if (value) {
                    if (!Number.isNaN(value))
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {value}
                        </div>
                      );
                    if (dayjs(value).isValid())
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {dayjs(value).format("YYYY-MM-DD")}
                        </div>
                      );
                    return (
                      <div
                        className="w-full h-full h-center"
                        style={{ justifyContent: column.cellAlign ?? "center" }}
                      >
                        {value}
                      </div>
                    );
                  } else {
                    const v = get(record, column.dataIndex);
                    if (!Number.isNaN(v))
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {v}
                        </div>
                      );
                    if (dayjs(v).isValid())
                      return (
                        <div
                          className="w-full h-full h-center"
                          style={{
                            justifyContent: column.cellAlign ?? "center",
                          }}
                        >
                          {dayjs(v).format("YYYY-MM-DD")}
                        </div>
                      );
                    return (
                      <div
                        className="w-full h-full h-center"
                        style={{ justifyContent: column.cellAlign ?? "center" }}
                      >
                        {v}
                      </div>
                    );
                  }
                },
          };
        }
      }

      // leftPin/rightPin 처리
      if (column.leftPin) {
        mergedCol.fixed = "left";
      }
      if (column.rightPin) {
        mergedCol.fixed = "right";
      }

      return mergedCol;
    }
  );

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [resultCode, setResultCode] = useState<"esc" | "">("");

  const handleRowClick = (record: DataType) => {
    setSelectedRowKey?.(record.id); // 클릭된 행의 key를 저장
  };

  const updateFixedOffsets = () => {
    const headerCells = document.querySelectorAll(
      ".ant-table-thead .ant-table-cell-fix-left"
    );
    const leftOffsets: number[] = [];
    let cumulative = 0;

    headerCells.forEach((cell, i) => {
      const width = (cell as HTMLElement).offsetWidth;
      leftOffsets.push(cumulative);
      cumulative += width;
    });

    // 바디의 모든 left 고정 셀들
    const bodyRows = document.querySelectorAll(".ant-table-tbody tr");
    bodyRows.forEach((row) => {
      const cells = row.querySelectorAll(".ant-table-cell-fix-left");
      cells.forEach((cell, i) => {
        (cell as HTMLElement).style.left = `${leftOffsets[i]}px`;
      });
    });

    // right 도 동일하게
    const rightHeaderCells = document.querySelectorAll(
      ".ant-table-thead .ant-table-cell-fix-right"
    );
    const rightOffsets: number[] = [];
    let rightCumulative = 0;

    [...rightHeaderCells].reverse().forEach((cell, i) => {
      const width = (cell as HTMLElement).offsetWidth;
      rightOffsets.unshift(rightCumulative);
      rightCumulative += width;
    });

    bodyRows.forEach((row) => {
      const cells = row.querySelectorAll(".ant-table-cell-fix-right");
      cells.forEach((cell, i) => {
        (cell as HTMLElement).style.right = `${rightOffsets[i]}px`;
      });
    });
  };

  useEffect(() => {
    updateFixedOffsets();

    window.addEventListener("resize", updateFixedOffsets);
    return () => window.removeEventListener("resize", updateFixedOffsets);
  }, [dataSource]);

  return (
    <AntdTableStyled
      className={className}
      $padding={styles?.pd || "0 10px"}
      $thPadding={styles?.th_pd || "0 10px"}
      $tdPadding={styles?.td_pd || "0 10px"}
      $thHeight={styles?.th_ht ?? "55px"}
      $tdHeight={styles?.td_ht ?? "55px"}
      $thBackground={styles?.th_bg || "white"}
      $tdBackground={styles?.td_bg || "none"}
      $tdTextAlign={styles?.td_al || "left"}
      $thFontWeight={styles?.th_fw || "500"}
      $round={styles?.round || "14px"}
      $line={styles?.line === "n" ? "0" : "1px solid #0000000F"}
      $fs={styles?.fs || "14px"}
    >
      <ConfigProvider
        theme={{
          ...AntdTableTheme,
          components: {
            Table: {
              headerSplitColor: tableProps?.split ?? "#0000000F",
            },
          },
        }}
      >
        <Form form={form} component={false}>
          <Table
            components={{ body: { cell: EditableCell } }}
            columns={mergedColumns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: "max-content" }}
            loading={loading}
            onRow={(record) => ({
              onDoubleClick: () => {
                // 더블 클릭 시 편집 모드 진입 (edit true일 때)
                if (!create && editingKey === "") {
                  edit(record);
                }
              },
              onKeyDown: (e) => {
                if (!create) {
                  //ESC 누르면 원래대로 돌아오고 Enter를 누르면 저장됨
                  if (e.key === "Escape") {
                    setResultCode("esc");
                    setAlertOpen(true);
                  } else if (e.key === "Enter") handleSave();
                }
              },
              onClick: () => handleRowClick(record), // 행 클릭 이벤트
            })}
            rowClassName={(record) =>
              record.id === selectedRowKey ? "selected-row" : ""
            } // 선택된 행에 클래스 추가
          />
        </Form>
      </ConfigProvider>

      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={resultCode === "esc" ? "취소하시겠습니까?" : "고객 발주 실패"}
        contents={
          <div>
            {resultCode === "esc"
              ? "취소 시 입력하신 정보가 전부 사라집니다. 그래도 취소하시겠습니까?"
              : ""}
          </div>
        }
        type={resultCode === "esc" ? "warning" : "info"}
        onCancel={
          resultCode === "esc"
            ? () => {
                setAlertOpen(false);
              }
            : () => {}
        }
        onOk={
          resultCode === "esc"
            ? () => {
                cancel();
                setAlertOpen(false);
              }
            : () => {}
        }
        okText={resultCode === "esc" ? "네" : "확인"}
        cancelText={resultCode === "esc" ? "아니오" : "취소"}
      />
    </AntdTableStyled>
  );
};

const AntdTableStyled = styled.div<{
  $padding: string;
  $thBackground: string;
  $thHeight: string;
  $thPadding: string;
  $thFontWeight: string;
  $tdBackground: string;
  $tdHeight: string;
  $tdTextAlign: string;
  $tdPadding: string;
  $round: string;
  $line: string;
  $fs: string;
}>`
  width: 100%;
  font-family: "Spoqa Han Sans Neo", "sans-serif";

  .ant-table {
    background: none;
    scrollbar-width: thin;
    scrollbar-color: #eaeaea transparent;
    scrollbar-gutter: stable;
  }

  /* 고정 컬럼 (헤더, 바디 모두) */
  .ant-table-cell-fix-left,
  .ant-table-cell-fix-right {
    position: sticky !important;
    background: inherit;
    z-index: 2;
  }
  /* 헤더 고정 컬럼은 좀 더 높은 z-index 적용 */
  .ant-table-thead .ant-table-cell-fix-left,
  .ant-table-thead .ant-table-cell-fix-right {
    z-index: 3;
    background-color: ${({ $thBackground }) => $thBackground} !important;
  }

  /* 바디 고정 컬럼: $tdBackground 적용 */
  .ant-table-tbody .ant-table-cell-fix-left,
  .ant-table-tbody .ant-table-cell-fix-right {
    background-color: ${({ $tdBackground }) => $tdBackground} !important;
  }

  .ant-table-thead {
    background-color: ${({ $thBackground }) => $thBackground};

    .req {
      color: #1814f3 !important;
    }

    & .ant-table-cell {
      height: ${({ $thHeight }) => $thHeight};
      padding: ${({ $thPadding }) => $thPadding};
      text-align: center;
      font-weight: ${({ $thFontWeight }) => $thFontWeight};
      font-size: ${({ $fs }) => $fs};
      color: #444444;
      background-color: transparent;
      border: 0;
      ::before {
        background-color: transparent;
      }
    }

    & > th:last-child {
      border-right: ${({ $line }) => $line};
    }

    & > tr:first-child > th {
      border-top: ${({ $line }) => $line};
    }

    & > tr:first-child > th:last-child {
      border-radius: 0 ${({ $round }) => $round} 0 0 !important;
      border-right: ${({ $line }) => $line};
    }

    & > tr:first-child > th:first-child {
      border-radius: ${({ $round }) => $round} 0 0 0 !important;
      border-left: ${({ $line }) => $line};
    }
  }

  .ant-table-tbody {
    background-color: ${({ $tdBackground }) => $tdBackground};

    & .ant-table-cell {
      height: ${({ $tdHeight }) => $tdHeight};
      padding: ${({ $tdPadding }) => $tdPadding};
      border: 0;
      border-top: 1px solid #0000000f;
      text-align: ${({ $tdTextAlign }) => $tdTextAlign};
      font-weight: 400;
      font-size: ${({ $fs }) => $fs};
      color: #444444;
    }

    & tr:last-child td {
      border-bottom: 1px solid #0000000f;
    }

    & tr td:first-child {
      padding-left: 10px;
      border-left: ${({ $line }) => $line};
    }

    & tr td:last-child {
      padding-right: 10px;
      border-right: ${({ $line }) => $line};
    }

    & tr:last-child td:last-child {
      border-radius: 0 0 ${({ $round }) => $round} 0;
      border-bottom: 1px solid #0000000f;
      border-right: ${({ $line }) => $line};
    }

    & tr:last-child td:first-child {
      border-radius: 0 0 0 ${({ $round }) => $round};
      border-bottom: 1px solid #0000000f;
      border-left: ${({ $line }) => $line};
    }
  }

  & .selected-row {
    background: #f5f6fa;
  }
`;

export default AntdTableEdit;
