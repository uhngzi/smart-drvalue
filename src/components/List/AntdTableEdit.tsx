import dayjs from "dayjs";
import styled from "styled-components";
import { get, set } from "lodash";
import React, { useEffect, useState } from "react";
import { ConfigProvider, Table, Form, DatePicker, Switch } from "antd";
import { ColumnGroupType, ColumnsType, ColumnType } from "antd/es/table";

import AntdSelect from "../Select/AntdSelect";
import AntdInput from "../Input/AntdInput";

// 셀 수정을 위한 Props (컴포넌트 내 onCell에서 적용됨)
interface EditableCellProps {
  editing: boolean;                                   // 수정 모드
  dataIndex: string;                                  // 객채 내 key 값
  title: string;                                      // 컬럼명
  children: React.ReactNode;                          // 내부 내용
  record: any;                                        // 행의 값
  value: string;                                      // 내부 내용 (string)
  req?: boolean;                                      // 컬럼의 필수 여부   ** 현재 필수 체크 없음
  editType?: 'select' | 'input' | 'date' | 'toggle';  // 셀의 타입
  selectOptions: any[];                               // 셀의 타입이 SELECT일 경우의 SELECT 옵션
  selectValue: any;                                   // SELECT시 VALUE 값을 넣어줄 곳 (ex. process : id - value / prcNm - label)
}

// 셀 수정 Node
const EditableCell: React.FC<
  EditableCellProps
  & { onFieldChange: (value: any, label?: string) => void }
> = ({
  editing,
  dataIndex,
  title,
  children,
  record,
  value,
  editType,
  req,
  selectOptions,
  selectValue,
  onFieldChange,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <>{
          editType === "date" ?
            <DatePicker
              defaultValue={value ? dayjs(value) : null}
              onChange={(date)=>{
                if(date) {
                  onFieldChange(dayjs(date).toDate());
                }
              }}
              style={{borderRadius:'2px', height:32}}
            />
          :
          editType === "select" ?
            <AntdSelect
              defaultValue={selectValue}
              options={selectOptions}
              onChange={(e)=>{
                const value = e+'';
                const label = selectOptions.find(f=>f.value===value)?.label;
                onFieldChange(value, label);
              }}
            />
          :
          editType === "toggle" ?
            <Switch
              defaultValue={Number(value) === 1 ? true : false}
              onChange={(e) => {
                // 숫자로 변경    ** render에 if문 추가되므로 간략화 하기 위해 true, false가 아닌 숫자로 사용
                onFieldChange(e ? 1 : 0);
              }}
            />
          :
            <AntdInput 
              defaultValue={value}
              onChange={(e)=>{
                const value = e.target.value;
                onFieldChange(value);
              }}
            />
        }</>
      ) : (
        children
      )}
    </td>
  );
};

// 컬럼 커스텀
export type CustomColumn = ColumnType<any>
  & { editable?: boolean }                                  // 수정 가능 여부
  & { editType?: 'input' | 'select' | 'date' | 'toggle' }   // 수정 시 셀의 타입 (toggle은 true, false 값만 필요할 경우 사용)
  & { req?: boolean }                                       // 수정 시 필수 여부
  & { selectOptions?: any[] }                               // 셀의 타입이 SELECT일 경우의 SELECT 옵션
  & { selectValue?: any };                                  // SELECT시 VALUE 값을 넣어줄 곳 (ex. process : id - value / prcNm - label)

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
  };
  className?: string;
  tableProps?: {
    rowSelection?: "radio" | "checkbox";
    split?: "none";
  };
}

