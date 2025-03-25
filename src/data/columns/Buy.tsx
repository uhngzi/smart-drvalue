import { CustomColumn } from "@/components/List/AntdTableEdit";
import { buyCostOutType, buyOrderDetailType, buyOrderType } from "../type/buy/cost";
import { LayerEm } from "../type/enum";
import FullChip from "@/components/Chip/FullChip";
import { SetStateAction } from "react";
import { processVendorPriceRType } from "../type/base/process";
import { materialPriceType } from "../type/base/material_back";
import Trash from "@/assets/svg/icons/trash.svg";
import Print from "@/assets/svg/icons/print.svg";

export const BuyCostOutClmn = (
  totalData: number,
  pagination: {current: number, size: number},
  setOpen: React.Dispatch<SetStateAction<boolean>>,
  setSelect: React.Dispatch<SetStateAction<buyCostOutType | null>>,
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
    title: '수주번호',
    width: 100,
    dataIndex: 'specModel.prdMngNo',
    key: 'specModel.prdMngNo',
    align: 'center',
  },
  {
    title: '수주수량',
    width: 100,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
  },
  {
    title: '관리모델',
    width: 100,
    dataIndex: 'specModel.fpNo',
    key: 'specModel.fpNo',
    align: 'center',
  },
  {
    title: '모델명',
    minWidth: 180,
    dataIndex: 'specModel.prdNm',
    key: 'specModel.prdNm',
    align: 'center',
    cellAlign: 'left',
    tooltip: "모델명을 클릭하면 외주처 단가를 등록할 수 있어요",
    render: (_, record) => (
      <div
        className="w-full h-center cursor-pointer justify-left transition--colors duration-300 hover:text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=>{
          setSelect(record);
        }}
      >
        {record?.specModel?.prdNm}
      </div>
    )
  },
  {
    title: '비용등록',
    width: 100,
    dataIndex: 'priceUnitChkYn',
    key: 'priceUnitChkYn',
    align: 'center',
    render: (value:0 | 1 | boolean, record:buyCostOutType) => (
      <div className="w-full h-full v-h-center">
        {
          value === 0 || value === false ? <FullChip state="yellow" label="등록전"/> :
          <FullChip state="mint" label="등록완료"/>
        }
      </div>
    )
  },
  {
    title: '작업지시확정일',
    width: 120,
    dataIndex: 'wsExpDt',
    key: 'wsExpDt',
    align: 'center',
  },
  {
    title: '납기일',
    width: 100,
    dataIndex: 'orderProduct.orderPrdDueDt',
    key: 'orderProduct.orderPrdDueDt',
    align: 'center',
  },
  {
    title: '투입예정일',
    width: 100,
    dataIndex: 'wsExpDt',
    key: 'wsExpDt',
    align: 'center',
  },
  {
    title: '생산계획량',
    width: 100,
    dataIndex: 'wkPrdCnt',
    key: 'wkPrdCnt',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '외주처공정수',
    width: 100,
    dataIndex: 'wkProcCnt',
    key: 'wkProcCnt',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '재질',
    width: 100,
    dataIndex: 'specModel.material.cdNm',
    key: 'specModel.material.cdNm',
    align: 'center',
  },
  {
    title: '원판',
    width: 100,
    dataIndex: 'specModel.board.brdType',
    key: 'specModel.board.brdType',
    align: 'center',
  },
  {
    title: '층',
    width: 100,
    dataIndex: 'specModel.layerEm',
    key: 'specModel.layerEm',
    align: 'center',
    render: (value:LayerEm) => {
      return (value ?? "").replace("L", "");
    }
  },
  {
    title: '두께',
    width: 100,
    dataIndex: 'specModel.thk',
    key: 'specModel.thk',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '제품 PCS H',
    width: 100,
    dataIndex: 'specModel.pcsW',
    key: 'specModel.pcsW',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '제품 PCS V',
    width: 100,
    dataIndex: 'specModel.pcsL',
    key: 'specModel.pcsL',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '제품 KIT H',
    width: 100,
    dataIndex: 'specModel.kitW',
    key: 'specModel.kitW',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '제품 KIT V',
    width: 100,
    dataIndex: 'specModel.kitL',
    key: 'specModel.kitL',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '재단 H',
    width: 100,
    dataIndex: 'specModel.pnlW',
    key: 'specModel.pnlW',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '재단 V',
    width: 100,
    dataIndex: 'specModel.pnlL',
    key: 'specModel.pnlL',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: 'M/K색상',
    width: 100,
    dataIndex: 'specModel.mkColor.cdNm',
    key: 'specModel.mkColor.cdNm',
    align: 'center',
  },
  {
    title: 'M/K잉크',
    width: 100,
    dataIndex: 'specModel.mkType.cdNm',
    key: 'specModel.mkType.cdNm',
    align: 'center',
  },
  {
    title: 'M/K인쇄',
    width: 100,
    dataIndex: 'specModel.mkPrint.cdNm',
    key: 'specModel.mkPrint.cdNm',
    align: 'center',
  },
  {
    title: 'S/M색상',
    width: 100,
    dataIndex: 'specModel.smColor.cdNm',
    key: 'specModel.smColor.cdNm',
    align: 'center',
  },
  {
    title: 'S/M잉크',
    width: 100,
    dataIndex: 'specModel.smType.cdNm',
    key: 'specModel.smType.cdNm',
    align: 'center',
  },
  {
    title: 'S/M인쇄',
    width: 100,
    dataIndex: 'specModel.smPrint.cdNm',
    key: 'specModel.smPrint.cdNm',
    align: 'center',
  },
  {
    title: '판넬',
    width: 100,
    dataIndex: 'specModel.prdMngNo',
    key: 'specModel.prdMngNo',
    align: 'center',
  },
  {
    title: '소요',
    width: 100,
    dataIndex: 'wkLatestDtm',
    key: 'wkLatestDtm',
    align: 'center',
  },
  {
    title: 'M2',
    width: 100,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
  },
  {
    title: '투입량',
    width: 100,
    dataIndex: 'wkOutCnt',
    key: 'wkOutCnt',
    align: 'center',
  },
  {
    title: 'Pcs/Kit',
    width: 100,
    dataIndex: 'specModel.kitPcs',
    key: 'specModel.kitPcs',
    align: 'center',
  },
  {
    title: 'Kit/Pnl',
    width: 100,
    dataIndex: 'specModel.pnlKit',
    key: 'specModel.pnlKit',
    align: 'center',
  },
  {
    title: 'Pcs/Sht',
    width: 100,
    dataIndex: 'specModel.sthPcs',
    key: 'specModel.sthPcs',
    align: 'center',
  },
  {
    title: 'Pnl/Sht',
    width: 100,
    dataIndex: 'specModel.sthPnl',
    key: 'specModel.sthPnl',
    align: 'center',
  },
  {
    title: '특이사항',
    width: 100,
    dataIndex: 'wsRemark',
    key: 'wsRemark',
    align: 'center',
  },
]

