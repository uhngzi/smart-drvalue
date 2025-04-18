import dayjs from 'dayjs';
import { Checkbox, Tooltip } from 'antd';
import { NextRouter } from 'next/router';
import { SetStateAction } from 'react';
import { TableProps } from 'antd/es/table';

import Edit from '@/assets/svg/icons/memo.svg';
import Trash from "@/assets/svg/icons/trash.svg";

import FullChip from '@/components/Chip/FullChip';
import AntdSelectFill from '@/components/Select/AntdSelectFill';
import AntdInputFill from '@/components/Input/AntdInputFill';
import { CustomColumn } from '@/components/List/AntdTableEdit';

import { salesOrderRType } from '../type/sales/order';
import { modelsMatchRType, modelsType } from '../type/sayang/models';
import { selectType } from '../type/componentStyles';
import { partnerMngRType, partnerRType } from '../type/base/partner';
import { specModelType, specType } from '../type/sayang/sample';
import { FinalGlbStatus, generateFloorOptions, HotGrade, LayerEm, ModelStatus, ModelTypeEm, SalesOrderStatus } from '../type/enum';
import { CloseOutlined } from '@ant-design/icons';
import AutoHideTooltip from '@/components/Tooltip/AntdHideTooltip';
import CustomAutoCompleteLabel from '@/components/AutoComplete/CustomAutoCompleteLabel';
import cookie from 'cookiejs';
import GlobalMemo from '@/contents/globalMemo/GlobalMemo';

export const specStatusClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
  pagination?: {current: number, size: number},
  router?: NextRouter,
): CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    leftPin: true,
    render: (_,__,index: number) => pagination ? totalData - ((pagination.current - 1) * pagination.size + index) : totalData - index, // 역순 번호 매기기
  },
  {
    title: '관리No',
    width: 120,
    dataIndex: 'specNo',
    key: 'specNo',
    align: 'center',
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'specModels.partner.prtRegCd/specModels.partner.prtNm',
    key: 'specModels.partner.prtRegCd/specModels.partner.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:specType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record.specModels?.[0]?.partner ?? null);
          setPartnerMngData(null);
        }}
      >
        <FullChip label={record?.specModels?.[0]?.partner?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record?.specModels?.[0]?.partner?.prtNm}
      </div>
    )
  },
  {
    title: '모델명',
    width: 350,
    dataIndex: 'specModels.prdNm',
    key: 'specModels.prdNm',
    align: 'center',
    cellAlign: 'left',
    render: (_, record:specType) => (
      <div
        className="w-full h-full h-center cursor-pointer"
        onClick={()=>{
          router?.push({pathname:`/sayang/sample/detail/${record.id}`, query: {view:true}})
        }}
      >
        {record.specModels?.[0]?.prdNm}
      </div>
    )
  },
  {
    title: '모델수',
    width: 70,
    dataIndex: 'modelCnt',
    key: 'modelCnt',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.length;
    }
  },
  {
    title: 'Rev',
    width: 100,
    dataIndex: 'specModels.prdRevNo',
    key: 'specModels.prdRevNo',
    align: 'center',
    render: (_, record:specType) => (
      <div className="w-full h-full h-center">
        {record.specModels?.[0]?.prdRevNo}
      </div>
    )
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'specModels.modelMatch',
    key: 'specModels.modelMatch',
    align: 'center',
    render: (_, record:specType) => (
      <div className="v-h-center">
        {record.specModels?.[0]?.modelMatch?.orderModel.orderPrdHotGrade === HotGrade.SUPER_URGENT ? (
          <FullChip label="초긴급" state="purple"/>
        ) : record.specModels?.[0]?.modelMatch?.orderModel.orderPrdHotGrade === HotGrade.URGENT ? (
          <FullChip label="긴급" state="pink" />
        ) : (
          <FullChip label="일반" />
        )}
      </div>
    ),
  },
  {
    title: '구분',
    width: 80,
    dataIndex: 'specModels.modelStatus',
    key: 'specModels.modelStatus',
    align: 'center',
    render: (_, record:specType) => (
      <div className="v-h-center">
        {record.specModels?.[0]?.modelMatch?.orderModel.modelStatus === ModelStatus.NEW ? (
          <FullChip label="신규" />
        ) : record.specModels?.[0]?.modelMatch?.orderModel.modelStatus === ModelStatus.MODIFY ? (
          <FullChip label="수정" state="yellow" />
        ) : (
          <FullChip label="반복" state="mint"/>
        )}
      </div>
    ),
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'specModels.thk',
    key: 'specModels.thk',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0]?.thk;
    }
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'specModels.layerEm',
    key: 'specModels.layerEm',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0]?.layerEm?.replace("L", "");
    }
  },
  {
    title: 'PCS',
    width: 100,
    dataIndex: 'specModels.pcsW',
    key: 'specModels.pcsW',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0]?.pcsL+'/'+record.specModels?.[0]?.pcsW;
    }
  },
  {
    title: '납기일',
    width: 150,
    dataIndex: 'specModels.orderPrdDueDt',
    key: 'specModels.orderPrdDueDt',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0]?.modelMatch?.orderModel.orderPrdDueDt ?
        dayjs(record.specModels?.[0]?.modelMatch?.orderModel.orderPrdDueDt).format('YYYY-MM-DD')
        : null ;
    }
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'specModels.order.orderDt',
    key: 'specModels.order.orderDt',
    align: 'center',
    render: (_, record:specType) => {
      return dayjs(record.specModels?.[0]?.modelMatch?.orderModel.orderDt).format('YYYY-MM-DD');
    }
  },
  // {
  //   title: '사양등록',
  //   width: 100,
  //   dataIndex: 'id',
  //   key: 'id',
  //   align: 'center',
  //   render: (_,record: specType) => (
  //     <div className="w-full h-full v-h-center">
  //       {record.}
  //     </div>
  //   )
  // },
  {
    title: '메모',
    width: 80,
    dataIndex: 'memo',
    key: 'memo',
    align: 'center',
    rightPin: true,
    render: (_, record, index) => (
      <GlobalMemo
        key={index}
        id={record.id ?? ""}
        entityName="RnTenantCbizSpecEntity"
      />
    )
  },
]
export const specIngClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
  router?: NextRouter,
): CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    leftPin: true,
    render: (_,__,index: number) => totalData - index, // 역순 번호 매기기
  },
  {
    title: '관리No',
    width: 120,
    dataIndex: 'specNo',
    key: 'specNo',
    align: 'center',
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'prtNm',
    key: 'prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:specType) => (
      <div className="w-full h-center text-left cursor-pointer gap-5"
        onClick={()=>{
          setPartnerData(record.specModels?.[0]?.partner ?? null);
          setPartnerMngData(null);
        }}
      >
        <FullChip label={record?.specModels?.[0]?.partner?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record?.specModels?.[0]?.partner?.prtNm}
      </div>
    )
  },
  {
    title: '모델명',
    width: 350,
    dataIndex: 'specModels.prdNm',
    key: 'specModels.prdNm',
    align: 'center',
    cellAlign: 'left',
    tooltip: "모델명을 클릭하면 수정하거나 상세 정보를 볼 수 있어요",
    render: (_, record:specType) => (
      <div className="w-full h-center cursor-pointer justify-left transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=>{
          router?.push(`/sayang/sample/detail/${record.id}`);
        }}
      >
        {record.specModels?.[0]?.prdNm}
      </div>
    )
  },
  {
    title: '모델수',
    width: 70,
    dataIndex: 'modelCnt',
    key: 'modelCnt',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.length;
    }
  },
  {
    title: 'Rev',
    width: 100,
    dataIndex: 'specModels.prdRevNo',
    key: 'specModels.prdRevNo',
    align: 'center',
    render: (_, record:specType) => (
      <div className="w-full h-full h-center">
        {record.specModels?.[0]?.prdRevNo}
      </div>
    )
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'specModels.modelMatch',
    key: 'specModels.modelMatch',
    align: 'center',
    render: (_, record:specType) => (
      <div className="v-h-center">
        {record.specModels?.[0]?.modelMatch?.orderModel.orderPrdHotGrade === HotGrade.SUPER_URGENT ? (
          <FullChip label="초긴급" state="purple"/>
        ) : record.specModels?.[0]?.modelMatch?.orderModel.orderPrdHotGrade === HotGrade.URGENT ? (
          <FullChip label="긴급" state="pink" />
        ) : (
          <FullChip label="일반" />
        )}
      </div>
    ),
  },
  {
    title: '구분',
    width: 80,
    dataIndex: 'specModels.modelStatus',
    key: 'specModels.modelStatus',
    align: 'center',
    render: (_, record:specType) => (
      <div className="v-h-center">
        {record.specModels?.[0]?.modelMatch?.orderModel.modelStatus === ModelStatus.NEW ? (
          <FullChip label="신규" />
        ) : record.specModels?.[0]?.modelMatch?.orderModel.modelStatus === ModelStatus.MODIFY ? (
          <FullChip label="수정" state="yellow" />
        ) : (
          <FullChip label="반복" state="mint"/>
        )}
      </div>
    ),
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'specModels.thk',
    key: 'specModels.thk',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0]?.thk;
    }
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'specModels.layerEm',
    key: 'specModels.layerEm',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0]?.layerEm?.replace("L", "");
    }
  },
  {
    title: cookie.get('company') === 'sy' ? '제품 SIZE' : 'PCS',
    width: 100,
    dataIndex: 'specModels.pcsW',
    key: 'specModels.pcsW',
    align: 'center',
    render: (_, record:specType) => {
      return (record.specModels?.[0]?.pcsL ?? "")+'/'+(record.specModels?.[0]?.pcsW ?? "");
    }
  },
  {
    title: '납기일',
    width: 150,
    dataIndex: 'specModels.orderPrdDueDt',
    key: 'specModels.orderPrdDueDt',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0]?.modelMatch?.orderModel.orderPrdDueDt ?
        dayjs(record.specModels?.[0]?.modelMatch?.orderModel.orderPrdDueDt).format('YYYY-MM-DD')
        : null ;
    }
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'specModels.order.orderDt',
    key: 'specModels.order.orderDt',
    align: 'center',
    render: (_, record:specType) => {
      return dayjs(record.specModels?.[0]?.modelMatch?.orderModel.orderDt).format('YYYY-MM-DD');
    }
  },
  // {
  //   title: '사양등록',
  //   width: 100,
  //   dataIndex: 'id',
  //   key: 'id',
  //   align: 'center',
  //   render: (value) => (
  //     <div className="w-full h-full v-h-center">
  //       <div 
  //         className="w-40 h-40 v-h-center cursor-pointer rounded-4 hover:bg-[#E9EDF5]" 
  //         onClick={()=>{
  //           router?.push(`/sayang/sample/detail/${value}`);
  //         }}
  //       >
  //         <p className="w-18 h-18"><Edit /></p>
  //       </div>
  //     </div>
  //   )
  // },
  {
    title: '메모',
    width: 80,
    dataIndex: 'memo',
    key: 'memo',
    align: 'center',
    rightPin: true,
    render: (_, record, index) => (
      <GlobalMemo
        key={index}
        id={record.id ?? ""}
        entityName="RnTenantCbizSpecEntity"
      />
    )
  },
]

