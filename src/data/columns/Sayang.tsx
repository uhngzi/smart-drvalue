import dayjs from 'dayjs';
import { Checkbox } from 'antd';
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
import { generateFloorOptions, HotGrade, LayerEm, ModelStatus, ModelTypeEm, SalesOrderStatus } from '../type/enum';

export const specStatusClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
  pagination?: {current: number, size: number},
  router?: NextRouter,
): CustomColumn[] => [
  {
    title: '대기',
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
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
    title: '업체명/코드',
    width: 120,
    dataIndex: 'prtNm',
    key: 'prtNm',
    align: 'center',
    tooltip: "업체명/코드를 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:specType) => (
      <div
        className="w-full h-center cursor-pointer jutify-left transition-shadow duration-300 shadow-none hover:shadow-md"
        // className="text-left cursor-pointer"
        onClick={()=>{
          setPartnerData(record.specModels?.[0]?.partner ?? null);
          setPartnerMngData(null);
        }}
      >
        {record?.specModels?.[0]?.partner?.prtNm}
        /
        {record?.specModels?.[0]?.partner?.prtRegCd}
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
      <div className="w-full h-full h-center">
        {record.specModels?.[0].prdNm}
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
        {record.specModels?.[0].prdRevNo}
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
      return record.specModels?.[0].thk;
    }
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'specModels.layerEm',
    key: 'specModels.layerEm',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0].layerEm?.replace("L", "");
    }
  },
  {
    title: 'PCS',
    width: 100,
    dataIndex: 'specModels.pcsW',
    key: 'specModels.pcsW',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0].pcsL+'/'+record.specModels?.[0].pcsW;
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
]
export const specIngClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
  router?: NextRouter,
): CustomColumn[] => [
  {
    title: '대기',
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
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
    title: '업체명/코드',
    width: 120,
    dataIndex: 'prtNm',
    key: 'prtNm',
    align: 'center',
    render: (_, record:specType) => (
      <div className="text-left cursor-pointer"
        onClick={()=>{
          setPartnerData(record.specModels?.[0]?.partner ?? null);
          setPartnerMngData(null);
        }}
      >
        {record?.specModels?.[0]?.partner?.prtNm}
        /
        {record?.specModels?.[0]?.partner?.prtRegCd}
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
      <div className="w-full h-full h-center">
        {record.specModels?.[0].prdNm}
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
        {record.specModels?.[0].prdRevNo}
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
      return record.specModels?.[0].thk;
    }
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'specModels.layerEm',
    key: 'specModels.layerEm',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0].layerEm?.replace("L", "");
    }
  },
  {
    title: 'PCS',
    width: 100,
    dataIndex: 'specModels.pcsW',
    key: 'specModels.pcsW',
    align: 'center',
    render: (_, record:specType) => {
      return record.specModels?.[0].pcsL+'/'+record.specModels?.[0].pcsW;
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
  {
    title: '사양등록',
    width: 100,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value) => (
      <div className="w-full h-full v-h-center">
        <div 
          className="w-40 h-40 v-h-center cursor-pointer rounded-4 hover:bg-[#E9EDF5]" 
          onClick={()=>{
            router?.push(`/sayang/sample/wait/${value}`);
          }}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
    )
  },
]

