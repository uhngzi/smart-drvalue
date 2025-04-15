import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';

import Edit from '@/assets/svg/icons/memo.svg';
import { FinalGlbStatus, HotGrade, LayerEm, ModelStatus, SalesOrderStatus } from '../type/enum';
import { salesEstimateType, salesOrderCUType, salesOrderProcuctCUType, salesOrderProductRType, salesOrderRType, salesOrderWorkSheetType } from '../type/sales/order';
import { CustomColumn } from '@/components/List/AntdTableEdit';
import { partnerMngRType, partnerRType } from '../type/base/partner';

import Trash from "@/assets/svg/icons/s_trash.svg";
import { SetStateAction } from 'react';
import { NextRouter } from 'next/router';
import { Tooltip } from 'antd';
import { specModelType } from '../type/sayang/sample';
import { modelsType } from '../type/sayang/models';
import GlobalMemo from '@/contents/globalMemo/GlobalMemo';

export const salesOrderStatusClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<React.SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<React.SetStateAction<partnerMngRType | null>>,
  pagination: {current: number, size: number},
  setOrderId: React.Dispatch<SetStateAction<string>>,
  setSpecData: React.Dispatch<SetStateAction<specModelType | null>>,
  setDrawerModelOpen: React.Dispatch<SetStateAction<boolean>>,
): CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    leftPin: true,
    render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
  },
  // {
  //   title: 'LotNo',
  //   width: 120,
  //   dataIndex: 'worksheet.specModel.fpNo',
  //   key: 'worksheet.specModel.fpNo',
  //   align: 'center', 
  // },
  {
    title: '관리번호',
    width: 120,
    dataIndex: 'worksheet.specModel.prdMngNo',
    key: 'worksheet.specModel.prdMngNo',
    align: 'center',
    render: (_, record:salesOrderWorkSheetType) => (
      <div className="w-full v-h-venter">
        { record?.worksheet?.specModel?.prdMngNo ? record?.worksheet?.specModel?.prdMngNo : "사양미확정"}
      </div>
    )
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    key: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:salesOrderWorkSheetType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record?.prtInfo?.prt ?? null);
          setPartnerMngData(record?.prtInfo?.mng ?? null);
        }}
      >
        <FullChip label={record.prtInfo?.prt?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record.prtInfo?.prt?.prtNm}
      </div>
    )
  },
  {
    title: '사양모델명',
    minWidth: 150,
    dataIndex: 'worksheet.specModel.prdNm',
    key: 'worksheet.specModel.prdNm',
    align: 'center', 
    cellAlign: 'left',
    tooltip: "사양모델명을 클릭하면 사양 상세 정보를 볼 수 있어요",
    render: (value:string, record:salesOrderWorkSheetType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover"
        onClick={()=>{
          const dt = record.worksheet?.specModel as specModelType;
          setSpecData(dt ?? null);
          setDrawerModelOpen(true);
        }}
      >
        {record?.worksheet?.specModel?.prdNm}
      </div>
    )
  },
  {
    title: '수주모델명',
    minWidth: 150,
    dataIndex: 'orderTit',
    key: 'orderTit',
    align: 'center', 
    cellAlign: 'left',
    tooltip: "수주모델명을 클릭하면 고객발주 정보를 볼 수 있어요",
    render: (value:string, record:salesOrderWorkSheetType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover"
        onClick={()=>{
          setOrderId(record.order?.id ?? "");
          setDrawerModelOpen(true);
        }}
      >
        {value}
      </div>
    )
  },
  {
    title: '수주번호',
    width: 100,
    dataIndex: 'orderNo',
    key: 'orderNo',
    align: 'center', 
  },
  {
    title: '수주일',
    width: 100,
    dataIndex: 'orderDt',
    key: 'orderDt',
    align: 'center', 
  },
  {
    title: '수주량',
    width: 80,
    dataIndex: 'orderPrdCnt',
    key: 'orderPrdCnt',
    align: 'center',
    cellAlign: 'right',
    render: (value) => (
      <div className="w-full h-center justify-end">
        {value ? Number(value).toLocaleString() : 0}
      </div>
    )
   },
  {
    title: '수주매수',
    width: 80,
    dataIndex: 'm2',
    key: 'm2',
    align: 'center',
    cellAlign: 'right',
    
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'worksheet.specModel.layerEm',
    key: 'worksheet.specModel.layerEm',
    align: 'center',
    render: (_, record:salesOrderWorkSheetType) => (
      <div className="w-full h-full v-h-center">
        {(record?.worksheet?.specModel?.layerEm ?? "").replace("L", "")}
      </div>
    )
  },
  {
    title: '두께',
    width: 50,
    dataIndex: 'worksheet.specModel.thk',
    key: 'worksheet.specModel.thk',
    align: 'center', 
  },
  {
    title: '제품 W * 제품 H',
    width: 130,
    dataIndex: 'worksheet.specModel.pcsW*worksheet.specModel.pcsL',
    key: 'worksheet.specModel.pcsW*worksheet.specModel.pcsL',
    align: 'center', 
    render: (_, record:salesOrderWorkSheetType) => (
      <div className="w-full h-full v-h-center">
        {
          (record?.worksheet?.specModel?.pcsW || record?.worksheet?.specModel?.pcsL) ?
          (record?.worksheet?.specModel?.pcsW ?? "")+" * "+(record?.worksheet?.specModel?.pcsL ?? "") :
          ""
        }
      </div>
    )
  },
  {
    title: '판넬 W * 판넬 H',
    width: 130,
    dataIndex: 'worksheet.specModel.pnlW*worksheet.specModel.pnlL',
    key: 'worksheet.specModel.pnlW*worksheet.specModel.pnlL',
    align: 'center',
    render: (_, record:salesOrderWorkSheetType) => (
      <div className="w-full h-full v-h-center">
        {
          (record?.worksheet?.specModel?.pnlW || record?.worksheet?.specModel?.pnlL) ?
          (record?.worksheet?.specModel?.pnlW ?? "")+" * "+(record?.worksheet?.specModel?.pnlL ?? "") :
          ""
        }
      </div>
    )
  },
]

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
    leftPin: true,
    render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    key: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:salesOrderRType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record?.prtInfo?.prt ?? null);
          setPartnerMngData(record?.prtInfo?.mng ?? null);
        }}
      >
        <FullChip label={record.prtInfo?.prt?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record.prtInfo?.prt?.prtNm}
      </div>
    )
  },
  {
    title: '고객발주명',
    minWidth: 150,
    dataIndex: 'orderNm',
    key: 'orderNm',
    align: 'center',
    cellAlign: 'left',
    tooltip: "고객발주명을 클릭하면 수정하거나 상세 정보를 볼 수 있어요",
    render: (value:string, record:salesOrderRType) => (
      <div
        className="w-full h-center cursor-pointer text-left transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=> {
          if(!record.isDiscard && (record.finalGlbStatus === FinalGlbStatus.REGISTERING || record.finalGlbStatus === FinalGlbStatus.WAITING)) {
            // 완료 및 폐기가 아닐 경우에는 페이지 이동
            router.push(`/sales/offer/order/${record.id}`);
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
    title: '모델 수',
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
    title: '모델상태',
    width: 90,
    dataIndex: 'finalGlbStatus',
    key: 'finalGlbStatus',
    align: 'center',
    render: (value:any, record:salesOrderRType) => (
      <div className="w-full h-full v-h-center">
        { record.isDiscard ? (
          <FullChip label="폐기" />
        ): value === FinalGlbStatus.WAITING ? (
          <FullChip label="대기" state="yellow" />
        ) : value === FinalGlbStatus.COMPLETED ? (
          <FullChip label="완료" />
        ) : value === FinalGlbStatus.REGISTERING ? (
          <FullChip label="등록중" state="mint" />
        ) : (
          <FullChip label="폐기" />
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

export const salesModelsClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<React.SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<React.SetStateAction<partnerMngRType | null>>,
  pagination: {current: number, size: number},
  router: NextRouter,
): CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    leftPin: true,
    render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
  },
  {
    title: 'Tool No',
    width: 100,
    dataIndex: 'fpNo',
    key: 'fpNo',
    align: 'center',
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'partner.prtRegCd/partner.prtNm',
    key: 'partner.prtRegCd/partner.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:modelsType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record?.partner);
        }}
      >
        <FullChip label={record.partner?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record.partner?.prtNm}
      </div>
    )
  },
  {
    title: '모델명',
    minWidth: 180,
    dataIndex: 'prdNm',
    key: 'prdNm',
    align: 'center',
    tooltip: "모델명을 클릭하면 상세 정보를 볼 수 있어요",
    cellAlign: 'left',
    render: (value:string, record:modelsType) => (
      <div
        className="w-full h-center justify-left cursor-pointer transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=>{
          router.push(`/sales/model/${record.id}`);
        }}
      >
        {value}
      </div>
    )
  },
  {
    title: 'Rev',
    width: 130,
    dataIndex: 'prdRevNo',
    key: 'prdRevNo',
    align: 'center',
  },
  {
    title: '층',
    width: 80,
    dataIndex: 'layerEm',
    key: 'layerEm',
    align: 'center',
    render: (value:string) => {
      return value.replace("L", "");
    }
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'thk',
    key: 'thk',
    align: 'center',
  },
  {
    title: '제품 W * 제품 H',
    width: 150,
    dataIndex: 'pcsW*pcsL',
    key: 'pcsW*pcsL',
    align: 'center',
    render: (_, record:modelsType) => (
      <div>
        {
          (record?.pcsW || record?.pcsL) ?
          (record?.pcsW ?? "")+" * "+(record?.pcsL ?? "") :
          ""
        }
      </div>
    )
  },
  {
    title: '판넬 W * 판넬 H',
    width: 150,
    dataIndex: 'pnlW*pnlL',
    key: 'pnlW*pnlL',
    align: 'center',
    render: (_, record:modelsType) => (
      <div>
        {
          (record?.pnlW || record?.pnlL) ?
          (record?.pnlW ?? "")+" * "+(record?.pnlL ?? "") :
          ""
        }
      </div>
    )
  },
  {
    title: '메모',
    width: 80,
    dataIndex: 'memo',
    key: 'memo',
    align: 'center',
    render: (_, record, index) => (
      <GlobalMemo
        key={index}
        id={record.id ?? ""}
        entityName="RnTenantCbizModelEntity"
        entityRelation={{RnTenantCbizBizPartnerEntity: true}}
        relationIdx=""
      />
    )
  },
]

