import { CustomColumn } from "@/components/List/AntdTableEdit";
import { HotGrade, LayerEm, ModelStatus } from "../type/enum";
import { wkPlanWaitType, wkProcsType } from "../type/wk/plan";
import FullChip from "@/components/Chip/FullChip";
import { partnerRType } from "../type/base/partner";
import { Checkbox, Progress } from "antd";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import { SetStateAction } from "react";
import { processVendorRType } from "../type/base/process";
import dayjs, { Dayjs } from "dayjs";
import cookie from "cookiejs";
import { NextRouter } from "next/router";
import GlobalMemo from "@/contents/globalMemo/GlobalMemo";
import AntdSelect from "@/components/Select/AntdSelect";


export const WkPalnWaitClmn = (
  totalData: number,
  pagination: {current: number, size: number},
  handleSubmit: (id:string, value:string) => void,
  router?: NextRouter,
): CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    leftPin: true,
    render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
    editable: false,
  },
  {
    title: '모델명',
    minWidth: 170,
    dataIndex: 'specModel.prdNm',
    key: 'specModel.prdNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
    render: (_, record) => (
      <div
        className={`w-full text-left ${cookie.get('company') === 'sy' ? 'cursor-pointer transition--colors duration-300 hover:text-point1 hover:underline hover:decoration-blue-500' : ''}`}
        onClick={()=>{
          if(cookie.get('company') === 'sy') {
            router?.push(`/wk/plan/${record?.id}`);
          }
        }}
      >
        {record?.specModel?.prdNm}
      </div>
    )
  },
  {
    title: '생산예정일',
    width: 150,
    dataIndex: 'wsExpDt',
    key: 'wsExpDt',
    align: 'center',
    editable: cookie.get('company') === 'sy' ? false : true,
    editType: 'date',
    enter: true,
    enterSubmit: (id, value)=>handleSubmit(id, value),
  },
  {
    title: '생산량',
    width: 80,
    dataIndex: 'wkPrdCnt',
    key: 'wkPrdCnt',
    align: 'center',
    editable: false,
    render: (value) => (
      <div className="h-center justify-end">
        {(value ?? 0).toLocaleString()}
      </div>
    )
  },
  {
    title: '외주처공정수',
    width: 100,
    dataIndex: 'wkProcCnt',
    key: 'wkProcCnt',
    align: 'center',
    editable: false,
  },
  {
    title: '재질',
    width: 100,
    dataIndex: 'specModel.material.cdNm',
    key: 'specModel.material.cdNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: '원판',
    width: 100,
    dataIndex: 'specModel.board.brdType',
    key: 'specModel.board.brdType',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: '층',
    width: 60,
    dataIndex: 'specModel.layerEm',
    key: 'specModel.layerEm',
    align: 'center',
    editable: false,
    render: (_, record) => (
      <div>{record?.specModel?.layerEm?.replace("L", "")}</div>
    )
  },
  {
    title: '두께',
    width: 60,
    dataIndex: 'specModel.thk',
    key: 'specModel.thk',
    align: 'center',
    editable: false,
  },
  {
    title: cookie.get('company') === 'sy' ? '제품 W * 제품 H' : 'PCS W * PCS H',
    width: 130,
    dataIndex: 'specModel.pcsW*specModel.pcsL',
    key: 'specModel.pcsW*specModel.pcsL',
    align: 'center',
    cellAlign: 'right',
    editable: false,
    render: (_, record) => (
      <div className="w-full h-full v-h-center">
        {
          (record?.specModel?.pcsW || record?.specModel?.pcsL) ?
          (record?.specModel?.pcsW ?? "")+" * "+(record?.specModel?.pcsL ?? "") :
          ""
        }
      </div>
    )
  },
  {
    title: 'KIT W * KIT H',
    width: 130,
    dataIndex: 'specModel.kitW*specModel.kitL',
    key: 'specModel.kitW*specModel.kitL',
    align: 'center',
    cellAlign: 'right',
    editable: false,
    render: (_, record) => (
      <div className="w-full h-full v-h-center">
        {
          (record?.specModel?.kitW || record?.specModel?.kitL) ?
          (record?.specModel?.kitW ?? "")+" * "+(record?.specModel?.kitL ?? "") :
          ""
        }
      </div>
    )
  },
  {
    title: '재단 W * 재단 H',
    width: 130,
    dataIndex: 'specModel.pnlW*specModel.pnlL',
    key: 'specModel.pnlW*specModel.pnlL',
    align: 'center',
    cellAlign: 'right',
    editable: false,
    render: (_, record) => (
      <div className="w-full h-full v-h-center">
        {
          (record?.specModel?.pnlW || record?.specModel?.pnlL) ?
          (record?.specModel?.pnlW ?? "")+" * "+(record?.specModel?.pnlL ?? "") :
          ""
        }
      </div>
    )
  },
  {
    title: 'M/K색상',
    width: 130,
    dataIndex: 'specModel.mkColor.cdNm',
    key: 'specModel.mkColor.cdNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: 'M/K잉크',
    width: 180,
    dataIndex: 'specModel.mkType.cdNm',
    key: 'specModel.mkType.cdNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: 'M/K인쇄',
    width: 130,
    dataIndex: 'specModel.mkPrint.cdNm',
    key: 'specModel.mkPrint.cdNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: 'S/M색상',
    width: 130,
    dataIndex: 'specModel.smColor.cdNm',
    key: 'specModel.smColor.cdNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: 'S/M잉크',
    width: 180,
    dataIndex: 'specModel.smType.cdNm',
    key: 'specModel.smType.cdNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: 'S/M인쇄',
    width: 130,
    dataIndex: 'specModel.smPrint.cdNm',
    key: 'specModel.smPrint.cdNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
  },
  {
    title: '판넬수',
    width: 100,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
    editable: false,
    render: (_, record) => (
      <div className="h-center justify-end">
        {(record?.specModel?.prdCnt ?? 0).toLocaleString()}
      </div>
    )
  },
  {
    title: '소요',
    width: 150,
    dataIndex: 'wkLatestDtm',
    key: 'wkLatestDtm',
    align: 'center',
    editable: false,
    render: (value:Dayjs) => (
      <div>
        {value ? dayjs(value).format("YYYY-MM-DD HH:mm") : ""}
      </div>
    )
  },
  {
    title: 'M2',
    width: 100,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
    editable: false,
  },
  {
    title: '투입량',
    width: 100,
    dataIndex: 'wkOutCnt',
    key: 'wkOutCnt',
    align: 'center',
    editable: false,
  },
  {
    title: 'Pcs/Kit',
    width: 100,
    dataIndex: 'specModel.kitPcs',
    key: 'specModel.kitPcs',
    align: 'center',
    editable: false,
  },
  {
    title: 'Kit/Pnl',
    width: 100,
    dataIndex: 'specModel.pnlKit',
    key: 'specModel.pnlKit',
    align: 'center',
    editable: false,
  },
  {
    title: 'Pcs/Sht',
    width: 100,
    dataIndex: 'specModel.sthPcs',
    key: 'specModel.sthPcs',
    align: 'center',
    editable: false,
  },
  {
    title: 'Pnl/Sht',
    width: 100,
    dataIndex: 'specModel.sthPnl',
    key: 'specModel.sthPnl',
    align: 'center',
    editable: false,
  },
  {
    title: '특이사항',
    width: 100,
    dataIndex: 'wsRemark',
    key: 'wsRemark',
    align: 'center',
    editable: false,
  },
  {
    title: '메모',
    width: 80,
    dataIndex: 'memo',
    key: 'memo',
    align: 'center',
    editable: false,
    rightPin: true,
    render: (_, record, index) => (
      <GlobalMemo
        key={index}
        id={record.id ?? ""}
        entityName="RnTenantCbizWorksheetEntity"
        entityRelation={{
          RnTenantCbizSalesOrderProductEntity: {
            RnTenantCbizSalesOrderEntity: true,
            RnTenantCbizModelEntity: true,
            RnTenantCbizBizPartnerMngMatchEntity: {
              RnTenantCbizBizPartnerEntity: true,
              RnTenantCbizBizPartnerManagerEntity: true
            }
          }
        }}
      />
    )
  },
]