export const sayangSampleWaitClmn = (
  totalData: number,
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
  pagination?: {current: number, size: number},
  sayangPopOpen?: (value:string, model:string, status:string) => void,
): CustomColumn[] => [
  {
    title: '대기',
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (_: any, __: any, index: number) => pagination ? totalData - ((pagination.current - 1) * pagination.size + index) : totalData - index, // 역순 번호 매기기
  },
  {
    title: '관리No',
    width: 120,
    dataIndex: 'model.prdMngNo',
    key: 'model.prdMngNo',
    align: 'center',
  },
  {
    title: '업체명/코드',
    width: 120,
    dataIndex: 'orderModel.prtInfo.prt.prtNm/orderModel.prtInfo.prt.prtRegCd',
    key: 'orderModel.prtInfo.prt.prtNm/orderModel.prtInfo.prt.prtRegCd',
    align: 'center',
    tooltip: "업체명/코드를 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:modelsMatchRType) => (
      <div 
        className="w-full h-center cursor-pointer jutify-left transition-shadow duration-300 shadow-none hover:shadow-md"
        onClick={()=>{
          setPartnerData(record.orderModel?.prtInfo.prt ?? null);
          setPartnerMngData(record.orderModel?.prtInfo.mng ?? null);
        }}
      >
        {record.orderModel?.prtInfo.prt.prtNm}
        /
        {record.orderModel?.prtInfo.prt.prtRegCd}
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
  },
  {
    title: 'Rev',
    width: 100,
    dataIndex: 'model.prdRevNo',
    key: 'model.prdRevNo',
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
    dataIndex: 'model.thk',
    key: 'model.thk',
    align: 'center',
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'model.layerEm',
    key: 'model.layerEm',
    align: 'center',
    render: (value, record:modelsMatchRType) => {
      return record.model?.layerEm?.replace("L", "");
    }
  },
  {
    title: 'PCS',
    width: 100,
    dataIndex: 'model.pcsW',
    key: 'model.pcsW',
    align: 'center',
    render: (_, record:modelsMatchRType) => {
      return record.model?.pcsL+'/'+record.model?.pcsW;
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
    title: '사양등록',
    width: 100,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value, record:modelsMatchRType) => (
      <div className="w-full h-full v-h-center">
        <div 
          className="w-40 h-40 v-h-center cursor-pointer rounded-4 hover:bg-[#E9EDF5]" 
          onClick={()=>{sayangPopOpen?.(value, record.model?.id ?? '', record.glbStatus?.id ?? '');}}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
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
  handleModelDataChange: (
    id?: string,
    name?: string,
    value?: any
  ) => void,
): TableProps['columns'] => [
  {
    title: 'No',
    width: 30,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value:any,_,index:number) => (
      <>
        <div className="h-[50%] w-[100%] v-h-center ">
          <Checkbox id={value}/>
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
        title:'업체명/코드',
        width: 80,
        dataIndex: 'user',
        key:'user',
        align: 'center',
        render: (_, record:specModelType) => (
          <>
            <div className="h-[50%] w-[100%] v-h-center !text-12">
              {record?.prdMngNo}
            </div>
            <div className="h-[50%] w-[100%] v-h-center !text-12">
              {record?.partner?.prtNm+'-'+record?.partner?.prtRegCd}
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
            <div className="h-[50%] w-[100%] h-center break-words text-left !text-12">
              {record?.prdNm}
            </div>
            <div className="h-[50%] w-[100%] h-center !text-12">
              {record?.prdRevNo}
            </div>
          </>
        )
      },
    ]
  },
  {
    title: '층',
    dataIndex: 'layer',
    key: 'layer',
    align: 'center',
    children: [
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
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.thk}
                onChange={(e)=>handleModelDataChange(record.id, 'thk', e.target.value)}
                className='!text-12'
                type="number"
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '동박두께',
    width: 65,
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3 gap-5 !text-12"}>
          <AntdInputFill 
            value={record?.copOut}
            onChange={(e)=>handleModelDataChange(record.id, 'copOut', e.target.value)}
            className="!text-12" 
            type="number"
          /> 외
        </div>
        <div className={divClass+"gap-5 !text-12"}>
          <AntdInputFill 
            value={record?.copIn}
            onChange={(e)=>handleModelDataChange(record.id, 'copIn', e.target.value)}
            className="!text-12" 
            type="number"
          />내
        </div>
      </div>
    )
  },
  {
    title: '도금(㎛)',
    width: 50,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    children: [
      {
        title:'단위',
        width: 90,
        dataIndex: 'unit',
        key:'unit',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}>
              <AntdInputFill
                value={record?.pltThk}
                onChange={(e)=>handleModelDataChange(record.id, 'pltThk', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={unitSelectList}
                value={record.unit?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'unit.id', e)}
                // className="w-[60px!important]"
                styles={{pd:"0",fs:'12px'}}
              />
            </div>
            {/* <div className={divClass}>
              <AntdInputFill 
                value={record.model?.pltAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'pltAlph', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div> */}
          </div>
        )
      }
    ],
  },
  {
    title: '특수도금(㎛)',
    width:110,
    dataIndex: 'tDogeum',
    key: 'tDogeum',
    align: 'center',
    children: [
      {
        title:'Ni Au',
        width: 90,
        dataIndex: 'tDogeum',
        key:'tDogeum',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record?.spPltNi}
                onChange={(e)=>handleModelDataChange(record.id, 'spPltNi', e.target.value)}
                type="number"
                className="!text-12"
              />
              <AntdInputFill 
                value={record?.spPltNiAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'spPltNiAlph', e.target.value)}
                type="number"
                className="!text-12"
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record?.spPltAu}
                onChange={(e)=>handleModelDataChange(record.id, 'spPltAu', e.target.value)}
                type="number"
                className="!text-12"
              />
              <AntdInputFill 
                value={record?.spPltAuAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'spPltAuAlph', e.target.value)}
                type="number"
                className="!text-12"
              />
            </div>
          </div>
        )
      },
    ]
    // render: (value, record) => (
    //   <div className={divTopClass}>
    //     <div className={divClass+"mb-3 gap-5"}>
    //       <AntdSelectFill options={[{value:1,label:'Ni'}]} styles={{pd:"0", fs:'12px'}} /><AntdInputFill />
    //     </div>
    //     <div className={divClass+"gap-5"}>
    //       <AntdSelectFill options={[{value:1,label:'Au'}]} styles={{pd:"0", fs:'12px'}} /><AntdInputFill />
    //     </div>
    //   </div>
    // )
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
            className='!text-12'
            />
        </div>
        <div className={divClass+"mb-3"}>
          <AntdInputFill
            value={record.ulTxt2}
            onChange={(e)=>handleModelDataChange(record.id, 'ulTxt2', e.target.value)}
            className='!text-12'
            />
        </div>
        <div className={divClass+"gap-5"}>
          <AntdSelectFill
            options={ul1SelectList}
            value={record.ulCd1?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'ulCd1.id', e)}
            className="w-[60px!important]"
            styles={{pd:"0",fs:'12px'}}
            />
          <AntdSelectFill
            options={ul2SelectList}
            value={record.ulCd2?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'ulCd2.id', e)}
            className="w-[60px!important]"
            styles={{pd:"0",fs:'12px'}}
          />
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
    children: [
      {
        title:'',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                options={smPrintSelectList} 
                value={record?.smPrint?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'smPrint.id', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record?.smColor?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'smColor.id', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record?.smType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'smType.id', e)}
                styles={{fs:'12px'}}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'M/K',
    width:80,
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
            styles={{fs:'12px'}}
          />
        </div>
      </div>
    )
  },
  {
    title: 'M/K색상',
    width:120,
    dataIndex: 'mkC',
    key: 'mkC',
    align: 'center',
    children: [
      {
        title:'Ink',
        width:130,
        dataIndex: 'mkInk_color',
        key: 'mkInk_color',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record?.mkColor?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'mkColor.id', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record?.mkType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'mkType.id', e)}
                styles={{fs:'12px'}}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수인쇄',
    width:50,
    dataIndex: 'tPrint',
    key: 'tPrint',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass}>
          <AntdSelectFill 
            options={spPrintSelectList}
            value={record?.spPrint?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'spPrint.id', e)}
            styles={{fs:'12px'}}
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
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass}>
          <AntdSelectFill 
            options={surfaceSelectList}
            value={record?.surface?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'spPrint.id', e)}
            styles={{fs:'12px'}}
          />
        </div>
      </div>
    )
  },
  {
    title: '외형가공',
    width:118,
    dataIndex: 'out',
    key: 'out',
    align: 'center',
    render: (_, record:specModelType) => (
      <div className={divTopClass}>
        <div className={divClass}>
          <AntdSelectFill
            options={outSelectList}
            value={record?.aprType?.id}
            onChange={(e)=>handleModelDataChange(record.id, 'spPrint.id', e)}
            styles={{fs:'12px'}}
          />
        </div>
      </div>
    )
  },
  {
    title: 'PCS SIZE',
    width:50,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:60,
        dataIndex: 'pcsSize_xy',
        key: 'pcsSize_xy',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}>
              <AntdInputFill
                value={record?.pcsL}
                onChange={(e)=>handleModelDataChange(record.id, 'pcsL', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record?.pcsW}
                onChange={(e)=>handleModelDataChange(record.id, 'pcsW', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT SIZE',
    width:50,
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:60,
        dataIndex: 'kitSize_xy',
        key: 'kitSize_xy',
        align: 'center',
        render: (_, record:specModelType) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}>
              <AntdInputFill
                value={record?.kitW}
                onChange={(e)=>handleModelDataChange(record.id, 'kitW', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record?.kitL}
                onChange={(e)=>handleModelDataChange(record.id, 'kitL', e.target.value)}
                className="!text-12"
                type="number"
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
    dataIndex: 'ar',
    key: 'ar',
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
                className="!text-12"
                type="number"
              />
              <AntdInputFill
                value={record?.ykitL}
                onChange={(e)=>handleModelDataChange(record.id, 'ykitL', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record?.ypnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'ypnlW', e.target.value)}
                className="!text-12"
                type="number"
              />
              <AntdInputFill
                value={record?.ypnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'ypnlL', e.target.value)}
                className="!text-12"
                type="number"
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
      <>
        <div className={divClass+"mb-3"}>
          <p className="text-left w-37 !text-12">LINE</p>
          <AntdInputFill 
            value={record?.specLine}
            onChange={(e)=>handleModelDataChange(record.id, 'specLine', e.target.value)}
            className="w-[45px!important] !text-12"
            />
          <p className="w-12 !text-12">㎜</p>
        </div>
        <div className={divClass+"mb-3"}>
          <p className="text-left w-37 !text-12">SPACE</p>
          <AntdInputFill 
            value={record?.specSpace}
            onChange={(e)=>handleModelDataChange(record.id, 'specSpace', e.target.value)}
            className="w-[45px!important] !text-12"
            />
          <p className="w-12 !text-12">㎜</p>
        </div>
        <div className={divClass+"mb-3"}>
          <p className="text-left w-37 !text-12">DR</p>
          <AntdInputFill 
            value={record?.specDr}
            onChange={(e)=>handleModelDataChange(record.id, 'specDr', e.target.value)}
            className="w-[45px!important] !text-12"
            />
          <p className="w-12 !text-12">￠</p>
        </div>
        <div className={divClass}>
          <p className="text-left w-37 !text-12">PAD</p>
          <AntdInputFill
            value={record?.specPad}
            onChange={(e)=>handleModelDataChange(record.id, 'specPad', e.target.value)}
            className="w-[45px!important] !text-12"
          />
          <p className="w-12 !text-12">￠</p>
        </div>
      </>
    )
  },
]

