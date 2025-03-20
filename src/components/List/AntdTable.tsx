import { ConfigProvider, Table, TableProps, ThemeConfig } from 'antd';
import { createStyles } from 'antd-style';
import { SetStateAction, useState } from 'react';
import styled from 'styled-components';

const AntdTableTheme: ThemeConfig = {
  components: {
    Table: {
      headerSplitColor: 'transparent',
    },
  },
};

interface Props {
  columns: TableProps['columns'];
  data?: any[];
  styles?: {
    pd?: string;
    round?: string;
    line?: 'y' | 'n';
    th_ht?: string;
    th_bg?: string;
    th_pd?: string;
    th_fw?: string;
    th_fs?: string;
    td_ht?: string;
    td_bg?: string;
    td_pd?: string;
    td_al?: string;
  }
  className?: string;
  tableProps?: {
    rowSelection?: 'radio' | 'checkbox';
    split?: 'none';
  };
  loading?: boolean;
  selectedRowId?: string | null;
  setSelectedRowId?: React.Dispatch<SetStateAction<string | null>>;
}

const AntdTable: React.FC<Props> = ({ 
  columns,
  data,
  styles,
  className,
  tableProps,
  loading,
  selectedRowId,
  setSelectedRowId,
}) => {

  return (
    <AntdTableStyled 
      className={className}
      $padding={styles?.pd?styles.pd:'0 10px'}
      $thPadding={styles?.th_pd?styles.th_pd:'0 10px'}
      $tdPadding={styles?.td_pd?styles.td_pd:'0 10px'}
      $thHeight={styles?.th_ht ?? '55px'}
      $tdHeight={styles?.td_ht ?? '55px'}
      $thBackground={styles?.th_bg?styles.th_bg:'white'}
      $tdBackground={styles?.td_bg?styles.td_bg:'none'}
      $tdTextAlign={styles?.td_al?styles.td_al:'left'}
      $thFontWeight={styles?.th_fw?styles.th_fw:'500'}
      $thFontSize={styles?.th_fs?styles.th_fs:'14px'}
      $round={styles?.round||'14px'}
      $line={styles?.line==='n'?'0':'1px solid #0000000F'}
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
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={false}
          scroll={{ x: 'max-content' }}
          loading={loading}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRowId?.(record?.id ?? "");
            },
          })}
          rowClassName={(record) =>
            selectedRowId && record?.id === selectedRowId ? 'selected-row' : ''
          }
        />
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
  $thFontSize: string;
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
    & > tr:first-child>th {
      padding-top: 10px;
    }
    & > tr:last-child>th {
      /* padding-bottom: 10px; */
    }
    .req { color: #1814F3 !important; }

    & .ant-table-cell {
      height: ${({ $thHeight }) => $thHeight};
      padding: ${({ $thPadding }) => $thPadding};

      text-align: center;

      font-weight: ${({ $thFontWeight }) => $thFontWeight};
      font-size: ${({ $thFontSize }) => $thFontSize};
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

  .selected-row {
    background-color: #F0F5FF !important;
  }
`;

export default AntdTable;
