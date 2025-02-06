import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';
import { GridColDef } from '@mui/x-data-grid';

import Edit from '@/assets/svg/icons/memo.svg';

export const salesUserOrderClmn = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setNewOpen: React.Dispatch<React.SetStateAction<boolean>>,
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
    dataIndex: 'prtNm',
    key: 'prtNm',
    align: 'center',
  },
  {
    title: '고객코드',
    width: 120,
    dataIndex: 'prtCode',
    key: 'prtCode',
    align: 'center',
  },
  {
    title: '발주명',
    width: 360,
    dataIndex: 'orderNm',
    key: 'orderNm',
    align: 'center',
  },
  {
    title: '모델수',
    width: 70,
    dataIndex: 'modelCnt',
    key: 'modelCnt',
    align: 'center',
  },
  {
    title: '고객처 담당',
    width: 120,
    dataIndex: 'prtMngName',
    key: 'prtMngName',
    align: 'center',
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'hotGrade',
    key: 'hotGrade',
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
    dataIndex: 'prtMngNm',
    align: 'center',
    key: 'prtMngNm',
  },
  {
    title: '발주접수일',
    width: 150,
    dataIndex: 'orderRepDt',
    align: 'center',
    key: 'orderRepDt',
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'orderDt',
    align: 'center',
    key: 'orderDt',
  },
  {
    title: '모델등록',
    width: 150,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value) => (
      <div className="w-full h-full v-h-center">
        <div 
          className="w-40 h-40 v-h-center cursor-pointer rounded-4 hover:bg-[#E9EDF5]" 
          onClick={()=>{
            setNewOpen(true);
            // router.push(`/sayang/model/wait/form/${value}`);
          }}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
    )
  },
];


export const salesUserOrderClmnMui = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
): GridColDef<any>[] => [
  {
    field : 'no',
    headerName : 'No.',
    width: 50,
    align: 'center',
    editable: false,
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
    width: 80,
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
    width: 80,
    align: 'center',
    type: 'number',
  },
  {
    field: 'layer',
    headerName: '층',
    width: 80,
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