export const sayangModelWaitClmn = (
  totalData: number,
  router:NextRouter,
  pagination: {current: number, size: number},
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
): CustomColumn[] => [
  {
    title: '대기',
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
  },
  // {
  //   title: '관리No',
  //   width: 120,
  //   dataIndex: 'orderNo',
  //   key: 'orderNo',
  //   align: 'center',
  // },
  {
    title: '업체명/코드',
    width: 150,
    dataIndex: 'prtInfo.prtNm/prtInfo.prt.prtRegCd',
    key: 'prtInfo.prtNm/prtInfo.prt.prtRegCd',
    align: 'center',
    tooltip: "업체명/코드를 클릭하면 고객정보 및 담당자 정보를 볼 수 있어요",
    render: (_, record:salesOrderRType) => (
      <div
        className="w-full h-center cursor-pointer jutify-left transition-shadow duration-300 shadow-none hover:shadow-md"
        onClick={()=>{
          setPartnerData(record.prtInfo.prt);
          setPartnerMngData(record.prtInfo.mng);
        }}
      >
        {record.prtInfo?.prt.prtNm}
        /
        {record.prtInfo?.prt.prtRegCd}
      </div>
    )
  },
  {
    title: '고객발주(요구)명',
    dataIndex: 'orderNm',
    key: 'orderNm',
    align: 'center',
    render: (value) => (
      <div className="text-left">{value}</div>
    )
  },
  {
    title: '모델수',
    width: 70,
    dataIndex: 'modelCnt',
    key: 'modelCnt',
    align: 'center',
    render: (_:any, record:salesOrderRType) => {
      return record?.products?.length;
    }
  },
  {
    title: '업체담당',
    width: 100,
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
    width: 100,
    dataIndex: 'emp.name',
    key: 'emp.name',
    align: 'center',
  },
  {
    title: '발주(요구)접수일',
    width: 150,
    dataIndex: 'orderRepDt',
    key: 'orderRepDt',
    align: 'center',
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'orderDt',
    key: 'orderDt',
    align: 'center',
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
            router.push(`/sayang/model/wait/${value}`);
            // setOrder
          }}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
    )
  },
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
  handleModelDataChange: (id:string, name:string, value:any) => void,
  newFlag: boolean,
  selectId: string | null,
): TableProps['columns'] => [
  {
    title: 'No',
    width: 30,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value: any, record: any) => (
      <>
        <div className="h-[50%] w-[100%] v-h-center ">
        <p className="w-24 h-24 bg-back rounded-6 v-h-center ">{record?.index}</p>
        </div>
        <div className="h-[50%] w-[100%] v-h-center">
        {
          !record.completed &&
            <div className="w-24 h-24 rounded-6 v-h-center border-1 border-line cursor-pointer"
              onClick={()=>deleteModel(value)}
            >
              <p className="w-16 h-16"><Trash /></p>
            </div>
        }
        </div>
      </>
    ),
  },
  {
    title: 'Rev',
    dataIndex: 'rev',
    width: 80,
    key: 'rev',
    align: 'center',
    children: [
      {
        title:'납품단위',
        width: 80,
        dataIndex: 'user',
        key:'user',
        align: 'center',
        render: (_, record:any) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.prdRevNo ?? record.tempPrdInfo?.prdRevNo ?? record.currPrdInfo?.prdRevNo}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.prdRevNo', e.target.value)}
                className='!text-12'
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={unitSelectList}
                value={record.editModel?.unit?.id ?? record.tempPrdInfo?.unit?.id ?? record.currPrdInfo?.unit?.id ?? unitSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.unit.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '층',
    dataIndex: 'layer',
    key: 'layer',
    align: 'center',
    children: [
      {
        title:'두께(T)',
        width: 65,
        dataIndex: 'thic_layer',
        key:'thic_layer',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill
                options={generateFloorOptions()}
                value={record.editModel?.layerEm ?? record.tempPrdInfo?.layerEm ?? record.currPrdInfo?.layerEm ?? "L1"}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.layerEm', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.thk ?? record.tempPrdInfo?.thk ?? record.currPrdInfo?.thk}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.thk', e.target.value)}
                className='!text-12'
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '동박두께',
    width: 75,
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    children: [
      {
        title:'',
        width: 75,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.editModel?.copOut ?? record.tempPrdInfo?.copOut ?? record.currPrdInfo?.copOut}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.copOut', e.target.value)}
                className="!text-12" 
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              /> 외
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.editModel?.copIn ?? record.tempPrdInfo?.copIn ?? record.currPrdInfo?.copIn}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.copIn', e.target.value)}
                className="!text-12" 
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />내
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '도금(㎛)',
    width: 60,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    children: [
      {
        title:'핀 수',
        width: 60,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pltThk ?? record.tempPrdInfo?.pltThk ?? record.currPrdInfo?.pltThk}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pltThk', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record.editModel?.pltAlph ?? record.tempPrdInfo?.pltAlph ?? record.currPrdInfo?.pltAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pltAlph', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pinCnt ?? record.tempPrdInfo?.pinCnt ?? record.currPrdInfo?.pinCnt}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pinCnt', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수도금(㎛)',
    width:110,
    dataIndex: 'tDogeum',
    key: 'tDogeum',
    align: 'center',
    children: [
      {
        title:'Ni Au',
        width: 90,
        dataIndex: 'tDogeum',
        key:'tDogeum',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.editModel?.spPltNi ?? record.tempPrdInfo?.spPltNi ?? record.currPrdInfo?.spPltNi}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltNi', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
              <AntdInputFill 
                value={record.editModel?.spPltNiAlph ?? record.tempPrdInfo?.spPltNiAlph ?? record.currPrdInfo?.spPltNiAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltNiAlph', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.editModel?.spPltAu ?? record.tempPrdInfo?.spPltAu ?? record.currPrdInfo?.spPltAu}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltAu', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
              <AntdInputFill 
                value={record.editModel?.spPltAuAlph ?? record.tempPrdInfo?.spPltAuAlph ?? record.currPrdInfo?.spPltAuAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltAuAlph', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
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
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record.editModel?.smColor?.id ?? record.tempPrdInfo?.smColor?.id ?? record.currPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.smColor.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record.editModel?.smType?.id ?? record.tempPrdInfo?.smType?.id ?? record.currPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.smType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
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
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record.editModel?.mkColor?.id ?? record.tempPrdInfo?.mkColor?.id ?? record.currPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.mkColor.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record.editModel?.mkType?.id ?? record.tempPrdInfo?.mkType?.id ?? record.currPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.mkType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
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
        title:'',
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
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={spTypeSelectList}
                value={record.editModel?.spType?.id ?? record.tempPrdInfo?.spType?.id ?? record.currPrdInfo?.spType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={[{value:ModelTypeEm.SAMPLE,label:'샘플'},{value:ModelTypeEm.PRODUCTION,label:'양산'}]}
                value={record.editModel?.modelTypeEm ?? record.tempPrdInfo?.modelTypeEm ?? record.currPrdInfo?.modelTypeEm ?? "sample"}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.modelTypeEm', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '외형가공',
    width:90,
    dataIndex: 'out',
    key: 'out',
    align: 'center',
    children: [
      {
        title:'브이컷',
        width:90,
        dataIndex: 'vcut',
        key: 'vcut',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={outSelectList} 
                value={record.editModel?.aprType?.id ?? record.tempPrdInfo?.aprType?.id ?? record.currPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.aprType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={[{value:false,label:'무'},{value:true,label:'유'}]}
                value={record.editModel?.vcutYn ?? record.tempPrdInfo?.vcutYn ?? record.currPrdInfo?.vcutYn ?? false}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.vcutYn', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={vcutSelectList}
                value={record.editModel?.vcutType?.id ?? record.tempPrdInfo?.vcutType?.id ?? record.currPrdInfo?.vcutType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.vcutType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '도면번호',
    width:100,
    dataIndex: 'doNum',
    key: 'doNum',
    align: 'center',
    children: [
      {
        title:'',
        width:100,
        dataIndex: 'doNum',
        key: 'doNum',
        align: 'center',
        render: (_, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.doNum ?? record.tempPrdInfo?.doNum ?? record.currPrdInfo?.doNum}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.doNum', e.target.value)}
                className='w-[100px] !text-12'
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'PCS',
    width:50,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
        dataIndex: 'pcsSize_xy',
        key: 'pcsSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pcsW ?? record.tempPrdInfo?.pcsW ?? record.currPrdInfo?.pcsW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pcsW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pcsL ?? record.tempPrdInfo?.pcsL ?? record.currPrdInfo?.pcsL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pcsL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT',
    width:50,
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
        dataIndex: 'kitSize_xy',
        key: 'kitSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.kitW ?? record.tempPrdInfo?.kitW ?? record.currPrdInfo?.kitW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.kitL ?? record.tempPrdInfo?.kitL ?? record.currPrdInfo?.kitL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'PNL',
    width:50,
    dataIndex: 'pnl',
    key: 'pnl',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
        dataIndex: 'pnlSize_xy',
        key: 'pnlSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pnlW ?? record.tempPrdInfo?.pnlW ?? record.currPrdInfo?.pnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pnlL ?? record.tempPrdInfo?.pnlL ?? record.currPrdInfo?.pnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
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
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record.editModel?.ykitW ?? record.tempPrdInfo?.ykitW ?? record.currPrdInfo?.ykitW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ykitW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
              <AntdInputFill
                value={record.editModel?.ykitL ?? record.tempPrdInfo?.ykitL ?? record.currPrdInfo?.ykitL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ykitL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record.editModel?.ypnlW ?? record.tempPrdInfo?.ypnlW ?? record.currPrdInfo?.ypnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ypnlW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
              <AntdInputFill
                value={record.editModel?.ypnlL ?? record.tempPrdInfo?.ypnlL ?? record.currPrdInfo?.ypnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ypnlL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT/PCS',
    width:50,
    dataIndex: 'kitpcs',
    key: 'kitpcs',
    align: 'center',
    children:[
      {
        title: 'PNL/KIT',
        width:50,
        dataIndex: 'pnlkit',
        key: 'pnlkit',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.kitPcs ?? record.tempPrdInfo?.kitPcs ?? record.currPrdInfo?.kitPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitPcs', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pnlKit ?? record.tempPrdInfo?.pnlKit ?? record.currPrdInfo?.pnlKit}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlKit', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'STH/PNL',
    width:50,
    dataIndex: 'sthpnl',
    key: 'sthpnl',
    align: 'center',
    children:[
      {
        title: 'STH/PCS',
        width:50,
        dataIndex: 'sthpcs',
        key: 'sthpcs',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.sthPnl ?? record.tempPrdInfo?.sthPnl ?? record.currPrdInfo?.sthPnl}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.sthPnl', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.sthPcs ?? record.tempPrdInfo?.sthPcs ?? record.currPrdInfo?.sthPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.sthPcs', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
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
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
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
    render: (_, record:modelsType) => (
      <div
        className="text-left cursor-pointer"
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
    title: '동박',
    width: 120,
    dataIndex: 'copIn',
    key: 'copIn',
    align: 'center',
    render: (value:number, record:modelsType) => {
      return record.copOut+"(외) / "+value+"(내)";
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
    title: '등록일',
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
]