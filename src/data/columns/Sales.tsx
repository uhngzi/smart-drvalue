import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';

import Edit from '@/assets/svg/icons/memo.svg';
import { FinalGlbStatus, HotGrade, ModelStatus, SalesOrderStatus } from '../type/enum';
import { salesOrderCUType, salesOrderProcuctCUType, salesOrderProductRType, salesOrderRType } from '../type/sales/order';
import { CustomColumn } from '@/components/List/AntdTableEdit';
import { partnerMngRType, partnerRType } from '../type/base/partner';

import Trash from "@/assets/svg/icons/s_trash.svg";
import { SetStateAction } from 'react';
import { NextRouter } from 'next/router';
import { Tooltip } from 'antd';

export const salesUserOrderClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<React.SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<React.SetStateAction<partnerMngRType | null>>,
  pagination: {current: number, size: number},
  setOrderId: React.Dispatch<SetStateAction<string>>,
  setOrderDrawer: React.Dispatch<SetStateAction<boolean>>,
  router: NextRouter,
): CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
  },
  {
    title: '업체명/코드',
    width: 150,
    dataIndex: 'prtInfo.prt.prtNm/prtInfo.prt.prtRegCd',
    key: 'prtInfo.prt.prtNm/prtInfo.prt.prtRegCd',
    align: 'center',
    tooltip: "업체명/코드를 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:salesOrderRType) => (
      <div
        className="w-full h-center cursor-pointer jutify-left transition-shadow duration-300 shadow-none hover:shadow-md"
        onClick={()=>{
          setPartnerData(record?.prtInfo?.prt);
          setPartnerMngData(record?.prtInfo?.mng);
        }}
      >
        {record.prtInfo?.prt?.prtNm} / {record.prtInfo?.prt?.prtRegCd}
      </div>
    )
  },
  {
    title: '발주명',
    minWidth: 150,
    dataIndex: 'orderNm',
    key: 'orderNm',
    align: 'center',
    cellAlign: 'left',
    tooltip: "발주명을 클릭하면 수정하거나 상세 정보를 볼 수 있어요",
    render: (value:string, record:salesOrderRType) => (
      <div
        className="w-full h-center cursor-pointer jutify-left transition--colors duration-300 hover:text-point1"
        onClick={()=> {
          if(!record.isDiscard && (record.finalGlbStatus === FinalGlbStatus.REGISTERING || record.finalGlbStatus === FinalGlbStatus.WAITING)) {
            // 완료 및 폐기가 아닐 경우에는 페이지 이동
            router.push(`/sales/order/${record.id}`);
          } else {
            // 완료 및 폐기 또는 unknown일 경우에는 드로워 세팅
            setOrderId(record.id);
            setOrderDrawer(true);
          }  
        }}
      >
        {value}
      </div>
    )
  },
  {
    title: '대기 모델 수',
    width: 100,
    dataIndex: 'modelCnt',
    key: 'modelCnt',
    align: 'center',
  },
  {
    title: '업체 담당',
    width: 120,
    dataIndex: 'prtInfo.mng.prtMngNm',
    key: 'prtInfo.mng.prtMngNm',
    align: 'center',
  },
  {
    title: '담당 전화번호',
    width: 130,
    dataIndex: 'prtInfo.mng.prtMngTel',
    key: 'prtInfo.mng.prtMngTel',
    align: 'center',
  },
  {
    title: '담당 이메일',
    width: 140,
    dataIndex: 'prtInfo.mng.prtMngEmail',
    key: 'prtInfo.mng.prtMngEmail',
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
    width: 130,
    dataIndex: 'orderRepDt',
    align: 'center',
    key: 'orderRepDt',
  },
  {
    title: '발주일',
    width: 130,
    dataIndex: 'orderDt',
    align: 'center',
    key: 'orderDt',
  },
  {
    title: '모델등록',
    width: 90,
    dataIndex: 'finalGlbStatus',
    key: 'finalGlbStatus',
    align: 'center',
    render: (value:any, record:salesOrderRType) => (
      <div className="w-full h-full v-h-center">
        { record.isDiscard ? (
           <FullChip label="폐기" click={()=>{
            setOrderId(record.id);
            setOrderDrawer(true);
          }}/>
        ): value === FinalGlbStatus.WAITING ? (
          <FullChip label="대기" state="yellow" 
            click={()=>{
              router.push(`/sales/order/${record.id}`);
            }}
          />
        ) : value === FinalGlbStatus.COMPLETED ? (
          <FullChip label="완료" click={()=>{
            setOrderId(record.id);
            setOrderDrawer(true);
          }}/>
        ) : value === FinalGlbStatus.REGISTERING ? (
        // ) : (
          <FullChip
            label="등록중" state="mint" 
            click={()=>{
              router.push(`/sales/order/${record.id}`);
            }}
          />
         )
        : (
           <FullChip label="폐기" click={()=>{
            setOrderId(record.id);
            setOrderDrawer(true);
          }}/>
        )}
      </div>
    )
  },
];

export const salesUserOrderModelClmn = (
  newProducts: salesOrderProcuctCUType[],
  setNewProducts: React.Dispatch<React.SetStateAction<salesOrderProcuctCUType[]>>,
  setDeleted: React.Dispatch<SetStateAction<boolean>>,
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
    title: '고객측 관리번호',
    width: 220,
    dataIndex: 'prtOrderNo',
    key: 'prtOrderNo',
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
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    editType: 'none',
    render: (value:string, record) => (
      record.disabled ? <></>: 
      <div
        className='w-24 h-24 v-h-center cursor-pointer'
        onClick={()=>{
          if(value.includes('new')) {
            setNewProducts(newProducts.filter((f:salesOrderProcuctCUType)=>f.id !== value));
          } else {
            const updateData = newProducts;
            const index = newProducts.findIndex(f=> f.id === value);
            if(index > -1) {
              updateData[index] = { ...updateData[index], disabled: true };

              const newArray = [
                ...updateData.slice(0, index),
                updateData[index],
                ...updateData.slice(index + 1)
              ];
              setNewProducts(newArray);
              setDeleted(true);
            }
          }
        }}
      >
        <Trash/>
      </div>
    )
  },
];