export const BuyCostOutPriceClmn = (
  selectPrice: {id:string, processId:string, vendorId:string, value:number}[],
  setSelectPrice: React.Dispatch<SetStateAction<{id:string, processId:string,vendorId:string, value:number}[]>>,
  select?: string,
): CustomColumn[] => [
  {
    title: '선택',
    width: 50,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value:string, record:processVendorPriceRType)=>(
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"linear-gradient(to right, transparent 0%, #F0F5FF 50%, #F0F5FF 100%)":""}}>
        <input
          type="radio" className="cursor-pointer"
          name={record.process.id} checked={select===record.id?true:false}
          onChange={()=>{
            setSelectPrice([
              ...selectPrice.filter(f=>f.processId !== record.process.id),
              {id:record?.id, processId: record?.process?.id, vendorId: (record?.vendor?.id ?? ""), value:record.priceUnit}
            ])
          }}
        />
      </div>
    )
  },
  {
    title: '단가명',
    width: 100,
    dataIndex: 'priceNm',
    key: 'priceNm',
    align: 'center',
    cellAlign: 'left',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {value}
      </div>
    )
  },
  {
    title: '층',
    width: 40,
    dataIndex: 'layerEm',
    key: 'layerEm',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {value.replace("L","")}
      </div>
    )
  },
  {
    title: '구분',
    width: 50,
    dataIndex: 'modelTypeEm',
    key: 'modelTypeEm',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {value === "sample" ? "샘플" : "양산"}
      </div>
    )
  },
  {
    title: '단가',
    width: 80,
    dataIndex: 'priceUnit',
    key: 'priceUnit',
    align: 'center',
    cellAlign: 'right',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {value}
      </div>
    )
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'thk',
    key: 'thk',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {value}
      </div>
    )
  },
  {
    title: '재질',
    width: 80,
    dataIndex: 'matCd',
    key: 'matCd',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {value}
      </div>
    )
  },
  {
    title: '금속재질',
    width: 80,
    dataIndex: 'metCd',
    key: 'metCd',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {value}
      </div>
    )
  },
  {
    title: '무게',
    width: 100,
    dataIndex: 'wgtMin/wgtMax',
    key: 'wgtMin/wgtMax',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {record?.wgtMin} ~ {record?.wgtMax}
      </div>
    )
  },
  {
    title: '수량',
    width: 100,
    dataIndex: 'cntMin/cntMax',
    key: 'cntMin/cntMax',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {record?.cntMin} ~ {record?.cntMax}
      </div>
    )
  },
  {
    title: '판넬수량',
    width: 100,
    dataIndex: 'pnlcntMin/pnlcntMax',
    key: 'pnlcntMin/pnlcntMax',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {record?.pnlcntMin} ~ {record?.pnlcntMax}
      </div>
    )
  },
  {
    title: '홀수량',
    width: 100,
    dataIndex: 'holecntMin/holecntMax',
    key: 'holecntMin/holecntMax',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"#F0F5FF":""}}>
        {record?.holecntMin} ~ {record?.holecntMax}
      </div>
    )
  },
  {
    title: 'M2',
    width: 100,
    dataIndex: 'm2Min/m2Max',
    key: 'm2Min/m2Max',
    align: 'center',
    render: (value, record) => (
      <div className="v-h-center w-full h-full" style={{background:select===record.id?"linear-gradient(to left, transparent 0%, #F0F5FF 50%, #F0F5FF 100%)":""}}>
        {record?.m2Min} ~ {record?.m2Max}
      </div>
    )
  },
]