export const sayangSampleWaitClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
  checkeds: {
    matchId: string,
    modelId: string,
    statusId: string,
    layerEm?: LayerEm,
    record: modelsMatchRType
  }[],
  setCheckeds: React.Dispatch<SetStateAction<{
    matchId: string,
    modelId: string,
    statusId: string,
    layerEm?: LayerEm,
    record: modelsMatchRType
  }[]>>,
  handleCheckedAllClick: () => void,
  handleCheckedClick: () => void,
  sayangPopOpen?: (value:string, model:string, status:string, record:modelsMatchRType) => void,
): CustomColumn[] => [
  {
    title: <div>
      <Tooltip title="클릭 시 선택한 사양들을 조합하여 등록할 수 있어요">
        <div
          className="text-11 w-full v-h-center cursor-pointer transition--colors duration-300 hover:text-point1 hover:underline hover:decoration-blue-500"
          onClick={handleCheckedClick}
        >선택한 모델 사양 등록</div>
      </Tooltip>
      <Checkbox onChange={handleCheckedAllClick} checked={totalData > 0 && checkeds.length === totalData}/>
    </div>,
    width: 65,
    dataIndex: 'check',
    key: 'check',
    align: 'center',
    leftPin: true,
    render: (_: any, record: modelsMatchRType) => (
      <Checkbox
        checked={checkeds.filter(f=>f.matchId === record.id).length > 0}
        onChange={(e)=>{
          const { checked } = e.target;
          console.log(checked);
          if(checked) {
            setCheckeds([ 
              ...checkeds,
              { matchId: record.id,
                modelId: record?.model?.id ?? "",
                statusId: record.glbStatus?.id ?? "",
                layerEm: record.tempModel?.layerEm,
                record: record
              }
            ]);
          } else {
            console.log(checkeds.filter(f=>f.matchId !== record.id));
            setCheckeds(checkeds.filter(f=>f.matchId !== record.id));
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
    render: (_: any, __: any, index: number) => totalData - index, // 역순 번호 매기기
  },
  {
    title: '관리No',
    width: 120,
    dataIndex: 'model.prdMngNo',
    key: 'model.prdMngNo',
    align: 'center',
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'orderModel.prtInfo.prt.prtRegCd/orderModel.prtInfo.prt.prtNm',
    key: 'orderModel.prtInfo.prt.prtRegCd/orderModel.prtInfo.prt.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:modelsMatchRType) => (
      <div 
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record.orderModel?.prtInfo.prt ?? null);
          setPartnerMngData(record.orderModel?.prtInfo.mng ?? null);
        }}
      >
        <FullChip label={record.orderModel?.prtInfo.prt?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
        {record.orderModel?.prtInfo.prt?.prtNm}
      </div>
    )
  },
  {
    title: '모델명',
    width: 350,
    dataIndex: 'model.prdNm',
    key: 'model.prdNm',
    align: 'center',
    cellAlign: 'left',
    tooltip: "모델명을 클릭하면 조합하거나 신규 등록을 할 수 있어요",
    render: (value, record) => (
      <div
        className="w-full h-center cursor-pointer justify-left transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=>{sayangPopOpen?.(record.id, record.model?.id ?? '', record.glbStatus?.id ?? '', record);}}
      >
        {record?.tempModel?.prdNm}
      </div>
    )
  },
  {
    title: 'Rev',
    width: 100,
    dataIndex: 'tempModel.prdRevNo',
    key: 'tempModel.prdRevNo',
    align: 'center',
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'orderModel.orderPrdHotGrade',
    key: 'orderModel.orderPrdHotGrade',
    align: 'center',
    render: (value, record:modelsMatchRType) => (
      <div className="v-h-center">
        {record.orderModel?.orderPrdHotGrade === HotGrade.SUPER_URGENT ? (
          <FullChip label="초긴급" state="purple"/>
        ) : record.orderModel?.orderPrdHotGrade === HotGrade.URGENT ? (
          <FullChip label="긴급" state="pink" />
        ) : (
          <FullChip label="일반" />
        )}
      </div>
    ),
  },
  {
    title: '구분',
    width: 80,
    dataIndex: 'orderModel.modelStatus',
    key: 'orderModel.modelStatus',
    align: 'center',
    render: (value, record:modelsMatchRType) => (
      <div className="v-h-center">
        {record.orderModel?.modelStatus === ModelStatus.NEW ? (
          <FullChip label="신규" />
        ) : record.orderModel?.modelStatus === ModelStatus.MODIFY ? (
          <FullChip label="수정" state="yellow" />
        ) : (
          <FullChip label="반복" state="mint"/>
        )}
      </div>
    ),
  },
  {
    title: '두께',
    width: 80,
    dataIndex: 'tempModel.thk',
    key: 'tempModel.thk',
    align: 'center',
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'tempModel.layerEm',
    key: 'tempModel.layerEm',
    align: 'center',
    render: (value, record:modelsMatchRType) => {
      return record.tempModel?.layerEm?.replace("L", "");
    }
  },
  {
    title: cookie.get('company') === 'sy' ? '제품 SIZE' : 'PCS',
    width: 100,
    dataIndex: 'tempModel.pcsW',
    key: 'tempModel.pcsW',
    align: 'center',
    render: (_, record:modelsMatchRType) => {
      return (record.tempModel?.pcsL??"")+'/'+(record.model?.pcsW??"");
    }
  },
  {
    title: '납기일',
    width: 150,
    dataIndex: 'orderModel.orderPrdDueDt',
    key: 'orderModel.orderPrdDueDt',
    align: 'center',
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'orderModel.order.orderDt',
    key: 'orderModel.order.orderDt',
    align: 'center',
  },
  {
    title: '메모',
    width: 80,
    dataIndex: 'memo',
    key: 'memo',
    align: 'center',
    rightPin: true,
    render: (_, record, index) => (
      <GlobalMemo
        key={index}
        id={record.id ?? ""}
        entityName="RnTenantCbizSpecEntity"
      />
    )
  },
];

const divClass = "h-35 w-[100%] h-center justify-left ";
const divTopClass = "h-[100%] flex flex-col items-start";

export const sayangSampleWaitAddClmn = (
  surfaceSelectList: selectType[],
  unitSelectList: selectType[],
  vcutSelectList: selectType[],
  outSelectList: selectType[],
  smPrintSelectList: selectType[],
  smColorSelectList: selectType[],
  smTypeSelectList: selectType[],
  mkPrintSelectList: selectType[],
  mkColorSelectList: selectType[],
  mkTypeSelectList: selectType[],
  spPrintSelectList: selectType[],
  spTypeSelectList: selectType[],
  ul1SelectList: selectType[],
  ul2SelectList: selectType[],
  ozUnitSelectList: selectType[],
  metarialSelectList: selectType[],
  handleModelDataChange: (
    id?: string,
    name?: string,
    value?: any
  ) => void,
  setDeleted: React.Dispatch<SetStateAction<specModelType | null>>,
  view: string | string[] | undefined,
  stampColorSelectList?: selectType[],
): TableProps['columns'] => [
  {
    title: 'No',
    width: 30,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value:any,record:specModelType,index:number) => (
      <>
        <div className="h-[50%] w-[100%] v-h-center ">
          <p
            className="w-16 h-16 border-1 border-[#222222] v-h-center rounded-4 cursor-pointer"
            onClick={()=>{
              setDeleted(record);
            }}
          >
            <CloseOutlined style={{color:"#222222"}}/>
          </p>
          {/* <Checkbox id={value}/> */}
        </div>
        <div className="h-[50%] w-[100%] v-h-center ">
          <p className="w-24 h-24 bg-back rounded-6 v-h-center">
            {index+1}
          </p>
        </div>
        {/* <div className="h-[33%] w-[100%] v-h-center">
          <div className="w-24 h-24 rounded-6 v-h-center border-1 border-line cursor-pointer">
            <p className="w-16 h-16"><Trash /></p>
          </div>
        </div> */}
      </>
    ),
  },
  {
    title: '관리 No',
    dataIndex: 'no',
    key: 'no',
    align: 'center',
    children: [
      {
        title:'코드/업체명',
        width: 100,
        dataIndex: 'user',
        key:'user',
        align: 'center',
        render: (_, record:specModelType) => (
          <>
            <div className="h-[50%] w-[100%] v-h-center">
              {record?.prdMngNo}
            </div>
            <div className="h-[50%] w-[100%] v-h-center gap-5">
              <FullChip label={record?.partner?.prtRegCd?.toString() ?? ""} state="line" className="!font-normal"/>
              {record?.partner?.prtNm}
            </div>
          </>
        )
      },
    ]
  },
  {
    title: 'MODEL',
    dataIndex: 'modelNm',
    key: 'modelNm',
    align: 'center',
    children: [
      {
        title:'Rev',
        width: 150,
        dataIndex: 'rev',
        key:'rev',
        align: 'center',
        render: (_, record:specModelType) => (
          <>
            <div className="h-[50%] w-[100%] h-center break-words text-left">
              {record?.prdNm}
            </div>
            <div className="h-[50%] w-[100%] h-center">
              {record?.prdRevNo}
            </div>
          </>
        )
      },
    ]
  },
  {
    title: cookie.get('company') === 'sy' ? '두께(T)' : '층',
    dataIndex: 'layer',
    key: 'layer',
    align: 'center',
    width: 55,
    render: cookie.get('company') !== 'sy' ? undefined : (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass}>
          <AntdInputFill
            value={record.thk}
            onChange={(e)=>handleModelDataChange(record.id, 'thk', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+2}
            disabled={view?true:false}
          />
        </div>
      </div>
    ),
    children: cookie.get('company') !== 'sy' ? [
      {
        title:'두께(T)',
        width: 55,
        dataIndex: 'thic_layer',
        key:'thic_layer',
        align: 'center',
        
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}>
              <AntdSelectFill
                options={generateFloorOptions()}
                value={record.layerEm}
                onChange={(e)=>handleModelDataChange(record.id, 'layerEm', e)}
                tabIndex={(record?.index ?? 1)*40+1}
                disabled={view?true:false}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.thk}
                onChange={(e)=>handleModelDataChange(record.id, 'thk', e.target.value)}
                type="number"
                tabIndex={(record?.index ?? 1)*40+2}
                disabled={view?true:false}
              />
            </div>
          </div>
        )
      },
    ] : undefined
  },
  {
    title: '동박두께',
    width: 65,
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3 gap-5"}>
          <CustomAutoCompleteLabel
            option={ozUnitSelectList}
            label={record?.copOut?.toString()}
            onInputChange={(value) => {
              handleModelDataChange(record.id, 'copOut', value)
            }}
            value={record?.copOutForCd}
            onChange={(value) => {
              handleModelDataChange(record.id, 'copOutForCd', value)
            }}
            inputClassName="!h-32 !rounded-2 !bg-[#F9F9FB]" className="!h-32 !rounded-2 !bg-[#F9F9FB]"
            placeholder="외층 검색 또는 입력"
            tabIndex={(record?.index ?? 1)*40+3}
            disabled={view?true:false} clear={false}
          />
        </div>
        <div className={divClass+"gap-5"}>
          <CustomAutoCompleteLabel
            option={ozUnitSelectList}
            label={record?.copIn?.toString()}
            onInputChange={(value) => {
              handleModelDataChange(record.id, 'copIn', value)
            }}
            value={record?.copInForCd}
            onChange={(value) => {
              handleModelDataChange(record.id, 'copInForCd', value)
            }}
            inputClassName="!h-32 !rounded-2 !bg-[#F9F9FB]" className="!h-32 !rounded-2 !bg-[#F9F9FB]"
            placeholder="내층 검색 또는 입력"
            tabIndex={(record?.index ?? 1)*40+4}
            disabled={view?true:false} clear={false}
          />
        </div>
      </div>
    )
  },
  {
    title: '재질',
    width: 80,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    children: [
      {
        title:'동도금',
        width: 80,
        dataIndex: 'unit',
        key:'unit',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}>
              <AntdSelectFill
                options={metarialSelectList}
                value={record.material?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'material.id', e)}
                // className="w-[60px!important]"
                styles={{pd:"0"}} dropWidth="180px"
                tabIndex={(record?.index ?? 1)*40+5}
                disabled={view?true:false}
              />
            </div>
            <div className={divClass+" gap-5"}>
              <AntdInputFill
                value={record?.pltThk ?? 25}
                onChange={(e)=>handleModelDataChange(record.id, 'pltThk', e.target.value)}
                type="number"
                tabIndex={(record?.index ?? 1)*40+6}
                disabled={view?true:false}
              />
              <div className='!min-w-20 !text-12 text-left'>μm</div>
              {/* <AntdSelectFill
                options={unitSelectList}
                value={record.unit?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'unit.id', e)}
                // className="w-[60px!important]"
                styles={{pd:"0"}}
                tabIndex={(record?.index ?? 1)*40+6}
                disabled={view?true:false}
              /> */}
            </div>
          </div>
        )
      }
    ],
  },
  {
    title: '특수도금',
    width:100,
    dataIndex: 'tDogeum',
    key: 'tDogeum',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass+" gap-5"}>
          <div className='!min-w-18 text-left text-12'>Ni</div>
          <AntdInputFill 
            value={record?.spPltNi ?? 4}
            onChange={(e)=>handleModelDataChange(record.id, 'spPltNi', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+7}
            disabled={view?true:false}
          />
              <div className='!min-w-20 !text-12 text-left'>μm</div>
          {/* <AntdInputFill 
            value={record?.spPltNiAlph}
            onChange={(e)=>handleModelDataChange(record.id, 'spPltNiAlph', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+9}
            disabled={view?true:false}
          /> */}
        </div>
        <div className={divClass+" gap-5"}>
          <div className='!min-w-18 text-left text-12'>Au</div>
          <AntdInputFill 
            value={record?.spPltAu ?? 0.03}
            onChange={(e)=>handleModelDataChange(record.id, 'spPltAu', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+8}
            disabled={view?true:false}
          />
          <div className='!min-w-20 !text-12 text-left'>μm</div>
          {/* <AntdInputFill 
            value={record?.spPltAuAlph}
            onChange={(e)=>handleModelDataChange(record.id, 'spPltAuAlph', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+10}
            disabled={view?true:false}
          /> */}
        </div>
      </div>
    )
  },
  {
    title: 'S/M',
    width:90,
    dataIndex: 'sm',
    key: 'sm',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass}>
          <AntdSelectFill 
            options={smPrintSelectList} 
            value={record?.smPrint?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'smPrint.id', e)}
            tabIndex={(record?.index ?? 1)*40+9}
            disabled={view?true:false}
          />
        </div>
        <div className={divClass}>
          <AntdSelectFill 
            options={smColorSelectList} 
            value={record?.smColor?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'smColor.id', e)}
            tabIndex={(record?.index ?? 1)*40+10}
            disabled={view?true:false}
          />
        </div>
        <div className={divClass}>
          <AntdSelectFill 
            options={smTypeSelectList} 
            value={record?.smType?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'smType.id', e)}
            tabIndex={(record?.index ?? 1)*40+11}
            disabled={view?true:false}
          />
        </div>
      </div>
    )
  },
  {
    title: 'M/K',
    width:120,
    dataIndex: 'mk',
    key: 'mk',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass}>
          <AntdSelectFill
            options={mkPrintSelectList}
            value={record?.mkPrint?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'mkPrint.id', e)}
            tabIndex={(record?.index ?? 1)*40+12}
            disabled={view?true:false}
          />
        </div>
        <div className={divClass+"mb-3"}>
          <AntdSelectFill
            options={mkColorSelectList}
            value={record?.mkColor?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'mkColor.id', e)}
            tabIndex={(record?.index ?? 1)*40+13}
            disabled={view?true:false}
          />
        </div>
        <div className={divClass}>
          <AntdSelectFill
            options={mkTypeSelectList}
            value={record?.mkType?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'mkType.id', e)}
            tabIndex={(record?.index ?? 1)*40+14}
            disabled={view?true:false}
          />
        </div>
      </div>
    )
  },
  {
    title: cookie.get('company') === 'sy'? '도장': '특수인쇄',
    width:80,
    dataIndex: 'tPrint',
    key: 'tPrint',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass}>
          <AntdSelectFill 
            options={cookie.get('company') === 'sy' ? (stampColorSelectList ?? []) : spPrintSelectList}
            value={record?.spPrint?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'spPrint.id', e)}
            placeholder={cookie.get('company') === 'sy'? "도장컬러" : "특수인쇄"}
            tabIndex={(record?.index ?? 1)*40+15}
            disabled={view?true:false}
          />
        </div>
        <div className={divClass}>
          <AntdSelectFill 
            options={spTypeSelectList}
            value={record?.spType?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'spType.id', e)}
            placeholder={cookie.get('company') === 'sy'? "도장종류" : "특수인쇄종류"}
            tabIndex={(record?.index ?? 1)*40+16}
            disabled={view?true:false}
          />
        </div>
      </div>
    )
  },
  {
    title: '표면처리',
    width:104,
    dataIndex: 'surf',
    key: 'surf',
    align: 'center',
    children: [
      {
        title:'외형가공',
        width:130,
        dataIndex: 'out',
        key: 'out',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                options={surfaceSelectList}
                value={record?.surface?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'surface.id', e)}
                tabIndex={(record?.index ?? 1)*40+17}
                disabled={view?true:false}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={outSelectList}
                value={record?.aprType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'aprType.id', e)}
                tabIndex={(record?.index ?? 1)*40+18}
                disabled={view?true:false}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record?.vcutText}
                onChange={(e)=>handleModelDataChange('vcutText', e.target.value)}
                disabled={view?true:false} tabIndex={(record?.index ?? 1)*40+19}
                placeholder={"브이컷형태 입력"}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'UL/위치',
    width:15,
    dataIndex: 'ul',
    key: 'ul',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3"}>
          <AntdInputFill
            value={record.ulTxt1}
            onChange={(e)=>handleModelDataChange(record.id, 'ulTxt1', e.target.value)}
            tabIndex={(record?.index ?? 1)*40+20} placeholder="UL"
            disabled={view?true:false}
          />
        </div>
        <div className={divClass+"mb-3"}>
          <AntdInputFill
            value={record.ulTxt2}
            onChange={(e)=>handleModelDataChange(record.id, 'ulTxt2', e.target.value)}
            tabIndex={(record?.index ?? 1)*40+21} placeholder="주기"
            disabled={view?true:false}
          />
        </div>
        <div className={divClass+"mb-3"}>
          <AntdSelectFill
            options={ul1SelectList}
            value={record.ulCd1?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'ulCd1.id', e)}
            className="w-[60px!important]"
            styles={{pd:"0"}}
            tabIndex={(record?.index ?? 1)*40+22} placeholder="위치1"
            disabled={view?true:false}
          />
        </div>
        <div className={divClass+"mb-3"}>
          <AntdSelectFill
            options={ul2SelectList}
            value={record.ulCd2?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'ulCd2.id', e)}
            className="w-[60px!important]"
            styles={{pd:"0"}}
            tabIndex={(record?.index ?? 1)*40+23} placeholder="위치2"
            disabled={view?true:false}
          />
        </div>
      </div>
    )
  },
  {
    title: '임피던스',
    width:70,
    dataIndex: 'im',
    key: 'im',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3"}>
          <AntdInputFill
            value={record?.impedanceLineCnt}
            onChange={(e)=>handleModelDataChange(record.id, 'impedanceLineCnt', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+24}
            disabled={view?true:false}
          />
        </div>
      </div>
    )
  },
  {
    title: cookie.get('company') === 'sy' ? '제품 SIZE' : 'PCS SIZE',
    width:80,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:80,
        dataIndex: 'pcsSize_xy',
        key: 'pcsSize_xy',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}>
              <AntdInputFill
                value={record?.pcsL}
                onChange={(e)=>handleModelDataChange(record.id, 'pcsL', e.target.value)}
                type="number"
                maxPoint={2}
                tabIndex={(record?.index ?? 1)*40+25}
                disabled={view?true:false}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record?.pcsW}
                onChange={(e)=>handleModelDataChange(record.id, 'pcsW', e.target.value)}
                type="number"
                maxPoint={2}
                tabIndex={(record?.index ?? 1)*40+26}
                disabled={view?true:false}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT SIZE',
    width:80,
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:80,
        dataIndex: 'kitSize_xy',
        key: 'kitSize_xy',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}>
              <AntdInputFill
                value={record?.kitW}
                onChange={(e)=>handleModelDataChange(record.id, 'kitW', e.target.value)}
                type="number"
                maxPoint={2}
                tabIndex={(record?.index ?? 1)*40+27}
                disabled={view?true:false}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record?.kitL}
                onChange={(e)=>handleModelDataChange(record.id, 'kitL', e.target.value)}
                type="number"
                maxPoint={2}
                tabIndex={(record?.index ?? 1)*40+28}
                disabled={view?true:false}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조KIT',
    width:55,
    dataIndex: 'arkit',
    key: 'arkit',
    align: 'center',
    children:[
      {
        title: '연조PNL',
        width:100,
        dataIndex: 'arpnl',
        key: 'arpnl',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record?.ykitW}
                onChange={(e)=>handleModelDataChange(record.id, 'ykitW', e.target.value)}
                type="number"
                tabIndex={(record?.index ?? 1)*40+29}
                disabled={view?true:false}
              />
              <AntdInputFill
                value={record?.ykitL}
                onChange={(e)=>handleModelDataChange(record.id, 'ykitL', e.target.value)}
                type="number"
                tabIndex={(record?.index ?? 1)*40+31}
                disabled={view?true:false}
              />
            </div>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record?.ypnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'ypnlW', e.target.value)}
                type="number"
                tabIndex={(record?.index ?? 1)*40+30}
                disabled={view?true:false}
              />
              <AntdInputFill
                value={record?.ypnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'ypnlL', e.target.value)}
                type="number"
                tabIndex={(record?.index ?? 1)*40+32}
                disabled={view?true:false}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'SPEC',
    width:110,
    dataIndex: 'spec',
    key: 'spec',
    align: 'center',
    render: (_, record:specModelType) => (
      cookie.get('company') === 'sy' ? 
      <>
        <div className={divClass+"mb-3 gap-5"}>
          <p className="text-left min-w-50 w-50 !text-12">Design Press</p>
          <AntdInputFill 
            value={record?.specLine}
            onChange={(e)=>handleModelDataChange(record.id, 'specLine', e.target.value)}
            maxPoint={3}
            type="number"
            tabIndex={(record?.index ?? 1)*40+33}
            disabled={view?true:false}
          />
          <p className="min-w-26 w-26 !text-12 !text-left">brag</p>
        </div>
        <div className={divClass+"mb-3 gap-5"}>
          <p className="text-left min-w-50 w-50 !text-12">Design Temp</p>
          <AntdInputFill 
            value={record?.specSpace}
            onChange={(e)=>handleModelDataChange(record.id, 'specSpace', e.target.value)}
            maxPoint={3}
            type="number"
            tabIndex={(record?.index ?? 1)*40+34}
            disabled={view?true:false}
          />
          <p className="min-w-26 w-26 !text-12 !text-left">℃</p>
        </div>
        <div className={divClass+"mb-3 gap-5"}>
          <p className="text-left min-w-50 w-50 !text-12">C.A.</p>
          <AntdInputFill 
            value={record?.specDr}
            onChange={(e)=>handleModelDataChange(record.id, 'specDr', e.target.value)}
            maxPoint={2}
            type="number"
            tabIndex={(record?.index ?? 1)*40+35}
            disabled={view?true:false}
          />
          <p className="min-w-26 w-26 !text-12 !text-left">㎜</p>
        </div>
        <div className={divClass+" gap-5"}>
          <p className="text-left min-w-50 w-50 !text-12">THK(S)</p>
          <AntdInputFill
            value={record?.specPad}
            onChange={(e)=>handleModelDataChange(record.id, 'specPad', e.target.value)}
            maxPoint={2}
            type="number"
            tabIndex={(record?.index ?? 1)*40+36}
            disabled={view?true:false}
          />
          <p className="min-w-26 w-26 !text-12 !text-left">t</p>
        </div>
      </>
      :
      <>
        <div className={divClass+"mb-3 gap-5"}>
          <p className="text-left min-w-37 w-37 !text-12">LINE</p>
          <AntdInputFill 
            value={record?.specLine}
            onChange={(e)=>handleModelDataChange(record.id, 'specLine', e.target.value)}
            className="w-[45px!important]"
            maxPoint={3}
            type="number"
            tabIndex={(record?.index ?? 1)*40+33}
            disabled={view?true:false}
          />
          <p className="min-w-12 w-12 !text-12">㎜</p>
        </div>
        <div className={divClass+"mb-3 gap-5"}>
          <p className="text-left min-w-37 w-37 !text-12">SPACE</p>
          <AntdInputFill 
            value={record?.specSpace}
            onChange={(e)=>handleModelDataChange(record.id, 'specSpace', e.target.value)}
            className="w-[45px!important]"
            maxPoint={3}
            type="number"
            tabIndex={(record?.index ?? 1)*40+34}
            disabled={view?true:false}
          />
          <p className="min-w-12 w-12 !text-12">㎜</p>
        </div>
        <div className={divClass+"mb-3 gap-5"}>
          <p className="text-left min-w-37 w-37 !text-12">DR</p>
          <AntdInputFill 
            value={record?.specDr}
            onChange={(e)=>handleModelDataChange(record.id, 'specDr', e.target.value)}
            className="w-[45px!important]"
            maxPoint={2}
            type="number"
            tabIndex={(record?.index ?? 1)*40+35}
            disabled={view?true:false}
          />
          <p className="min-w-12 w-12 !text-12"></p>
        </div>
        <div className={divClass+" gap-5"}>
          <p className="text-left min-w-37 w-37 !text-12">PAD</p>
          <AntdInputFill
            value={record?.specPad}
            onChange={(e)=>handleModelDataChange(record.id, 'specPad', e.target.value)}
            className="w-[45px!important]"
            maxPoint={2}
            type="number"
            tabIndex={(record?.index ?? 1)*40+36}
            disabled={view?true:false}
          />
          <p className="min-w-12 w-12 !text-12"></p>
        </div>
      </>
    )
  },
  {
    title: '수량',
    width:90,
    dataIndex: 'cnt',
    key: 'cnt',
    align: 'center',
    render: (_, record:specModelType) => (
      cookie.get('company') !== 'sy' ?
      <div className={divTopClass}>
        <AutoHideTooltip title="수주량" className="w-full">
        <div className={divClass+" !w-full !justify-end gap-5"}>
          <div className="!mr-10">{(record.modelMatch?.orderModel.orderPrdCnt ?? 0).toLocaleString()}</div>
          <div className="!min-w-25 !w-25 !text-12">
            {cookie.get('company') !== 'sy' ? 'PCS' : 'EA'}
          </div>
        </div>
        </AutoHideTooltip>
        <AutoHideTooltip title="작업량">
        <div className={divClass+" gap-5"}>
          <AntdInputFill
            value={record.prdCnt}
            onChange={(e)=>handleModelDataChange(record.id, 'prdCnt', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+37}
            disabled={view?true:false}
          />
          <div className="!min-w-25 !w-25 !text-12">PNL</div>
        </div>
        </AutoHideTooltip>
        <AutoHideTooltip title="생산량">
        <div className={divClass+" gap-5"}>
          <AntdInputFill
            value={record.pcsValue}
            onChange={(e)=>handleModelDataChange(record.id, 'pcsValue', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+38}
            disabled={view?true:false}
          />
          <div className="!min-w-25 !w-25 !text-12">PCS</div>
        </div>
        </AutoHideTooltip>
      </div>
      :
      <div className={divTopClass}>
        <div className={divClass+" gap-5"}>
          <AntdInputFill
            value={record.prdCnt}
            onChange={(e)=>handleModelDataChange(record.id, 'prdCnt', e.target.value)}
            type="number"
            tabIndex={(record?.index ?? 1)*40+38}
            disabled={view?true:false}
          />
          <div className="!min-w-25 !w-25 !text-12">EA</div>
        </div>
      </div>
    )
  },
]

export const sayangModelWaitClmn = (
  totalData: number,
  router:NextRouter,
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
): CustomColumn[] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    leftPin: true,
    render: (_: any, __: any, index: number) => totalData - index, // 역순 번호 매기기
  },
  {
    title: '코드/업체명',
    width: 180,
    dataIndex: 'prtInfo.prtRegCd/prtInfo.prt.prtNm',
    key: 'prtInfo.prtRegCd/prtInfo.prt.prtNm',
    align: 'center',
    tooltip: "코드/업체명을 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:salesOrderRType) => (
      <div
        className="w-full h-center cursor-pointer text-left text-shadow-hover gap-5"
        onClick={()=>{
          setPartnerData(record.prtInfo.prt);
          setPartnerMngData(record.prtInfo.mng);
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
    render: (value, record) => (
      <div className="w-full h-center cursor-pointer text-left transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
        onClick={()=>{router.push(`/sayang/model/wait/${record?.id}`)}}
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
        {value === HotGrade.SUPER_URGENT ? (
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
    key: 'emp.name',
    align: 'center',
  },
  {
    title: '발주접수일',
    width: 130,
    dataIndex: 'orderRepDt',
    key: 'orderRepDt',
    align: 'center',
  },
  {
    title: '발주일',
    width: 130,
    dataIndex: 'orderDt',
    key: 'orderDt',
    align: 'center',
  },
  // {
  //   title: '모델확정',
  //   width: 90,
  //   dataIndex: 'id',
  //   key: 'id',
  //   align: 'center',
  //   render: (value, record) => (
  //     <div className="w-full h-full v-h-center">
  //       <div 
  //         className="w-40 h-40 v-h-center cursor-pointer rounded-4 hover:bg-[#E9EDF5]" 
  //         onClick={()=>{router.push(`/sayang/model/wait/${value}`)}}
  //       >
  //         <p className="w-18 h-18"><Edit /></p>
  //       </div>
  //     </div>
  //     // <div className="w-full h-full v-h-center">
  //     //   { record.isDiscard ? (
  //     //     <FullChip label="폐기" />
  //     //   ) : record.finalGlbStatus === FinalGlbStatus.COMPLETED ? (
  //     //     <FullChip label="완료" />
  //     //   ): record.finalGlbStatus === FinalGlbStatus.WAITING ? (
  //     //     <FullChip label="대기" state="yellow" 
  //     //       click={()=>{
  //     //         router.push(`/sayang/model/wait/${value}`);
  //     //       }}
  //     //     />
  //     //   ) : record.finalGlbStatus === FinalGlbStatus.REGISTERING ? (
  //     //     <FullChip
  //     //       label="등록중" state="mint" 
  //     //       click={()=>{
  //     //         router.push(`/sayang/model/wait/${value}`);
  //     //       }}
  //     //     />
  //     //   ) : ( <></> )}
  //     // </div>
  //   )
  // },
]

export const sayangModelWaitAddClmn = (
  deleteModel: (id: number) => void,
  surfaceSelectList: selectType[],
  unitSelectList: selectType[],
  vcutSelectList: selectType[],
  outSelectList: selectType[],
  smPrintSelectList: selectType[],
  smColorSelectList: selectType[],
  smTypeSelectList: selectType[],
  mkPrintSelectList: selectType[],
  mkColorSelectList: selectType[],
  mkTypeSelectList: selectType[],
  spPrintSelectList: selectType[],
  spTypeSelectList: selectType[],
  ozUnitSelectList: selectType[],
  handleModelDataChange: (id:string, name:string, value:any) => void,
  newFlag: boolean,
  selectId: string | null,
): TableProps['columns'] => [
  // {
  //   title: 'Rev',
  //   dataIndex: 'rev',
  //   width: 80,
  //   key: 'rev',
  //   align: 'center',
  //   children: [
  //     {
  //       title:'납품단위',
  //       width: 80,
  //       dataIndex: 'user',
  //       key:'user',
  //       align: 'center',
  //       render: (_, record:any) => (
  //         <div className={divTopClass}>
  //           <div className={divClass}>
  //             <AntdInputFill
  //               value={record.editModel?.prdRevNo ?? record.tempPrdInfo?.prdRevNo ?? record.currPrdInfo?.prdRevNo}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.prdRevNo', e.target.value)}
  //               readonly={selectId === record.id ? !newFlag : undefined}
  //               disabled={record.completed}
  //               placeholder="REV 입력"
  //               tabIndex={record.index*40+1}
  //             />
  //           </div>
  //           <div className={divClass}>
  //             <AntdSelectFill
  //               options={unitSelectList}
  //               value={record.editModel?.unit?.id ?? record.tempPrdInfo?.unit?.id ?? record.currPrdInfo?.unit?.id ?? unitSelectList?.[0]?.value}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.unit.id', e)}
  //               disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
  //               placeholder="단위 입력"
  //               tabIndex={record.index*40+2}
  //             />
  //           </div>
  //         </div>
  //       )
  //     }
  //   ]
  // },
  // {
  //   title: '층',
  //   dataIndex: 'layer',
  //   key: 'layer',
  //   align: 'center',
  //   children: [
  //     {
  //       title:'두께(T)',
  //       width: 65,
  //       dataIndex: 'thic_layer',
  //       key:'thic_layer',
  //       align: 'center',
  //       render: (value, record) => (
  //         <div className={divTopClass}>
  //           <div className={divClass}>
  //             <AntdSelectFill
  //               options={generateFloorOptions()}
  //               value={record.editModel?.layerEm ?? record.tempPrdInfo?.layerEm ?? record.currPrdInfo?.layerEm ?? "L1"}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.layerEm', e)}
  //               disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
  //               placeholder="층 입력"
  //               tabIndex={record.index*40+3}
  //             />
  //           </div>
  //           <div className={divClass}>
  //             <AntdInputFill
  //               value={record.editModel?.thk ?? record.tempPrdInfo?.thk ?? record.currPrdInfo?.thk}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.thk', e.target.value)}
  //               type="number"
  //               readonly={selectId === record.id ? !newFlag : undefined}
  //               disabled={record.completed}
  //               placeholder="두께 입력"
  //               tabIndex={record.index*40+4}
  //             />
  //           </div>
  //         </div>
  //       )
  //     },
  //   ]
  // },
  {
    title: '동박',
    width: 75,
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    children: [
      {
        title:'외/내층',
        width: 75,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <CustomAutoCompleteLabel
                option={ozUnitSelectList}
                label={record.editModel?.copOut ?? record.tempPrdInfo?.copOut ?? record.currPrdInfo?.copOut}
                onInputChange={(value) => {
                  handleModelDataChange(record.id, 'editModel.copOut', value)
                }}
                value={record.editModel?.copOutForCd ?? record.tempPrdInfo?.copOutForCd ?? record.currPrdInfo?.copOutForCd}
                onChange={(value) => {
                  handleModelDataChange(record.id, 'editModel.copOutForCd', value)
                }}
                inputClassName="!h-32 !rounded-2 !bg-[#F9F9FB]" className="!h-32 !rounded-2 !bg-[#F9F9FB]"
                placeholder="외층 검색 또는 입력"
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                readonly={selectId === record.id ? !newFlag : undefined} clear={false} tabIndex={record.index*40+5}
              />
            </div>
            <div className={divClass+"gap-5"}>
              <CustomAutoCompleteLabel
                option={ozUnitSelectList}
                label={record?.currPrdInfo?.copIn}
                onInputChange={(value) => {
                  handleModelDataChange(record.id, 'editModel.copIn', value)
                }}
                value={record?.currPrdInfo?.copInForCd}
                onChange={(value) => {
                  handleModelDataChange(record.id, 'editModel.copInForCd', value)
                }}
                inputClassName="!h-32 !rounded-2 !bg-[#F9F9FB]" className="!h-32 !rounded-2 !bg-[#F9F9FB]"
                placeholder="내층 검색 또는 입력"
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                readonly={selectId === record.id ? !newFlag : undefined} clear={false} tabIndex={record.index*40+6}
              />
              {/* <AntdInputFill 
                value={record.editModel?.copOut ?? record.tempPrdInfo?.copOut ?? record.currPrdInfo?.copOut}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.copOut', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
                placeholder="동박외층 입력"
                tabIndex={record.index*40+5}
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.editModel?.copIn ?? record.tempPrdInfo?.copIn ?? record.currPrdInfo?.copIn}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.copIn', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
                placeholder="동박내층 입력"
                tabIndex={record.index*40+6}
              /> */}
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '동도금',
    width: 60,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    children: [
      {
        title:'',
        width: 60,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+" gap-5"}>
              <AntdInputFill
                value={record.editModel?.pltThk ?? record.tempPrdInfo?.pltThk ?? record.currPrdInfo?.pltThk ?? 25}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pltThk', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="도금 입력"
                tabIndex={record.index*40+7}
              />
              <div className='!min-w-20 !text-12 text-left'>μm</div>
            </div>
            <div className={divClass+" gap-5"}>
              <AntdInputFill 
                value={record.editModel?.pltAlph ?? record.tempPrdInfo?.pltAlph ?? record.currPrdInfo?.pltAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pltAlph', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="도금+ 입력"
                tabIndex={record.index*40+8}
              />
              <div className='!min-w-20 !text-12 text-left'>μm</div>
            </div>
            {/* <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pinCnt ?? record.tempPrdInfo?.pinCnt ?? record.currPrdInfo?.pinCnt}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pinCnt', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
                placeholder="핀 수 입력"
                tabIndex={record.index*40+9}
              />
            </div> */}
          </div>
        )
      }
    ]
  },
  {
    title: '특수도금',
    width:110,
    dataIndex: 'tDogeum',
    key: 'tDogeum',
    align: 'center',
    children: [
      {
        title:'',
        width: 90,
        dataIndex: 'tDogeum',
        key:'tDogeum',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+" gap-5"}>
              <div className='!min-w-26 !text-12 text-left'>Ni</div>
              <AntdInputFill 
                value={record.editModel?.spPltNi ?? record.tempPrdInfo?.spPltNi ?? record.currPrdInfo?.spPltNi ?? 4}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltNi', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="Ni 입력"
                tabIndex={record.index*40+10}
              />
              <div className='!min-w-20 !text-12 text-left'>μm</div>
            </div>
            <div className={divClass+" gap-5"}>
              <div className='!min-w-26 !text-12 text-left'>Au</div>
              <AntdInputFill 
                value={record.editModel?.spPltAu ?? record.tempPrdInfo?.spPltAu ?? record.currPrdInfo?.spPltAu ?? 0.03}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltAu', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="Au 입력"
                tabIndex={record.index*40+12}
              />
              <div className='!min-w-20 !text-12 text-left'>μm</div>
              {/* <AntdInputFill 
                value={record.editModel?.spPltNiAlph ?? record.tempPrdInfo?.spPltNiAlph ?? record.currPrdInfo?.spPltNiAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltNiAlph', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="Ni+ 입력"
                tabIndex={record.index*40+11}
              /> */}
              {/* <AntdInputFill 
                value={record.editModel?.spPltAuAlph ?? record.tempPrdInfo?.spPltAuAlph ?? record.currPrdInfo?.spPltAuAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltAuAlph', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
                placeholder="Au+ 입력"
                tabIndex={record.index*40+13}
              /> */}
            </div>
            <div className={divClass+" gap-5"}>
              <div className='!min-w-26 !text-12 text-left'>OSP</div>
              <AntdInputFill 
                value={record.editModel?.spPltOsp ?? record.tempPrdInfo?.spPltOsp ?? record.currPrdInfo?.spPltOsp ?? 0.2}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltOsp', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="OSP 입력"
                tabIndex={record.index*40+12}
              />
              <div className='!min-w-20 !text-12 text-left'>μm</div>
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'S/M',
    width:125,
    dataIndex: 'sm',
    key: 'sm',
    align: 'center',
    children: [
      {
        title:'',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                options={smPrintSelectList} 
                value={record.editModel?.smPrint?.id ?? record.tempPrdInfo?.smPrint?.id ?? record.currPrdInfo?.smPrint?.id ?? smPrintSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.smPrint.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="S/M인쇄 입력"
                tabIndex={record.index*40+14}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record.editModel?.smColor?.id ?? record.tempPrdInfo?.smColor?.id ?? record.currPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.smColor.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="S/M색상 입력"
                tabIndex={record.index*40+15}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record.editModel?.smType?.id ?? record.tempPrdInfo?.smType?.id ?? record.currPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.smType.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="S/M종류 입력"
                tabIndex={record.index*40+16}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'M/K',
    width:125,
    dataIndex: 'mk',
    key: 'mk',
    align: 'center',
    children: [
      {
        title:'',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill
                options={mkPrintSelectList}
                value={record.editModel?.mkPrint?.id ?? record.tempPrdInfo?.mkPrint?.id ?? record.currPrdInfo?.mkPrint?.id ?? mkPrintSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.mkPrint.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="M/K인쇄 입력"
                tabIndex={record.index*40+17}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record.editModel?.mkColor?.id ?? record.tempPrdInfo?.mkColor?.id ?? record.currPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.mkColor.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="M/K색상 입력"
                tabIndex={record.index*40+18}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record.editModel?.mkType?.id ?? record.tempPrdInfo?.mkType?.id ?? record.currPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.mkType.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="M/K종류 입력"
                tabIndex={record.index*40+19}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수인쇄',
    width:125,
    dataIndex: 'tPrint',
    key: 'tPrint',
    align: 'center',
    children: [
      {
        title:'외형가공',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                options={spPrintSelectList}
                value={record.editModel?.spPrint?.id ?? record.tempPrdInfo?.spPrint?.id ?? record.currPrdInfo?.spPrint?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPrint.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="특수인쇄 입력"
                tabIndex={record.index*40+20}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={outSelectList} 
                value={record.editModel?.aprType?.id ?? record.tempPrdInfo?.aprType?.id ?? record.currPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.aprType.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="외형가공형태 입력"
                tabIndex={record.index*40+21}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record.editModel?.vcutText ?? record.tempPrdInfo?.vcutText ?? record.currPrdInfo?.vcutText}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.vcutText', e.target.value)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                tabIndex={(record?.index ?? 1)*40+22} placeholder={"브이컷형태 입력"}
              />
            </div>
            {/* <div className={divClass}>
              <AntdSelectFill 
                options={spTypeSelectList}
                value={record.editModel?.spType?.id ?? record.tempPrdInfo?.spType?.id ?? record.currPrdInfo?.spType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spType.id', e)}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
                placeholder="특수인쇄종류 입력"
                tabIndex={record.index*40+21}
              />
            </div> */}
            {/* <div className={divClass}>
              <AntdSelectFill 
                options={[{value:ModelTypeEm.SAMPLE,label:'샘플'},{value:ModelTypeEm.PRODUCTION,label:'양산'}]}
                value={record.editModel?.modelTypeEm ?? record.tempPrdInfo?.modelTypeEm ?? record.currPrdInfo?.modelTypeEm ?? "sample"}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.modelTypeEm', e)}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
                placeholder="구분 입력"
                tabIndex={record.index*40+22}
              />
            </div> */}
          </div>
        )
      }
    ]
  },
  {
    title: '표면처리',
    width:90,
    dataIndex: 'out',
    key: 'out',
    align: 'center',
    children: [
      {
        title:'승인원 여부',
        width:90,
        dataIndex: 'vcut',
        key: 'vcut',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={surfaceSelectList}
                value={record.editModel?.surface?.id ?? record.tempPrdInfo?.surface?.id ?? record.currPrdInfo?.surface?.id ?? surfaceSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.surface.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="표면처리 입력"
                tabIndex={record.index*40+23}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={[{value:true,label:"유"},{value:false,label:"무"}]}
                value={record.editModel?.approvalYn ?? record.tempPrdInfo?.approvalYn ?? record.currPrdInfo?.approvalYn ?? true}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.approvalYn', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"승인원 여부"}
                tabIndex={record.index*40+24}
              />
            </div>
            {/* <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={vcutSelectList}
                value={record.editModel?.vcutType?.id ?? record.tempPrdInfo?.vcutType?.id ?? record.currPrdInfo?.vcutType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.vcutType.id', e)}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="브이컷형태 입력"
                tabIndex={record.index*40+24}
              />
            </div> */}
          </div>
        )
      }
    ]
  },
  // {
  //   title: '도면번호',
  //   width:100,
  //   dataIndex: 'drgNo',
  //   key: 'drgNo',
  //   align: 'center',
  //   children: [
  //     {
  //       title:'',
  //       width:100,
  //       dataIndex: 'drgNo',
  //       key: 'drgNo',
  //       align: 'center',
  //       render: (_, record) => (
  //         <div className={divTopClass}>
  //           <div className={divClass}>
  //             <AntdInputFill
  //               value={record.editModel?.drgNo ?? record.tempPrdInfo?.drgNo ?? record.currPrdInfo?.drgNo}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.drgNo', e.target.value)}
  //               className='w-[100px] !text-12'
  //               readonly={selectId === record.id ? !newFlag : undefined}
  //               disabled={record.completed}
  //               placeholder="도면번호 입력"
  //               tabIndex={record.index*40+26}
  //             />
  //           </div>
  //         </div>
  //       )
  //     }
  //   ]
  // },
  {
    title: 'PCS SIZE',
    width:70,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'pcsSize_xy',
        key: 'pcsSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pcsW ?? record.tempPrdInfo?.pcsW ?? record.currPrdInfo?.pcsW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pcsW', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="X 입력"
                tabIndex={record.index*40+25}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pcsL ?? record.tempPrdInfo?.pcsL ?? record.currPrdInfo?.pcsL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pcsL', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="Y 입력"
                tabIndex={record.index*40+26}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조KIT',
    width:70,
    dataIndex: 'arkit',
    key: 'arkit',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'arpnl',
        key: 'arpnl',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.ykitW ?? record.tempPrdInfo?.ykitW ?? record.currPrdInfo?.ykitW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ykitW', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="X 입력"
                tabIndex={record.index*40+27}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.ykitL ?? record.tempPrdInfo?.ykitL ?? record.currPrdInfo?.ykitL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ykitL', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="X 입력"
                tabIndex={record.index*40+28}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT SIZE',
    width:70,
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    children:[
      {
        title: 'PCS/KIT',
        width:70,
        dataIndex: 'kitSize_xy',
        key: 'kitSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.kitW ?? record.tempPrdInfo?.kitW ?? record.currPrdInfo?.kitW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitW', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="X 입력"
                tabIndex={record.index*40+29}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.kitL ?? record.tempPrdInfo?.kitL ?? record.currPrdInfo?.kitL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitL', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="Y 입력"
                tabIndex={record.index*40+30}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.kitPcs ?? record.tempPrdInfo?.kitPcs ?? record.currPrdInfo?.kitPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitPcs', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="PCS/KIT 입력"
                tabIndex={record.index*40+31}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'PNL SIZE',
    width:70,
    dataIndex: 'pnl',
    key: 'pnl',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'pnlSize_xy',
        key: 'pnlSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pnlW ?? record.tempPrdInfo?.pnlW ?? record.currPrdInfo?.pnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlW', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="X 입력"
                tabIndex={record.index*40+32}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pnlL ?? record.tempPrdInfo?.pnlL ?? record.currPrdInfo?.pnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlL', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="Y 입력"
                tabIndex={record.index*40+33}
              />
            </div>
          </div>
        )
      },
    ]
  },
  // {
  //   title: '연조KIT',
  //   width:55,
  //   dataIndex: 'arkit',
  //   key: 'arkit',
  //   align: 'center',
  //   children:[
  //     {
  //       title: '연조PNL',
  //       width:100,
  //       dataIndex: 'arpnl',
  //       key: 'arpnl',
  //       align: 'center',
  //       render: (value, record) => (
  //         <div className={divTopClass}>
  //           <div className={divClass+" gap-3"}>
  //             <AntdInputFill
  //               value={record.editModel?.ykitW ?? record.tempPrdInfo?.ykitW ?? record.currPrdInfo?.ykitW}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.ykitW', e.target.value)}
  //               className="!text-12"
  //               type="number"
  //               readonly={selectId === record.id ? !newFlag : undefined}
  //               disabled={record.completed}
  //               placeholder="X 입력"
  //               tabIndex={record.index*40+33}
  //             />
  //             <AntdInputFill
  //               value={record.editModel?.ypnlW ?? record.tempPrdInfo?.ypnlW ?? record.currPrdInfo?.ypnlW}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.ypnlW', e.target.value)}
  //               className="!text-12"
  //               type="number"
  //               readonly={selectId === record.id ? !newFlag : undefined}
  //               disabled={record.completed}
  //               placeholder="X 입력"
  //               tabIndex={record.index*40+35}
  //             />
  //           </div>
  //           <div className={divClass+" gap-3"}>
  //             <AntdInputFill
  //               value={record.editModel?.ykitL ?? record.tempPrdInfo?.ykitL ?? record.currPrdInfo?.ykitL}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.ykitL', e.target.value)}
  //               className="!text-12"
  //               type="number"
  //               readonly={selectId === record.id ? !newFlag : undefined}
  //               disabled={record.completed}
  //               placeholder="Y 입력"
  //               tabIndex={record.index*40+34}
  //             />
  //             <AntdInputFill
  //               value={record.editModel?.ypnlL ?? record.tempPrdInfo?.ypnlL ?? record.currPrdInfo?.ypnlL}
  //               onChange={(e)=>handleModelDataChange(record.id, 'editModel.ypnlL', e.target.value)}
  //               className="!text-12"
  //               type="number"
  //               readonly={selectId === record.id ? !newFlag : undefined}
  //               disabled={record.completed}
  //               placeholder="Y 입력"
  //               tabIndex={record.index*40+36}
  //             />
  //           </div>
  //         </div>
  //       )
  //     },
  //   ]
  // },
  {
    title: 'PNL/KIT',
    width:50,
    dataIndex: 'kitpcs',
    key: 'kitpcs',
    align: 'center',
    children:[
      {
        title: 'STH',
        width:50,
        dataIndex: 'pnlkit',
        key: 'pnlkit',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pnlKit ?? record.tempPrdInfo?.pnlKit ?? record.currPrdInfo?.pnlKit}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlKit', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="PNL/KIT 입력"
                tabIndex={record.index*40+38}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.sthPnl ?? record.tempPrdInfo?.sthPnl ?? record.currPrdInfo?.sthPnl}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.sthPnl', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="STH/PNL 입력"
                tabIndex={record.index*40+39}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.sthPcs ?? record.tempPrdInfo?.sthPcs ?? record.currPrdInfo?.sthPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.sthPcs', e.target.value)}
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder="STH/PCS 입력"
                tabIndex={record.index*40+40}
              />
            </div>
          </div>
        )
      },
    ]
  },
]

export const sayangModelStatusClmn = (
  totalData: number,
  pagination: {current: number, size: number},
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
  setModelId: React.Dispatch<SetStateAction<modelsType | null>>,
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
    title: '관리No',
    width: 130,
    dataIndex: 'prdMngNo',
    key: 'prdMngNo',
    align: 'center',
  },
  {
    title: '모델명',
    dataIndex: 'prdNm',
    key: 'prdNm',
    align: 'center',
    tooltip: "모델명을 클릭하면 상세 정보를 볼 수 있어요",
    render: (_, record:modelsType) => (
      <div
        className="text-left cursor-pointer text-shadow-hover hover:underline hover:decoration-blue-500"
        onClick={()=>{
          setModelId(record);
        }}
      >
        {record.prdNm}
      </div>
    )
  },
  {
    title: '제조사',
    width: 150,
    dataIndex: 'mnfNm',
    key: 'mnfNm',
    align: 'center',
    cellAlign: 'left',
  },
  {
    title: 'Rev',
    width: 150,
    dataIndex: 'prdRevNo',
    key: 'prdRevNo',
    align: 'center',
    cellAlign: 'left',
  },
  {
    title: '구분',
    width: 60,
    dataIndex: 'modelTypeEm',
    key: 'modelTypeEm',
    align: 'center',
    render: (value:ModelTypeEm) => {
      return value === "sample" ? "샘플" : "양산"
    }
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'layerEm',
    key: 'layerEm',
    align: 'center',
    render: (value:LayerEm) => {
      return value.replace("L", "");
    }
  },
  {
    title: '두께',
    width: 70,
    dataIndex: 'thk',
    key: 'thk',
    align: 'center',
  },
  {
    title: '단위',
    width: 100,
    dataIndex: 'unit.cdNm',
    key: 'unit.cdNm',
    align: 'center',
  },
  {
    title: '재질',
    width: 100,
    dataIndex: 'material.cdNm',
    key: 'material.cdNm',
    align: 'center',
  },
  {
    title: '동박외층/동박내층',
    width: 150,
    dataIndex: 'copOut/copIn',
    key: 'copOut/copIn',
    align: 'center',
    render: (_,record:modelsType) => {
      return record.copOut+" / "+record.copIn+"";
    }
  },
  {
    title: '도금',
    width: 70,
    dataIndex: 'pltThk',
    key: 'pltThk',
    align: 'center',
  },
  // {
  //   title: 'S/M인쇄',
  //   width: 120,
  //   dataIndex: 'smPrint.cdNm',
  //   key: 'smPrint.cdNm',
  //   align: 'center',
  // },
  // {
  //   title: 'S/M색상',
  //   width: 120,
  //   dataIndex: 'smColor.cdNm',
  //   key: 'smColor.cdNm',
  //   align: 'center',
  // },
  // {
  //   title: 'S/M종류',
  //   width: 120,
  //   dataIndex: 'smType.cdNm',
  //   key: 'smType.cdNm',
  //   align: 'center',
  // },
  {
    title: '확정일',
    width: 150,
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center',
    render: (value) => {
      return dayjs(value).format("YYYY-MM-DD HH:mm");
    }
  },
  // {
  //   title: '발주',
  //   width: 80,
  //   dataIndex: 'glbStatus.salesOrderStatus',
  //   key: 'glbStatus.salesOrderStatus',
  //   align: 'center',
  //   render: (_,record:modelsType) => (
  //     <div className="v-h-center">
  //       {record.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_COMPLETED ? (
  //         <FullChip label="완료" state="default"/>
  //       ) :
  //       record.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_DISCARDED ? (
  //         <FullChip label="폐기" />
  //       ) :
  //         record.glbStatus?.salesOrderStatus === SalesOrderStatus.MODEL_REG_REGISTERING ? (
  //         <FullChip label="대기" state="yellow" />
  //       ) : <FullChip label="등록중" state="mint" />}
  //     </div>
  //   ),
  // },
  {
    title: '메모',
    width: 80,
    dataIndex: 'memo',
    key: 'memo',
    align: 'center',
    rightPin: true,
    render: (_, record, index) => (
      <GlobalMemo
        key={index}
        id={record.id ?? ""}
        entityName="RnTenantCbizModelEntity"
        entityRelation={{
          RnTenantCbizBizPartnerEntity: true
        }}
      />
    )
  },
]