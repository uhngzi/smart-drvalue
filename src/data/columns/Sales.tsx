import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';
import { GridColDef } from '@mui/x-data-grid';

export const salesUserOrderClmn = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
): TableProps['columns'] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
  },
  {
    title: '고객명',
    width: 250,
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
  {
    title: '고객코드',
    width: 120,
    dataIndex: 'cuName',
    key: 'cuName',
    align: 'center',
  },
  {
    title: '발주명',
    width: 360,
    dataIndex: 'orderName',
    key: 'orderName',
    align: 'center',
  },
  {
    title: '모델수',
    width: 70,
    dataIndex: 'mngName',
    key: 'mngName',
    align: 'center',
  },
  {
    title: '고객처 담당',
    width: 120,
    dataIndex: 'mngName',
    key: 'mngName',
    align: 'center',
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'hot',
    key: 'hot',
    align: 'center',
    render: (value: number) => (
      <div className="v-h-center">
        {value === 3 ? (
          <FullChip label="일반" />
        ) : value === 2 ? (
          <FullChip label="긴급" state="pink" />
        ) : (
          <FullChip label="초긴급" state="purple"/>
        )}
      </div>
    ),
  },
  {
    title: '영업담당',
    width: 120,
    dataIndex: 'thic',
    align: 'center',
    key: 'thic',
  },
  {
    title: '발주접수일',
    width: 150,
    dataIndex: 'layer',
    align: 'center',
    key: 'layer',
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'submitDt',
    align: 'center',
    key: 'submitDt',
  },
  {
    title: '모델 등록',
    width: 100,
    dataIndex: 'model',
    align: 'center',
    key: 'model',
    render: (value: number) => (
      <div className="v-h-center">
        {value === 3 ? (
          <FullChip label="완료" />
        ) : value === 2 ? (
          <FullChip label="등록중" state="mint" click={() => setOpen(true)} />
        ) : (
          <FullChip label="대기" state="yellow" click={() => setOpen(true)} />
        )}
      </div>
    ),
  },
];


export const salesUserOrderClmnMui = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
): GridColDef<any>[] => [
  {
    field : 'no',
    headerName : 'No.',
    width: 80,
    align: 'center',
    editable: false,
    headerClassName: "pinned-column header",
    cellClassName: "pinned-column",
  },
  {
    field: 'ㄱ',
    headerName: '관리No',
    width: 130,
    align: 'center',
  },
  {
    field: 'cuName',
    headerName: '업체명/코드',
    width: 130,
    align: 'left',
  },
  {
    field: 'orderName',
    headerName: '고객요구(발주)명',
    flex: 1,
    minWidth: 150,
    align: 'left',
  },
  {
    field: 'mngName',
    headerName: '업체담당',
    width: 100,
    align: 'center',
  },
  {
    field: 'hot',
    headerName: '긴급',
    width: 100,
    align: 'center',
    renderCell: (params) => (
      <div className="v-h-center">
        {params.value === 3 ? (
          <FullChip label="일반" />
        ) : params.value === 2 ? (
          <FullChip label="긴급" state="pink" />
        ) : (
          <FullChip label="초긴급" state="purple"/>
        )}
      </div>
    ),
  },
  {
    field: 'state',
    headerName: '구분',
    width: 100,
    align: 'center',
    renderCell: (params) => (
      <div className="v-h-center">
        {params.value === 3 ? (
          <FullChip label="신규" />
        ) : params.value === 2 ? (
          <FullChip label="수정" state="yellow" />
        ) : (
          <FullChip label="반복" state="mint"/>
        )}
      </div>
    ),
  },
  {
    field: 'thic',
    headerName: '두께',
    width: 100,
    align: 'center',
    type: 'number',
  },
  {
    field: 'layer',
    headerName: '층',
    width: 100,
    align: 'center',
  },
  {
    field: 'saleMng',
    headerName: '영업담당',
    width: 80,
    align: 'center',
  },
  {
    field: 'orderDt',
    headerName: '발주(요구) 접수일',
    width: 120,
    align: 'center',
  },
  {
    field: 'submitDt',
    headerName: '발주일',
    width: 120,
    align: 'center',
  },
  {
    field: 'model',
    headerName: '모델 등록',
    width: 100,
    align: 'center',
    renderCell: (params) => (
      <div className="v-h-center">
        {params.value === 3 ? (
          <FullChip label="완료" />
        ) : params.value === 2 ? (
          <FullChip label="등록중" state="mint" click={() => setOpen(true)} />
        ) : (
          <FullChip label="대기" state="yellow" click={() => setOpen(true)} />
        )}
      </div>
    ),
  },
]