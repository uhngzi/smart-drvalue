import { TableProps } from "antd";

export const sayangColumn:TableProps['columns'] = [
  {
    title: '번호',
    dataIndex: 'list_index',
    key: 'list_index',
  },
  {
    title: '관리 No',
    className: 'req',
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
]