export const WKStatusProcClmn = (
  totalData: number,
  pagination: {current: number, size: number},
  setPartnerData: React.Dispatch<React.SetStateAction<partnerRType | null>>,
  setSelect?: React.Dispatch<React.SetStateAction<wkPlanWaitType | null>>,
  checkeds?: wkPlanWaitType[],
  setCheckeds?: React.Dispatch<SetStateAction<wkPlanWaitType[]>>,
  handleCheckedAllClick?: () => void,
  router?: NextRouter,
): CustomColumn[] => [
  {
    title: <div>
      <Checkbox onChange={handleCheckedAllClick} checked={totalData > 0 && checkeds?.length === totalData}/>
    </div>,
    width: 50,
    dataIndex: 'check',
    key: 'check',
    align: 'center',
    leftPin: true,
    render: (_: any, record: wkPlanWaitType) => (
      <Checkbox
        checked={(checkeds ?? []).filter(f=>f.id === record.id).length > 0}
        onChange={(e)=>{
          const { checked } = e.target;
          console.log(checked);
          if(checked) {
            setCheckeds?.([ 
              ...(checkeds ?? []),
              { ...record }
            ]);
          } else {
            setCheckeds?.((checkeds ?? []).filter(f=>f.id !== record.id));
          }
        }}
      />
    )
  },
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
  },
  {
    title: '긴급',
    width: 60,
    dataIndex: 'orderProduct.order.hotGrade',
    key: 'orderProduct.order.hotGrade',
    align: 'center',
    render: (_, record:wkPlanWaitType) => (
      <div className="w-full h-full v-h-center">
      {
        record?.orderProduct?.order?.hotGrade === HotGrade.SUPER_URGENT ?
          <FullChip state="purple" label="초긴급"/> :
        record?.orderProduct?.order?.hotGrade === HotGrade.URGENT ?
          <FullChip state="pink" label="긴급"/> : <></>
      }
      </div>
    )
  },
  {
    title: '재투입',
    width: 60,
    dataIndex: 'rein',
    key: 'rein',
    align: 'center',
  },
  {
    title: '반복',
    width: 60,
    dataIndex: 'specModel.modelMatch.modelStatus',
    key: 'specModel.modelMatch.modelStatus',
    align: 'center',
    render: (_, record:wkPlanWaitType) => (
      <div className="w-full h-full v-h-center">
      {
        record.specModel?.modelMatch?.modelStatus === ModelStatus.REPEAT &&
          <FullChip state="mint" label="반복"/>
      }
      </div>
    )
  },
  {
    title: '관리모델',
    width: 100,
    dataIndex: 'specModel.fpNo',
    key: 'specModel.fpNo',
    align: 'center',
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'specModel.partner.prtRegCd/specModel.partner.prtNm',
    key: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:wkPlanWaitType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record?.specModel?.partner ?? null);
        }}
      >
        <FullChip label={record.specModel?.partner?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record.specModel?.partner?.prtNm}
      </div>
    )
  },
  {
    title: '모델명',
    minWidth: 180,
    dataIndex: 'specModel.prdNm',
    key: 'specModel.prdNm',
    align: 'center',
    cellAlign: 'left',
    tooltip: "모델명을 클릭하면 공정 진행 현황을 작성할 수 있어요",
    render: (_, record:wkPlanWaitType) => (
      <div
        className="w-full h-center cursor-pointer text-left transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=>{
          if(cookie.get('company') !== 'sy') {
            setSelect?.(record);
          } else {
            router?.push(`/wk/plan/${record.id}`);
          }
        }}
      >
        {record.specModel?.prdNm}
      </div>
    )
  },
  {
    title: cookie.get('company') === 'sy'? '시작일' :'투입일',
    width: 100,
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
    title: '현공정',
    width: 100,
    dataIndex: 'wkLatestProc.specPrdGrp.process.prcNm',
    key: 'wkLatestProc.specPrdGrp.process.prcNm',
    align: 'center',
  },
  {
    title: '현공정업체',
    width: 100,
    dataIndex: 'wkLatestProc.vendor.prtNm',
    key: 'wkLatestProc.vendor.prtNm',
    align: 'center',
  },
  {
    title: '공정진행 최종 비고',
    width: 130,
    dataIndex: 'wkLatestMemo',
    key: 'wkLatestMemo',
    align: 'center',
  },
  {
    title: '현경과',
    width: 130,
    dataIndex: 'diff',
    key: 'diff',
    align: 'center',
  },
  {
    title: '영업담당',
    width: 80,
    dataIndex: 'orderProduct.order.emp.name',
    key: 'orderProduct.order.emp.name',
    align: 'center',
  },
  {
    title: '경과',
    width: 130,
    dataIndex: 'make',
    key: 'make',
    align: 'center',
  },
  {
    title: '매수',
    width: 80,
    dataIndex: 'm2',
    key: 'm2',
  },
  {
    title: '판넬',
    width: 80,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
  },
  {
    title: cookie.get('company') === 'sy'? '수주량' :'수주량(PCS)',
    width: 80,
    dataIndex: 'wkPrdCnt',
    key: 'wkPrdCnt',
    align: 'center',
  },
  {
    title: '층',
    width: 80,
    dataIndex: 'specModel.layerEm',
    key: 'specModel.layerEm',
    align: 'center',
    render: (_, record:wkPlanWaitType) => {
      return record?.specModel?.layerEm?.replace("L", "");
    }
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'specModel.thk',
    key: 'specModel.thk',
    align: 'center',
  },
  {
    title: '업데이트',
    width: 150,
    dataIndex: 'wkLatestDtm',
    key: 'wkLatestDtm',
    align: 'center',
  },
  {
    title: '진행상태',
    width: 150,
    dataIndex: 'progress',
    key: 'progress',
    align: 'center',
    render: (value:number) => (
      <ProgressBar value={value}/>
    )
  },
]