export const salesEstimateClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<React.SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<React.SetStateAction<partnerMngRType | null>>,
  pagination: {current: number, size: number},
  router: NextRouter,
):CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    leftPin: true,
    render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    key: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:salesEstimateType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record?.prtInfo?.prt ?? null);
          setPartnerMngData(record?.prtInfo?.mng ?? null);
        }}
      >
        <FullChip label={record.prtInfo?.prt?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record.prtInfo?.prt?.prtNm}
      </div>
    )
  },
  {
    title: '견적명',
    minWidth: 130,
    dataIndex: 'estimateNm',
    key: 'estimateNm',
    align: 'center',
    tooltip: "견적명을 클릭하면 상세 정보를 볼 수 있어요",
    cellAlign: 'left',
    render: (value:string, record:salesEstimateType) => (
      <div
        className="w-full h-center justify-left cursor-pointer transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=>{
          router.push(`/sales/estimate/${record.id}`);
        }}
      >
        {value}
      </div>
    )
  },
  {
    title: '모델 수',
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
    title: '견적일',
    width: 130,
    dataIndex: 'estimateDt',
    align: 'center',
    key: 'estimateDt',
  },
  {
    title: '견적상태',
    width: 90,
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (value:any, record:salesEstimateType) => (
      <div className="w-full h-full v-h-center">
        { record.isDiscard ? (
          <FullChip label="폐기" />
        ): value === 'register' ? (
          <FullChip label="등록" state="yellow" />
        ) : value === 'send' ? (
          <FullChip label="확정" state="purple" />
        ) : value === 'order' ? (
          <FullChip label="수주" state="mint" />
        ) : (
          <></>
        )}
      </div>
    )
  },
]