export const BuyCostOutStatusClmn = (
  totalData: number,
  pagination: {current: number, size: number},
  setSelect: React.Dispatch<SetStateAction<buyCostOutType | null>>,
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
    title: '수주번호',
    width: 100,
    dataIndex: 'specModel.prdMngNo',
    key: 'specModel.prdMngNo',
    align: 'center',
  },
  {
    title: '수주수량',
    width: 100,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
  },
  {
    title: '관리모델',
    width: 100,
    dataIndex: 'specModel.fpNo',
    key: 'specModel.fpNo',
    align: 'center',
  },
  {
    title: '모델명',
    minWidth: 180,
    dataIndex: 'specModel.prdNm',
    key: 'specModel.prdNm',
    align: 'center',
    cellAlign: 'left',
    tooltip: "모델명을 클릭하면 외주처 단가 등록 내용을 볼 수 있어요",
    render: (_, record) => (
      <div
        className="w-full h-center cursor-pointer justify-left text-shadow-hover"
        onClick={()=>{
          setSelect(record);
        }}
      >
        {record?.specModel?.prdNm}
      </div>
    )
  },
  {
    title: '비용등록',
    width: 100,
    dataIndex: 'priceUnitChkYn',
    key: 'priceUnitChkYn',
    align: 'center',
    render: (value:0 | 1 | boolean, record:buyCostOutType) => (
      <div className="w-full h-full v-h-center">
        {
          value === 0 || value === false ? <FullChip state="yellow" label="등록전"/> :
          <FullChip state="mint" label="등록완료"/>
        }
      </div>
    )
  },
  {
    title: '작업지시확정일',
    width: 120,
    dataIndex: 'wsExpDt',
    key: 'wsExpDt',
    align: 'center',
  },
  {
    title: '납기일',
    width: 100,
    dataIndex: 'orderProduct.orderPrdDueDt',
    key: 'orderProduct.orderPrdDueDt',
    align: 'center',
  },
  {
    title: '투입예정일',
    width: 100,
    dataIndex: 'wsExpDt',
    key: 'wsExpDt',
    align: 'center',
  },
  {
    title: '생산계획량',
    width: 100,
    dataIndex: 'wkPrdCnt',
    key: 'wkPrdCnt',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '외주처공정수',
    width: 100,
    dataIndex: 'wkProcCnt',
    key: 'wkProcCnt',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '재질',
    width: 100,
    dataIndex: 'specModel.material.cdNm',
    key: 'specModel.material.cdNm',
    align: 'center',
  },
  {
    title: '원판',
    width: 100,
    dataIndex: 'specModel.board.brdType',
    key: 'specModel.board.brdType',
    align: 'center',
  },
  {
    title: '층',
    width: 100,
    dataIndex: 'specModel.layerEm',
    key: 'specModel.layerEm',
    align: 'center',
    render: (value:LayerEm) => {
      return (value ?? "").replace("L", "");
    }
  },
  {
    title: '두께',
    width: 100,
    dataIndex: 'specModel.thk',
    key: 'specModel.thk',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '제품 PCS H',
    width: 100,
    dataIndex: 'specModel.pcsW',
    key: 'specModel.pcsW',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '제품 PCS V',
    width: 100,
    dataIndex: 'specModel.pcsL',
    key: 'specModel.pcsL',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '제품 KIT H',
    width: 100,
    dataIndex: 'specModel.kitW',
    key: 'specModel.kitW',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '제품 KIT V',
    width: 100,
    dataIndex: 'specModel.kitL',
    key: 'specModel.kitL',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '재단 H',
    width: 100,
    dataIndex: 'specModel.pnlW',
    key: 'specModel.pnlW',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '재단 V',
    width: 100,
    dataIndex: 'specModel.pnlL',
    key: 'specModel.pnlL',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: 'M/K색상',
    width: 100,
    dataIndex: 'specModel.mkColor.cdNm',
    key: 'specModel.mkColor.cdNm',
    align: 'center',
  },
  {
    title: 'M/K잉크',
    width: 100,
    dataIndex: 'specModel.mkType.cdNm',
    key: 'specModel.mkType.cdNm',
    align: 'center',
  },
  {
    title: 'M/K인쇄',
    width: 100,
    dataIndex: 'specModel.mkPrint.cdNm',
    key: 'specModel.mkPrint.cdNm',
    align: 'center',
  },
  {
    title: 'S/M색상',
    width: 100,
    dataIndex: 'specModel.smColor.cdNm',
    key: 'specModel.smColor.cdNm',
    align: 'center',
  },
  {
    title: 'S/M잉크',
    width: 100,
    dataIndex: 'specModel.smType.cdNm',
    key: 'specModel.smType.cdNm',
    align: 'center',
  },
  {
    title: 'S/M인쇄',
    width: 100,
    dataIndex: 'specModel.smPrint.cdNm',
    key: 'specModel.smPrint.cdNm',
    align: 'center',
  },
  {
    title: '판넬',
    width: 100,
    dataIndex: 'specModel.prdMngNo',
    key: 'specModel.prdMngNo',
    align: 'center',
  },
  {
    title: '소요',
    width: 100,
    dataIndex: 'wkLatestDtm',
    key: 'wkLatestDtm',
    align: 'center',
  },
  {
    title: 'M2',
    width: 100,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
  },
  {
    title: '투입량',
    width: 100,
    dataIndex: 'wkOutCnt',
    key: 'wkOutCnt',
    align: 'center',
  },
  {
    title: 'Pcs/Kit',
    width: 100,
    dataIndex: 'specModel.kitPcs',
    key: 'specModel.kitPcs',
    align: 'center',
  },
  {
    title: 'Kit/Pnl',
    width: 100,
    dataIndex: 'specModel.pnlKit',
    key: 'specModel.pnlKit',
    align: 'center',
  },
  {
    title: 'Pcs/Sht',
    width: 100,
    dataIndex: 'specModel.sthPcs',
    key: 'specModel.sthPcs',
    align: 'center',
  },
  {
    title: 'Pnl/Sht',
    width: 100,
    dataIndex: 'specModel.sthPnl',
    key: 'specModel.sthPnl',
    align: 'center',
  },
  {
    title: '특이사항',
    width: 100,
    dataIndex: 'wsRemark',
    key: 'wsRemark',
    align: 'center',
  },
]