export const WkStatusProcPopClmn = (
  dataVendor: processVendorRType[],
  setProcs: React.Dispatch<SetStateAction<wkProcsType[]>>,
  handleVenderChange: (procId: string, venderId: string) => void,
): CustomColumn[] => [
  {
    title: '공정명',
    minWidth: 120,
    dataIndex: 'specPrdGrp.process.prcNm',
    key: 'specPrdGrp.process.prcNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
    render: (_, record) => (
      <div className="w-full h-center justify-left ml-10">
        {record?.specPrdGrp?.process?.prcNm}
      </div>
    )
  },
  {
    title: '공정업체',
    width: 100,
    dataIndex: 'vendor.prtNm',
    key: 'vendor.prtNm',
    align: 'center',
    cellAlign: 'left',
    editable: false,
    render: (value, record) => (
      <div>
        <AntdSelect
          options={dataVendor
            .filter(f=>f.process.id === record.specPrdGrp?.process?.id)
            .map(f=>({
              value:f.vendor.id,
              label:f.vendor.prtNm ?? ""
            }))
          }
          value={record.vendor.id}
          onChange={(e)=>{
            handleVenderChange(record.id, e+"");

            setProcs((prev) => 
              prev.map((item) => {
                if(item.id === record.id) {
                  console.log(e);
                  return {
                    ...item,
                    vendor: {
                      id: e+"",
                    }
                  }
                } else  return  item;
              })
            )
          }}
        />
      </div>
    )
  },
  {
    title: '공정 지정 시 메모',
    minWidth: 100,
    dataIndex: 'specPrdGrp.prcWkRemark',
    key: 'specPrdGrp.prcWkRemark',
    align: 'center',
    cellAlign: 'left',
    editable: false,
    render: (_, record) => (
      <div className="w-full h-center justify-left ml-10">
        {record?.specPrdGrp?.prcWkRemark}
      </div>
    )
  },
  {
    title: '인수량',
    width: 70,
    dataIndex: 'wkProcStCnt',
    key: 'wkProcStCnt',
    align: 'center',
    editType: "input",
    inputType: "number",
  },
  {
    title: '인수일',
    width: 130,
    dataIndex: 'wkProcStDtm',
    key: 'wkProcStDtm',
    align: 'center',
    editType: "date",
  },
  {
    title: '완료량',
    width: 70,
    dataIndex: 'wkProcEdCnt',
    key: 'wkProcEdCnt',
    align: 'center',
    editType: "input",
    inputType: "number",
  },
  {
    title: '완료일',
    width: 130,
    dataIndex: 'wkProcEdDtm',
    key: 'wkProcEdDtm',
    align: 'center',
    editType: "date",
  },
  {
    title: '불량',
    width: 70,
    dataIndex: 'wkProcBadCnt',
    key: 'wkProcBadCnt',
    align: 'center',
    editType: "input",
    inputType: "number",
  },
  {
    title: '메모',
    minWidth: 100,
    dataIndex: 'wkProcMemo',
    key: 'wkProcMemo',
    align: 'center',
    editType: "input",
  },
]