// 컴포넌트
const AntdTableEdit: React.FC<Props> = ({ columns, data, styles, className, tableProps }) => {
  const [form] = Form.useForm();

  // 데이터
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 저장 전 데이터 (esc 누를 경우 원래 값으로 돌아오기 위함)
  const [realDataSource, setRealDataSource] = useState<any[]>([]);
  const [editingKey, setEditingKey] = useState<React.Key>("");

  // 데이터가 load 됐을 때 각각 값 넣어줌
  useEffect(()=>{
    setDataSource((data ?? []).map((item: any, index: number) => ({
      ...item,
      key: item.key ?? index.toString(),
    })));
    setRealDataSource((data ?? []).map((item: any, index: number) => ({
      ...item,
      key: item.key ?? index.toString(),
    })));
  }, [data]);

  // 값 수정될 경우 (더블 클릭 시) - editingKey에 행의 key 값을 넣어줌
  const isEditing = (record: DataType) => record.key === editingKey;

  // 값 수정 시 실행되는 함수
  const handleFieldChange = (
    key: React.Key, 
    dataIndex: string, 
    value: any, 
    editType?: 'select' | 'input' | 'date' | 'toggle', 
    selectKey?: string,   //SELECT의 value 값을 변경하기 위해 가져옴
    label?: string        //SELECT의 라벨 값을 직접 변경해줌
  ) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      if(editType === 'select' && selectKey) {
        newData[index] = { ...newData[index] };
        //SELECT Value 값 변경 (value는 selectKey에 저장)
        set(newData[index], selectKey, value);
        //SELECT Label 값 변경 (label은 dataIndex에 저장)
        set(newData[index], dataIndex, label);
      } else {
        newData[index] = { ...newData[index] };
        set(newData[index], dataIndex, value);
      }
      setDataSource(newData);
    }
  };

  // 수정 모드로 전환
  const edit = (record: DataType) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const handleSave = async () => {
    if (editingKey !== "") {
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
      }
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  // 값 이전으로 복구
  const cancel = () => {
    setEditingKey("");
    setDataSource(realDataSource);
  };

  // Column이 그룹인지 확인하는 타입 가드 함수
  const isColumnGroup = (col: ColumnGroupType<any> | ColumnType<any>): col is ColumnGroupType<any> => {
    return "children" in col;
  };

  const resolvedColumns = typeof columns === "function" ? columns() : columns;

  // ColumnType만 onCell을 추가할 수 있도록 
  const mergedColumns: ColumnsType<any> = (resolvedColumns ?? []).map((col) => {
    if (isColumnGroup(col)) {
      return col; // 그룹 컬럼이면 그대로 반환
    }
  
    const column = col as CustomColumn; // 일반 컬럼으로 변환
  
    // 수정 모드가 아닐 때
    if (!column.editable) {
      return {
        render: (value: any, record: any) => {
          // 객체 안에 객체 값이 있을 때(ex. vendor.prtNm)는 value로 못 가져오므로 구분해서 실행
          // 숫자일 경우 그대로 출력 (dayjs.isValid()가 숫자도 true로 반환하기에 따로 분류)
          // 날짜일 경우 format 변경
          if(value) {
            if(!Number.isNaN(value))
              return value;
            if(dayjs(value).isValid())
              return dayjs(value).format('YYYY-MM-DD');
            return value;
          } else {
            const v = get(record, column.dataIndex);
            if(!Number.isNaN(value))
              return v;
            if(dayjs(v).isValid())
              return dayjs(value).format('YYYY-MM-DD');
            return v;
          }
        },
        // column 내부에 render가 있을 경우 column의 render를 우선으로 실행하기 위해 ...column이 뒤로 옴
        ...column
      };
    }
  
    // 수정 모드일 때
    return {
      render: (value: any,record: any) => {
        if(value) {
          if(typeof value === "number")
            return value;
          if(dayjs(value).isValid())
            return dayjs(value).format('YYYY-MM-DD');
          return value;
        } else {
          const v = get(record, column.dataIndex);
          if(typeof value === "number")
            return v;
          if(dayjs(v).isValid())
            return dayjs(value).format('YYYY-MM-DD');
          return v;
        }
      },
      ...column,
      // 수정 모드에 필요한 변수 및 함수들 (EditableCellProps, EditableCell)
      onCell: (record: DataType) => ({
        title: typeof column.title === "string" ? column.title : undefined,
        dataIndex: column.dataIndex,
        editing: isEditing(record) ? "true" : undefined,
        value: get(record, column.dataIndex),
        editType: column.editType,
        record: record,
        req: column.req,
        selectOptions: column.selectOptions,
        selectValue: get(record, column.selectValue),
        // 값 변경 시 실행되는 함수   ** 값 저장 아님
        onFieldChange: (value: any, label?: string) => handleFieldChange(record.key, col.dataIndex as string, value, column.editType, column.selectValue, label),
      }),
    };
  });
  
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
    >
      <ConfigProvider 
        theme={{ 
          ...AntdTableTheme,
          components: {
            Table: {
              headerSplitColor: tableProps?.split ?? '#0000000F',
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
            onRow={(record) => ({
              onDoubleClick: () => {
                // 더블 클릭 시 편집 모드 진입 (edit true일 때)
                if (editingKey === "") {
                  edit(record);
                }
              },
              onKeyDown: (e) => {
                //ESC 누르면 원래대로 돌아오고 Enter를 누르면 저장됨
                if(e.key === "Escape")
                  cancel();
                else if(e.key === "Enter")
                  handleSave();
              },
            })}
          />
        </Form>
      </ConfigProvider>
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
}>`
  width: 100%;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  
  .ant-table { 
    background: none;

    scrollbar-width: thin;
    scrollbar-color: #eaeaea transparent;
    scrollbar-gutter: stable;
  }

  .ant-table-thead { 
    background-color: ${({ $thBackground }) => $thBackground};

    .req { color: #1814F3 !important; }

    & .ant-table-cell {
      height: ${({ $thHeight }) => $thHeight};
      padding: ${({ $thPadding }) => $thPadding};

      text-align: center;

      font-weight: ${({ $thFontWeight }) => $thFontWeight};
      font-size: 14px;
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
      border-radius: 0 ${({ $round }) => $round } 0 0 !important;
      border-right: ${({ $line }) => $line};
    }

    & > tr:first-child > th:first-child {
      border-radius: ${({ $round }) => $round } 0 0 0 !important;
      border-left: ${({ $line }) => $line};
    }
  }

  .ant-table-tbody {
    background-color: ${({ $tdBackground }) => $tdBackground };

    & .ant-table-cell {
      height: ${({ $tdHeight }) => $tdHeight};
      padding: ${({ $tdPadding }) => $tdPadding};
      border: 0;
      border-top: 1px solid #0000000F;

      text-align: ${({ $tdTextAlign }) => $tdTextAlign };

      font-weight: 400;
      font-size: 14px;
      color: #444444;
    }

    & tr:last-child td {
      border-bottom: 1px solid #0000000F;
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
      border-radius: 0 0 ${({ $round }) => $round } 0;
      border-bottom: 1px solid #0000000F;
      border-right: ${({ $line }) => $line};
    }
    
    & tr:last-child td:first-child {
      border-radius: 0 0 0 ${({ $round }) => $round };
      border-bottom: 1px solid #0000000F;;
      border-left: ${({ $line }) => $line};
    }
  }
`;

export default AntdTableEdit;