export const BuyOrderClmn = (
  totalData: number,
  pagination: {current: number, size: number},
  setOrderDocumentFormOpen: React.Dispatch<SetStateAction<boolean>>,
  setOrder: React.Dispatch<SetStateAction<buyOrderType | null>>,
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
    title: '주문번호',
    width: 130,
    dataIndex: 'orderNo',
    key: 'orderNo',
    align: 'center',
  },
  {
    title: '발주명',
    minWidth: 130,
    dataIndex: 'orderName',
    key: 'orderName',
    align: 'center',
    tooltip: "발주명을 클릭하시면 상세 내용 및 수정을 할 수 있어요",
    render: (value:string, record:buyOrderType) => (
      <div
        className="w-full h-center justify-left cursor-pointer transition--colors duration-300 hover:text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=>setOrder(record)}
      >
        {value}
      </div>
    )
  },
  // {
  //   title: '생산제품명',
  //   minWidth: 130,
  //   dataIndex: 'productName',
  //   key: 'productName',
  //   align: 'center',
  //   cellAlign: 'left',
  // },
  {
    title: '구매처명',
    width: 130,
    dataIndex: 'vendorName',
    key: 'vendorName',
    align: 'center',
    cellAlign: 'left',
    render: (value:string) => (
      value && value.includes("이름 없음") ? 
      <div className="v-h-center">
        -
      </div> :
      <div>
        {value}
      </div>
    )
  },
  {
    title: '총액',
    width: 100,
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    align: 'center',
    cellAlign: 'right',
  },
  {
    title: '상태',
    width: 100,
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (value) => (
      <div className="w-full h-full v-h-center">
        {
        value === "REQUEST_WAITING" ? 
          <FullChip label="발주 대기" state="yellow" />
        : value === "ARRIVAL_WAITING" ?
          <FullChip label="도착 대기" state="mint" />
        : value === "INPUT" ?
          <FullChip label="입고" />
        : value
        }
      </div>
    )
  },
  // {
  //   title: '발주확정일',
  //   width: 100,
  //   dataIndex: 'orderConfirmDate',
  //   key: 'orderConfirmDate',
  //   align: 'center',
  // },
  // {
  //   title: '발주예정일',
  //   width: 100,
  //   dataIndex: 'orderExpectedDate',
  //   key: 'orderExpectedDate',
  //   align: 'center',
  // },
  {
    title: '발주일',
    width: 100,
    dataIndex: 'orderDate',
    key: 'orderDate',
    align: 'center',
  },
  {
    title: '납품요구일',
    width: 100,
    dataIndex: 'deliveryDate',
    key: 'deliveryDate',
    align: 'center',
  },
  {
    title: '도착일',
    width: 100,
    dataIndex: 'arrivalDate',
    key: 'arrivalDate',
    align: 'center',
  },
  {
    title: '재고확인일',
    width: 100,
    dataIndex: 'inventoryCheckDate',
    key: 'inventoryCheckDate',
    align: 'center',
  },
  {
    title: '결제조건',
    width: 100,
    dataIndex: 'paymentCondition',
    key: 'paymentCondition',
    align: 'center',
  },
  {
    title: '담당자',
    width: 100,
    dataIndex: 'responsible',
    key: 'responsible',
    align: 'center',
    render: (value:string) => {
      return value && value.includes("이름 없음") ? "-" : value;
    }
  },
  {
    title: '영업담당',
    width: 100,
    dataIndex: 'salesResponsible',
    key: 'salesResponsible',
    align: 'center',
  },
  {
    title: '비고',
    width: 130,
    dataIndex: 'note',
    key: 'note',
    align: 'center',
    render: (value:string) => {
      return (<div className="text-left w-full h-center">{value && value.length > 6 ? value.slice(0, 6) + "..." : value}</div>)
    }
  },
  {
    title: '발주서',
    width: 70,
    dataIndex: 'orderNo',
    key: 'orderNo',
    align: 'center',
    rightPin: true,
    render: (_, record) => (
      <div
        className="w-full v-h-center"
        >
        <div
          className="bg-back rounded-6 w-40 h-40 v-h-center cursor-pointer"
          onClick={()=>{
            setOrder(record);
            setOrderDocumentFormOpen(true);
          }}
        >
          <p className="w-24 h-24"><Print /></p>
        </div>
      </div>
    )
  },
]