export const WKStatusInClmn = (
  totalData: number,
  pagination: {current: number, size: number},
  setPartnerData: React.Dispatch<React.SetStateAction<partnerRType | null>>,
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
    title: '관리모델',
    width: 100,
    dataIndex: 'specModel.fpNo',
    key: 'specModel.fpNo',
    align: 'center',
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'specModel.partner.prtRegCd/specModel.partner.prtNm',
    key: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:wkPlanWaitType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record?.specModel?.partner ?? null);
        }}
      >
        <FullChip label={record.specModel?.partner?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record.specModel?.partner?.prtNm}
      </div>
    )
  },
  {
    title: '모델명',
    minWidth: 180,
    dataIndex: 'specModel.prdNm',
    key: 'specModel.prdNm',
    align: 'center',
    cellAlign: 'left',
  },
  {
    title: '수주번호',
    width: 100,
    dataIndex: 'specModel.fpNo',
    key: 'specModel.fpNo',
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
    title: '수주량(PCS)',
    width: 120,
    dataIndex: 'wkPrdCnt',
    key: 'wkPrdCnt',
    align: 'center',
  },
  {
    title: '판넬수',
    width: 80,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
  },
  {
    title: '매수',
    width: 80,
    dataIndex: 'm2',
    key: 'm2',
  },
  {
    title: '층',
    width: 80,
    dataIndex: 'specModel.layerEm',
    key: 'specModel.layerEm',
    align: 'center',
    render: (_, record:wkPlanWaitType) => {
      return record?.specModel?.layerEm?.replace("L", "");
    }
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'specModel.thk',
    key: 'specModel.thk',
    align: 'center',
  },
  {
    title: '제품 W * 제품 H',
    width: 120,
    dataIndex: 'specModel.spec.wksizeW*specModel.spec.wksizeH',
    key: 'specModel.spec.wksizeW*specModel.spec.wksizeH',
    align: 'center',
    render: (_, record:wkPlanWaitType) => (
      <div className="w-full h-full v-h-center">
      {
        record?.specModel?.spec?.wksizeW || record?.specModel?.spec?.wksizeH ? 
        (record?.specModel?.spec?.wksizeW ?? "")+" * "+(record?.specModel?.spec?.wksizeH ?? "") : ""
      }
      </div>
    )
  },
  {
    title: '판넬 W * 판넬 H',
    width: 120,
    dataIndex: 'specModel.spec.stdW*specModel.spec.stdH',
    key: 'specModel.spec.stdW*specModel.spec.stdH',
    align: 'center',
    render: (_, record:wkPlanWaitType) => (
      <div className="w-full h-full v-h-center">
      {
        record?.specModel?.spec?.stdW || record?.specModel?.spec?.stdH ? 
        (record?.specModel?.spec?.stdW ?? "")+" * "+(record?.specModel?.spec?.stdH ?? "") : ""
      }
      </div>
    )
  },
]



