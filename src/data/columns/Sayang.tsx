import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';

import Edit from '@/assets/svg/icons/memo.svg';
import Plus from "@/assets/svg/icons/l_plus.svg";
import Data from "@/assets/svg/icons/data.svg";
import Print from "@/assets/svg/icons/print.svg";
import Back from "@/assets/svg/icons/back.svg";
import Trash from "@/assets/svg/icons/trash.svg";

import { NextRouter } from 'next/router';
import { Checkbox } from 'antd';
import AntdSelectFill from '@/components/Select/AntdSelectFill';
import AntdInputFill from '@/components/Input/AntdInputFill';
import { generateFloorOptions, HotGrade, LayerEm, ModelStatus, ModelTypeEm } from '../type/enum';
import { CustomColumn } from '@/components/List/AntdTableEdit';
import { salesOrderRType } from '../type/sales/order';
import { modelsMatchRType, modelsType, orderModelType } from '../type/sayang/models';
import { selectType } from '../type/componentStyles';
import { partnerMngRType, partnerRType } from '../type/base/partner';
import { SetStateAction } from 'react';

export const sayangSampleWaitClmn1 = (
  totalData: number,
  sayangPopOpen: (value:String) => void,
  pagination?: {current: number, size: number},
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
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
  {
    title: '업체명/코드',
    width: 120,
    dataIndex: 'cuNm',
    key: 'cuNm',
    align: 'center',
  },
  {
    title: 'Model',
    // minWidth: 245,
    width: 245,
    dataIndex: 'modelNm',
    key: 'modelNm',
    align: 'center',
  },
  {
    title: '필름번호',
    width: 105,
    dataIndex: 'rev',
    key: 'rev',
    align: 'center',
  },
  {
    title: 'Rev',
    width: 100,
    dataIndex: 'rev',
    key: 'rev',
    align: 'center',
  },
  {
    title: '긴급',
    width:80,
    dataIndex: 'hot',
    key: 'hot',
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
    title: '구분',
    width: 80,
    dataIndex: 'state',
    key: 'state',
    align: 'center',
    render: (value: number) => (
      <div className="v-h-center">
        {value === 3 ? (
          <FullChip label="신규" />
        ) : value === 2 ? (
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
    dataIndex: 'thic',
    key: 'thic',
    align: 'center',
  },
  {
    title: '층',
    width: 50,
    dataIndex: 'layer',
    key: 'layer',
    align: 'center',
  },
  {
    title: 'PCS',
    width: 100,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
  },
  {
    title: '납기일',
    width: 150,
    dataIndex: 'napgi',
    key: 'napgi',
    align: 'center',
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'order',
    key: 'order',
    align: 'center',
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
          onClick={() => sayangPopOpen(value)}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
    )
  },
];

export const sayangSampleWaitClmn = (
  totalData: number,
  sayangPopOpen: (value:String) => void,
  setPartnerData: React.Dispatch<SetStateAction<partnerRType | null>>,
  setPartnerMngData: React.Dispatch<SetStateAction<partnerMngRType | null>>,
  pagination?: {current: number, size: number},
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
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
  {
    title: '업체명/코드',
    width: 120,
    dataIndex: 'prtNm',
    key: 'prtNm',
    align: 'center',
    render: (_, record:modelsMatchRType) => (
      <div className="text-left cursor-pointer"
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
    render: (value) => (
      <div className="w-full h-full v-h-center">
        <div 
          className="w-40 h-40 v-h-center cursor-pointer rounded-4 hover:bg-[#E9EDF5]" 
          onClick={()=>sayangPopOpen(value)}
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

): TableProps['columns'] => [
  {
    title: 'No',
    width: 30,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (value:any) => (
      <>
        <div className="h-[33%] w-[100%] v-h-center "><Checkbox id={value} /></div>
        <div className="h-[34%] w-[100%] v-h-center "><p className="w-24 h-24 bg-back rounded-6 v-h-center ">2</p></div>
        <div className="h-[33%] w-[100%] v-h-center">
          <div className="w-24 h-24 rounded-6 v-h-center border-1 border-line cursor-pointer">
            <p className="w-16 h-16"><Trash /></p>
          </div>
        </div>
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
        render: (value:any, record:any) => (
          <>
            <div className="h-[50%] w-[100%] v-h-center !text-12">{record.no}</div>
            <div className="h-[50%] w-[100%] v-h-center !text-12">{record.cuNm+'-'+record.cuCode}</div>
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
        render: (value:any, record:any) => (
          <>
            <div className="h-[50%] w-[100%] h-center break-words text-left !text-12">{record.modelNm}</div>
            <div className="h-[50%] w-[100%] h-center !text-12">{value}</div>
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
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'10'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'1.6'}]} styles={{fs:'12px'}}/></div>
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
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3 gap-5 !text-12"}><AntdInputFill className="!text-12"/>외</div>
        <div className={divClass+"gap-5 !text-12"}><AntdInputFill className="!text-12"/>내</div>
      </div>
    )
  },
  {
    title: '도금(㎛)',
    width: 50,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdInputFill className='!text-12'/></div>
      </div>
    )
  },
  {
    title: '특수도금(㎛)',
    width:110,
    dataIndex: 'tDogeum',
    key: 'tDogeum',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3 gap-5"}><AntdSelectFill options={[{value:1,label:'Ni'}]} styles={{pd:"0", fs:'12px'}} /><AntdInputFill /></div>
        <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'Au'}]} styles={{pd:"0", fs:'12px'}} /><AntdInputFill /></div>
      </div>
    )
  },
  {
    title: 'UL/위치',
    width:15,
    dataIndex: 'ul',
    key: 'ul',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3"}><AntdInputFill className='!text-12'/></div>
        <div className={divClass+"mb-3"}><AntdInputFill className='!text-12'/></div>
        <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'M/K'}]} className="w-[60px!important]" styles={{pd:"0",fs:'12px'}}/><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} className="w-[60px!important]" styles={{pd:"0",fs:'12px'}}/></div>
      </div>
    )
  },
  {
    title: 'S/M',
    width:90,
    dataIndex: 'sm',
    key: 'sm',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} styles={{fs:'12px'}}/></div>
      </div>
    )
  },
  {
    title: 'PSR색상',
    width:120,
    dataIndex: 'psr',
    key: 'psr',
    align: 'center',
    children: [
      {
        title:'Ink',
        width:130,
        dataIndex: 'psrInk_color',
        key: 'psrInk_color',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} styles={{fs:'12px'}}/></div>
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
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} styles={{fs:'12px'}}/></div>
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
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} styles={{fs:'12px'}}/></div>
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
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdInputFill className='!text-12' /></div>
      </div>
    )
  },
  {
    title: '표면처리',
    width:104,
    dataIndex: 'surf',
    key: 'surf',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} styles={{fs:'12px'}}/></div>
      </div>
    )
  },
  {
    title: '외형가공',
    width:118,
    dataIndex: 'out',
    key: 'out',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} styles={{fs:'12px'}}/></div>
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
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}><AntdInputFill className='!text-12'/></div>
            <div className={divClass}><AntdInputFill className='!text-12'/></div>
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
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}><AntdInputFill className='!text-12'/></div>
            <div className={divClass}><AntdInputFill className='!text-12'/></div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조',
    width:55,
    dataIndex: 'ar',
    key: 'ar',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Au'}]} styles={{fs:'12px'}}/></div>
        <div className={divClass+"gap-3 !text-12"}><AntdInputFill className="w-[30px!important] !text-12"/>연조</div>
      </div>
    )
  },
  {
    title: 'SPEC',
    width:110,
    dataIndex: 'spec',
    key: 'spec',
    align: 'center',
    render: (value, record) => (
      <>
        <div className={divClass+"mb-3"}><p className="text-left w-37 !text-12">LINE</p><AntdInputFill className="w-[45px!important] !text-12" /><p className="w-12 !text-12">㎜</p></div>
        <div className={divClass+"mb-3"}><p className="text-left w-37 !text-12">SPACE</p><AntdInputFill className="w-[45px!important] !text-12" /><p className="w-12 !text-12">㎜</p></div>
        <div className={divClass+"mb-3"}><p className="text-left w-37 !text-12">DR</p><AntdInputFill className="w-[45px!important] !text-12" /><p className="w-12 !text-12">￠</p></div>
        <div className={divClass}><p className="text-left w-37 !text-12">PAD</p><AntdInputFill className="w-[45px!important] !text-12" /><p className="w-12 !text-12">￠</p></div>
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
    width: 120,
    dataIndex: 'prtInfo.prtNm',
    key: 'prtInfo.prtNm',
    align: 'center',
    render: (_, record:salesOrderRType) => (
      <div className="text-left cursor-pointer"
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
    title: '업체담당',
    width: 100,
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
            router.push(`/sayang/model/wait/form/${value}`);
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
          <div className="w-24 h-24 rounded-6 v-h-center border-1 border-line cursor-pointer"
            onClick={()=>deleteModel(value)}
          >
            <p className="w-16 h-16"><Trash /></p>
          </div>
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
        render: (value:any, record:any) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.prdRevNo ?? record.model?.prdRevNo ?? record.tempPrdInfo?.prdRevNo}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.prdRevNo', e.target.value)}
                className='!text-12'
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={unitSelectList}
                value={record.editModel?.unit?.id ?? record.model?.unit?.id ?? record.tempPrdInfo?.unit?.id ?? unitSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.unit.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.layerEm ?? record.model?.layerEm ?? record.tempPrdInfo?.layerEm ?? "L1"}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.layerEm', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.thk ?? record.model?.thk ?? record.tempPrdInfo?.thk}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.thk', e.target.value)}
                className='!text-12'
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.copOut ?? record.model?.copOut ?? record.tempPrdInfo?.copOut}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.copOut', e.target.value)}
                className="!text-12" 
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              /> 외
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.editModel?.copIn ?? record.model?.copIn ?? record.tempPrdInfo?.copIn}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.copIn', e.target.value)}
                className="!text-12" 
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
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
        title:'',
        width: 60,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pltThk ?? record.model?.pltThk ?? record.tempPrdInfo?.pltThk}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pltThk', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record.editModel?.pltAlph ?? record.model?.pltAlph ?? record.tempPrdInfo?.pltAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pltAlph', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.spPltNi ?? record.model?.spPltNi ?? record.tempPrdInfo?.spPltNi}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltNi', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
              <AntdInputFill 
                value={record.editModel?.spPltNiAlph ?? record.model?.spPltNiAlph ?? record.tempPrdInfo?.spPltNiAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltNiAlph', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.editModel?.spPltAu ?? record.model?.spPltAu ?? record.tempPrdInfo?.spPltAu}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltAu', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
              <AntdInputFill 
                value={record.editModel?.spPltAuAlph ?? record.model?.spPltAuAlph ?? record.tempPrdInfo?.spPltAuAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPltAuAlph', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.smPrint?.id ?? record.model?.smPrint?.id ?? record.tempPrdInfo?.smPrint?.id ?? smPrintSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.smPrint.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record.editModel?.smColor?.id ?? record.model?.smColor?.id ?? record.tempPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.smColor.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record.editModel?.smType?.id ?? record.model?.smType?.id ?? record.tempPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.smType.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.mkPrint?.id ?? record.model?.mkPrint?.id ?? record.tempPrdInfo?.mkPrint?.id ?? mkPrintSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.mkPrint.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record.editModel?.mkColor?.id ?? record.model?.mkColor?.id ?? record.tempPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.mkColor.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record.editModel?.mkType?.id ?? record.model?.mkType?.id ?? record.tempPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.mkType.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.spPrint?.id ?? record.model?.spPrint?.id ?? record.tempPrdInfo?.spPrint?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spPrint.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={spTypeSelectList}
                value={record.editModel?.spType?.id ?? record.model?.spType?.id ?? record.tempPrdInfo?.spType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.spType.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={[{value:ModelTypeEm.SAMPLE,label:'샘플'},{value:ModelTypeEm.PRODUCTION,label:'양산'}]}
                value={record.editModel?.modelTypeEm?.id ?? record.model?.modelTypeEm?.id ?? record.tempPrdInfo?.modelTypeEm?.id ?? "sample"}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.modelTypeEm?.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.aprType?.id ?? record.model?.aprType?.id ?? record.tempPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.aprType.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={[{value:false,label:'무'},{value:true,label:'유'}]}
                value={record.editModel?.vcutYn ?? record.model?.vcutYn ?? record.tempPrdInfo?.vcutYn ?? false}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.vcutYn', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={vcutSelectList}
                value={record.editModel?.vcutType?.id ?? record.model?.vcutType?.id ?? record.tempPrdInfo?.vcutType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.vcutType.id', e)}
                styles={{fs:'12px'}}
                disabled={selectId === record.id ? !newFlag : undefined}
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
        title:'필름번호',
        width:100,
        dataIndex: 'filmNo',
        key: 'filmNo',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.drgNo ?? record.model?.drgNo ?? record.tempPrdInfo?.drgNo}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.drgNo', e.target.value)}
                className='w-[100px] !text-12'
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.fpNo ?? record.model?.fpNo ?? record.tempPrdInfo?.fpNo}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.fpNo', e.target.value)}
                className='w-[100px] !text-12'
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.pcsL ?? record.model?.pcsL ?? record.tempPrdInfo?.pcsL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pcsL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pcsW ?? record.model?.pcsW ?? record.tempPrdInfo?.pcsW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pcsW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.kitL ?? record.model?.kitL ?? record.tempPrdInfo?.kitL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.kitW ?? record.model?.kitW ?? record.tempPrdInfo?.kitW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.pnlL ?? record.model?.pnlL ?? record.tempPrdInfo?.pnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pnlW ?? record.model?.pnlW ?? record.tempPrdInfo?.pnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.ykitL ?? record.model?.ykitL ?? record.tempPrdInfo?.ykitL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ykitL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
              <AntdInputFill
                value={record.editModel?.ykitW ?? record.model?.ykitW ?? record.tempPrdInfo?.ykitW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ykitW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record.editModel?.ypnlL ?? record.model?.ypnlL ?? record.tempPrdInfo?.ypnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ypnlL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
              <AntdInputFill
                value={record.editModel?.ypnlW ?? record.model?.ypnlW ?? record.tempPrdInfo?.ypnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.ypnlW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.kitPcs ?? record.model?.kitPcs ?? record.tempPrdInfo?.kitPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.kitPcs', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pnlKit ?? record.model?.pnlKit ?? record.tempPrdInfo?.pnlKit}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pnlKit', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
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
                value={record.editModel?.sthPnl ?? record.model?.sthPnl ?? record.tempPrdInfo?.sthPnl}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.sthPnl', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.sthPcs ?? record.model?.sthPcs ?? record.tempPrdInfo?.sthPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.sthPcs', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.editModel?.pinCnt ?? record.model?.pinCnt ?? record.tempPrdInfo?.pinCnt}
                onChange={(e)=>handleModelDataChange(record.id, 'editModel.pinCnt', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
              />
            </div>
          </div>
        )
      },
    ]
  },
]