export const BuyOrderMtPriceClmn = (
  selectPrice: buyOrderDetailType[],
  setSelectPrice: React.Dispatch<SetStateAction<buyOrderDetailType[]>>,
):CustomColumn[] => [
  {
    title: '원자재명',
    minWidth: 100,
    dataIndex: 'material.mtNm',
    key: 'material.mtNm',
    align: 'center',
    render: (_, record:materialPriceType) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"linear-gradient(to right, transparent 0%, #F0F5FF 50%, #F0F5FF 100%)":""}}
        className="w-full h-full h-center justify-left cursor-copy px-10"
        onClick={() => {
          setSelectPrice([
            ...selectPrice,
            {
              mtNm: record?.material?.mtNm,
              materialIdx: record?.material?.id,
              mtOrderQty: record?.cntMin,
              mtOrderSizeW: record?.sizeW,
              mtOrderSizeH: record?.sizeH,
              mtOrderWeight: record?.wgtMin,
              mtOrderThk: record?.thicMin,
              mtOrderPrice: record?.priceUnit,
              mtOrderInputPrice: record?.priceUnit,
              mtOrderAmount: record?.cntMin,
              mtOrderUnit: record?.unitType,
              mtOrderTxtur: record?.txturType,
              mtId: record?.id,
            }
          ])
        }}
      >
        {record?.material?.mtNm}
      </div>
    ),
  },
  {
    title: '단위',
    width: 80,
    dataIndex: 'unitType',
    key: 'unitType',
    align: 'center',
    render: (value:string, record:materialPriceType) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"#F0F5FF":""}}
        className="w-full h-full h-center justify-left px-10"
      >
        {value}
      </div>
    ),
  },
  {
    title: '재질',
    width: 80,
    dataIndex: 'txturType',
    key: 'txturType',
    align: 'center',
    render: (value:string, record:materialPriceType) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"#F0F5FF":""}}
        className="w-full h-full h-center justify-left px-10"
      >
        {value}
      </div>
    ),
  },
  {
    title: '금속',
    width: 80,
    dataIndex: 'materialType',
    key: 'materialType',
    align: 'center',
    render: (value:string, record:materialPriceType) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"#F0F5FF":""}}
        className="w-full h-full h-center justify-left px-10"
      >
        {value}
      </div>
    ),
  },
  {
    title: '규격',
    width: 80,
    dataIndex: 'sizeW',
    key: 'sizeW',
    align: 'center',
    render: (value, record) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"#F0F5FF":""}}
        className="w-full h-full v-h-center px-10"
      >
        {value || record?.sizeH ? (value ?? "~")+" * "+(record?.sizeH ?? "~") : ""}
      </div>
    )
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'thicMin',
    key: 'thicMin',
    align: 'center',
    render: (value, record) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"#F0F5FF":""}}
        className="w-full h-full v-h-center"
      >
        {value || record?.thicMax ? (value ?? "~")+" * "+(record?.thicMax ?? "~") : ""}
      </div>
    )
  },
  {
    title: '무게',
    width: 80,
    dataIndex: 'wgtMin',
    key: 'wgtMin',
    align: 'center',
    render: (value, record) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"#F0F5FF":""}}
        className="w-full h-full v-h-center"
      >
        {value || record?.wgtMax ? (value ?? "~")+" * "+(record?.wgtMax ?? "~") : ""}
      </div>
    )
  },
  {
    title: '수량',
    width: 80,
    dataIndex: 'cntMin',
    key: 'cntMin',
    align: 'center',
    render: (value, record) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"#F0F5FF":""}}
        className="w-full h-full v-h-center"
      >
        {value || record?.cntMax ? (value ?? "~")+" * "+(record?.cntMax ?? "~") : ""}
      </div>
    )
  },
  {
    title: '단가',
    width: 80,
    dataIndex: 'priceUnit',
    key: 'priceUnit',
    align: 'center',
    render: (value, record) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"#F0F5FF":""}}
        className="w-full h-full h-center justify-end px-10"
      >
        {(value ?? 0).toLocaleString()}
      </div>
    )
  },
  {
    title: '단가 적용일',
    width: 100,
    dataIndex: 'appDt',
    key: 'appDt',
    align: 'center',
    render: (value, record) => (
      <div
        style={{background:selectPrice.filter(f=>f.mtId===record?.id).length > 0 ?"linear-gradient(to left, transparent 0%, #F0F5FF 50%, #F0F5FF 100%)":""}}
        className="w-full h-full h-center px-10"
      >
        {value}
      </div>
    )
  },
]