export const WkStatusOutClmn = (
  totalData: number,
  pagination: {current: number, size: number},
  setPartnerData: React.Dispatch<React.SetStateAction<partnerRType | null>>,
  checkeds: wkPlanWaitType[],
  setCheckeds: React.Dispatch<SetStateAction<wkPlanWaitType[]>>,
  handleCheckedAllClick: () => void,
): CustomColumn[] => [
  {
    title: <div>
      <Checkbox onChange={handleCheckedAllClick} checked={totalData > 0 && checkeds.length === totalData}/>
    </div>,
    width: 50,
    dataIndex: 'check',
    key: 'check',
    align: 'center',
    leftPin: true,
    render: (_: any, record: wkPlanWaitType) => (
      <Checkbox
        checked={checkeds.filter(f=>f.id === record.id).length > 0}
        onChange={(e)=>{
          const { checked } = e.target;
          console.log(checked);
          if(checked) {
            setCheckeds([ 
              ...checkeds,
              { ...record }
            ]);
          } else {
            setCheckeds(checkeds.filter(f=>f.id !== record.id));
          }
        }}
      />
    )
  },
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
    title: '출고일',
    width: 100,
    dataIndex: 'wkOutDt',
    key: 'wkOutDt',
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
    title: '코드/업체명',
    width: 180,
    dataIndex: 'specModel.partner.prtRegCd/specModel.partner.prtNm',
    key: 'prtInfo.prt.prtRegCd/prtInfo.prt.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:wkPlanWaitType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record?.specModel?.partner ?? null);
        }}
      >
        <FullChip label={record.specModel?.partner?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record.specModel?.partner?.prtNm}
      </div>
    )
  },
  {
    title: '모델명',
    minWidth: 180,
    dataIndex: 'specModel.prdNm',
    key: 'specModel.prdNm',
    align: 'center',
    cellAlign: 'left',
  },
  {
    title: '수주번호',
    width: 100,
    dataIndex: 'specModel.fpNo',
    key: 'specModel.fpNo',
    align: 'center',
  },
  {
    title: '수주일',
    width: 100,
    dataIndex: 'orderProduct.orderDt',
    key: 'orderProduct.orderDt',
    align: 'center',
  },
  {
    title: '수주량',
    width: 120,
    dataIndex: 'wkPrdCnt',
    key: 'wkPrdCnt',
    align: 'center',
  },
  {
    title: '판넬수',
    width: 80,
    dataIndex: 'specModel.prdCnt',
    key: 'specModel.prdCnt',
    align: 'center',
  },
  {
    title: '매수',
    width: 80,
    dataIndex: 'm2',
    key: 'm2',
  },
  {
    title: '층',
    width: 80,
    dataIndex: 'specModel.layerEm',
    key: 'specModel.layerEm',
    align: 'center',
    render: (_, record:wkPlanWaitType) => {
      return record?.specModel?.layerEm?.replace("L", "");
    }
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'specModel.thk',
    key: 'specModel.thk',
    align: 'center',
  },
  {
    title: '제품 W * 제품 H',
    width: 120,
    dataIndex: 'specModel.spec.wksizeW*specModel.spec.wksizeH',
    key: 'specModel.spec.wksizeW*specModel.spec.wksizeH',
    align: 'center',
    render: (_, record:wkPlanWaitType) => (
      <div className="w-full h-full v-h-center">
      {
        record?.specModel?.spec?.wksizeW || record?.specModel?.spec?.wksizeH ? 
        (record?.specModel?.spec?.wksizeW ?? "")+" * "+(record?.specModel?.spec?.wksizeH ?? "") : ""
      }
      </div>
    )
  },
  {
    title: '판넬 W * 판넬 H',
    width: 120,
    dataIndex: 'specModel.spec.stdW*specModel.spec.stdH',
    key: 'specModel.spec.stdW*specModel.spec.stdH',
    align: 'center',
    render: (_, record:wkPlanWaitType) => (
      <div className="w-full h-full v-h-center">
      {
        record?.specModel?.spec?.stdW || record?.specModel?.spec?.stdH ? 
        (record?.specModel?.spec?.stdW ?? "")+" * "+(record?.specModel?.spec?.stdH ?? "") : ""
      }
      </div>
    )
  },
]