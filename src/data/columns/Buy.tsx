import { CustomColumn } from "@/components/List/AntdTableEdit";
import { partnerMngRType, partnerRType } from "../type/base/partner";
import { buyCostOutType } from "../type/buy/cost";
import { LayerEm, ModelTypeEm } from "../type/enum";
import FullChip from "@/components/Chip/FullChip";
import { SetStateAction } from "react";
import { Radio } from "antd";
import { processVendorPriceRType } from "../type/base/process";

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
    title: '제품모델명',
    minWidth: 150,
    dataIndex: 'specModel.prdNm',
    key: 'specModel.prdNm',
    align: 'center',
    cellAlign: 'left',
  },
  {
    title: '비용등록',
    width: 100,
    dataIndex: 'priceUnitChkYn',
    key: 'priceUnitChkYn',
    align: 'center',
    render: (value:0 | 1, record:buyCostOutType) => (
      <div className="w-full h-full v-h-center">
        {
          value === 0 ? <FullChip state="yellow" label="등록전" click={()=>{
            setOpen(true);
            setSelect(record);
          }}/> :
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
  selectPrice: {id:string, value:number}[],
  setSelectPrice: React.Dispatch<SetStateAction<{id:string, value:number}[]>>,
): CustomColumn[] => [
  {
    title: '선택',
    width: 50,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value:string, record:processVendorPriceRType)=>(
      <input
        type="radio"
        name={record.process.id} value={value}
        onChange={()=>{
          setSelectPrice([...selectPrice.filter(f=>f.id !== record.id), {id: record.id, value:record.priceUnit}])
        }}
      />
    )
  },
  {
    title: '단가명',
    width: 100,
    dataIndex: 'priceNm',
    key: 'priceNm',
    align: 'center',
    cellAlign: 'left',
  },
  {
    title: '층',
    width: 40,
    dataIndex: 'layerEm',
    key: 'layerEm',
    align: 'center',
    render: (value:LayerEm) => {
      return value.replace("L", "");
    }
  },
  {
    title: '구분',
    width: 50,
    dataIndex: 'modelTypeEm',
    key: 'modelTypeEm',
    align: 'center',
    render: (value:ModelTypeEm) => {
      return value === "sample" ? "샘플" : "양산";
    }
  },
  {
    title: '단가',
    width: 80,
    dataIndex: 'priceUnit',
    key: 'priceUnit',
    align: 'center',
    cellAlign: 'right',
    render: (value:number) => {
      return value.toLocaleString();
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
    title: '재질',
    width: 80,
    dataIndex: 'matCd',
    key: 'matCd',
    align: 'center',
  },
  {
    title: '금속재질',
    width: 80,
    dataIndex: 'metCd',
    key: 'metCd',
    align: 'center',
  },
  {
    title: '무게',
    width: 100,
    dataIndex: 'wgtMin/wgtMax',
    key: 'wgtMin/wgtMax',
    align: 'center',
    render: (_, record:processVendorPriceRType) => (
      <div className="v-h-center">{record?.wgtMin} ~ {record?.wgtMax}</div>
    )
  },
  {
    title: '수량',
    width: 100,
    dataIndex: 'cntMin/cntMax',
    key: 'cntMin/cntMax',
    align: 'center',
    render: (_, record:processVendorPriceRType) => (
      <div className="v-h-center">{record?.cntMin} ~ {record?.cntMax}</div>
    )
  },
  {
    title: '판넬수량',
    width: 100,
    dataIndex: 'pnlcntMin/pnlcntMax',
    key: 'pnlcntMin/pnlcntMax',
    align: 'center',
    render: (_, record:processVendorPriceRType) => (
      <div className="v-h-center">{record?.pnlcntMin} ~ {record?.pnlcntMax}</div>
    )
  },
  {
    title: '홀수량',
    width: 100,
    dataIndex: 'holecntMin/holecntMax',
    key: 'holecntMin/holecntMax',
    align: 'center',
    render: (_, record:processVendorPriceRType) => (
      <div className="v-h-center">{record?.holecntMin} ~ {record?.holecntMax}</div>
    )
  },
  {
    title: 'M2',
    width: 100,
    dataIndex: 'm2Min/m2Max',
    key: 'm2Min/m2Max',
    align: 'center',
    render: (_, record:processVendorPriceRType) => (
      <div className="v-h-center">{record?.m2Min} ~ {record?.m2Max}</div>
    )
  },
]

export const BuyCostOutStatusClmn = (
  totalData: number,
  pagination: {current: number, size: number},
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
    title: '제품모델명',
    minWidth: 150,
    dataIndex: 'specModel.prdNm',
    key: 'specModel.prdNm',
    align: 'center',
    cellAlign: 'left',
  },
  {
    title: '비용등록',
    width: 100,
    dataIndex: 'priceUnitChkYn',
    key: 'priceUnitChkYn',
    align: 'center',
    render: (value:0 | 1, record:buyCostOutType) => (
      <div className="w-full h-full v-h-center">
        {
          value === 0 ? <FullChip state="yellow" label="등록전" /> :
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