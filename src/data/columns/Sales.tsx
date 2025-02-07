import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';

import Edit from '@/assets/svg/icons/memo.svg';
import { HotGrade } from '../type/enum';
import { salesOrderRType } from '../type/sales/order';
import { CustomColumn } from '@/components/List/AntdTableEdit';

export const salesUserOrderClmn = (
  totalData: number,
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
): CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (_: any, __: any, index: number) => totalData - index, // 역순 번호 매기기
  },
  {
    title: '고객명',
    width: 250,
    dataIndex: 'prtInfo.prt.prtNm',
    key: 'prtNm',
    align: 'center',
  },
  {
    title: '고객코드',
    width: 120,
    dataIndex: 'prtInfo.prt.prtRegCd',
    key: 'prtInfo.prt.prtRegCd',
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
    dataIndex: 'prtInfo.mng.prtMngNm',
    key: 'prtInfo.mng.prtMngNm',
    align: 'center',
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'hotGrade',
    key: 'hotGrade',
    align: 'center',
    render: (value: HotGrade) => (
      <div className="v-h-center">
        { value === HotGrade.SUPER_URGENT ? (
          <FullChip label="초긴급" state="purple"/>
        ) : value === HotGrade.URGENT ? (
          <FullChip label="긴급" state="pink" />
        ) : (
          <FullChip label="일반" />
        )}
      </div>
    ),
  },
  {
    title: '영업담당',
    width: 120,
    dataIndex: 'emp.name',
    align: 'center',
    key: 'emp.name',
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
            // setNewOpen(true);
          }}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
    )
  },
];