export const BuyOrderMtClmn = (
  handleDeleteMt: (index:number) => void,
):CustomColumn[] => [
  {
    title: '순서',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    cellAlign: 'center',
    editable: false,
    render: (_: any, __: any, index: number) => 
      <div className="w-full h-full v-h-center ml-[-5px]">{index+1}</div>, // 역순 번호 매기기
  },
  {
    title: '원자재명',
    minWidth: 80,
    dataIndex: 'mtNm',
    key: 'mtNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: '단위',
    width: 80,
    dataIndex: 'mtOrderUnit',
    key: 'mtOrderUnit',
    align: 'center',
  },
  {
    title: '재질',
    width: 80,
    dataIndex: 'mtOrderTxtur',
    key: 'mtOrderTxtur',
    align: 'center',
  },
  {
    title: 'W',
    width: 80,
    dataIndex: 'mtOrderSizeW',
    key: 'mtOrderSizeW',
    align: 'center',
    inputType: 'number',
    cellAlign: 'right',
    render: (value:number) => {
      return value.toLocaleString();
    }
  },
  {
    title: 'H',
    width: 80,
    dataIndex: 'mtOrderSizeH',
    key: 'mtOrderSizeH',
    align: 'center',
    inputType: 'number',
    cellAlign: 'right',
    render: (value:number) => {
      return value.toLocaleString();
    }
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'mtOrderThk',
    key: 'mtOrderThk',
    align: 'center',
    inputType: 'number',
    cellAlign: 'right',
    render: (value:number) => {
      return value.toLocaleString();
    }
  },
  {
    title: '무게',
    width: 80,
    dataIndex: 'mtOrderWeight',
    key: 'mtOrderWeight',
    align: 'center',
    inputType: 'number',
    cellAlign: 'right',
    render: (value:number) => {
      return value.toLocaleString();
    }
  },
  {
    title: '수량',
    width: 80,
    dataIndex: 'mtOrderQty',
    key: 'mtOrderQty',
    align: 'center',
    inputType: 'number',
    cellAlign: 'right',
    render: (value:number) => {
      return value.toLocaleString();
    }
  },
  {
    title: '단가',
    width: 80,
    dataIndex: 'mtOrderInputPrice',
    key: 'mtOrderInputPrice',
    align: 'center',
    inputType: 'number',
    cellAlign: 'right',
    render: (value:number) => {
      return value.toLocaleString();
    }
  },
  {
    title: '금액',
    width: 80,
    dataIndex: 'mtOrderAmount',
    key: 'mtOrderAmount',
    align: 'center',
    inputType: 'number',
    cellAlign: 'right',
    render: (value:number) => {
      return value.toLocaleString();
    }
  },
  {
    title: '삭제',
    width: 50,
    dataIndex: 'materialIdx',
    key: 'materialIdx',
    align: 'center',
    editable: false,
    render: (_, __, index:number) => (
      <div
        className="w-full h-full v-h-center cursor-pointer ml-5"
        onClick={()=>handleDeleteMt(index)}
      >
        <p className="w-16 h-16 text-[red]"><Trash /></p>
      </div>
    )
  },
]