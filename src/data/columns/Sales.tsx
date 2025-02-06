import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';

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
          }}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
    )
  },
];