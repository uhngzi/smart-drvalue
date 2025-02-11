import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';

import Edit from '@/assets/svg/icons/memo.svg';
import { HotGrade, ModelStatus } from '../type/enum';
import { salesOrderCUType, salesOrderProcuctCUType, salesOrderProductRType, salesOrderRType } from '../type/sales/order';
import { CustomColumn } from '@/components/List/AntdTableEdit';
import { partnerMngRType, partnerRType } from '../type/base/partner';

import Trash from "@/assets/svg/icons/s_trash.svg";
import dayjs from 'dayjs';

export const salesUserOrderClmn = (
  totalData: number,
  openPrtDrawer: () => void,
  setEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setDetailId: React.Dispatch<React.SetStateAction<string>>,
  setPartnerData: React.Dispatch<React.SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<React.SetStateAction<partnerMngRType | null>>,
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
    render: (_, record:salesOrderRType) => (
      <div
        className="w-full h-full v-h-center cursor-pointer"
        onClick={()=>{
          openPrtDrawer();
          setPartnerData(record.prtInfo.prt);
          setPartnerMngData(record.prtInfo.mng);
        }}
      >
        {record.prtInfo.prt.prtNm}
      </div>
    )
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
    cellAlign: 'left',
  },
  {
    title: '모델수',
    width: 70,
    dataIndex: 'modelCnt',
    key: 'modelCnt',
    align: 'center',
    render: (_:any, record:salesOrderRType) => {
      return record.products.length;
    }
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
    render: (value:any, record:salesOrderRType) => (
      <div className="w-full h-full v-h-center">
        <div 
          className="w-40 h-40 v-h-center cursor-pointer rounded-4 hover:bg-[#E9EDF5]" 
          onClick={()=>{
            setEdit(true);
            setDetailId(record.id);
          }}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
    )
  },
];

export const salesUserOrderModelClmn = (
  newProducts: salesOrderProcuctCUType[],
  setNewProducts: React.Dispatch<React.SetStateAction<salesOrderProcuctCUType[]>>,
): CustomColumn[] => [
  {
    title: '발주 모델명',
    width: 220,
    dataIndex: 'orderTit',
    key: 'orderTit',
    align: 'center',
    editable: true,
  },
  {
    title: '구분',
    width: 85,
    dataIndex: 'modelStatusLabel',
    key: 'modelStatusLabel',
    align: 'center',
    editType: 'select',
    selectOptions: [
      {value:ModelStatus.NEW,label:'신규'},
      {value:ModelStatus.REPEAT,label:'반복'},
      {value:ModelStatus.MODIFY,label:'수정'},
    ],
    selectValue: 'modelStatus',
  },
  {
    title: '층',
    width: 75,
    dataIndex: 'currPrdInfo.layer',
    key: 'currPrdInfo.layer',
    align: 'center',
    inputType: 'number',
  },
  {
    title: '두께',
    width: 75,
    dataIndex: 'currPrdInfo.thic',
    key: 'currPrdInfo.thic',
    align: 'center',
    inputType: 'number',
  },
  {
    title: '수량',
    width: 75,
    dataIndex: 'orderPrdCnt',
    key: 'orderPrdCnt',
    align: 'center',
    inputType: 'number',
  },
  {
    title: '납기일',
    width: 150,
    dataIndex: 'orderPrdDueDt',
    key: 'orderPrdDueDt',
    align: 'center',
    editType: 'date',
  },
  {
    title: '견적단가',
    width: 120,
    dataIndex: 'orderPrdPrice',
    key: 'orderPrdPrice',
    align: 'center',
    inputType: 'number',
  },
  {
    title: '',
    width: 40,
    dataIndex: 'modelAmount',
    key: 'modelAmount',
    align: 'center',
    editType: 'none',
    render: (_, record) => (
      <div
        className='w-24 h-24 v-h-center cursor-pointer'
        onClick={()=>{
          setNewProducts(newProducts.filter((f:salesOrderProcuctCUType)=>f.id !== record.id));
        }}
      >
        <Trash/>
      </div>
    )
  },
];