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
import { generateFloorOptions, HotGrade } from '../type/enum';
import { CustomColumn } from '@/components/List/AntdTableEdit';
import { salesOrderRType } from '../type/sales/order';
import { modelsMatchRType, modelsType, orderModelType } from '../type/sayang/models';
import { selectType } from '../type/componentStyles';

export const sayangSampleWaitClmn1 = (
  totalData: number,
  router:NextRouter,
): CustomColumn[] => [
  {
    title: '대기',
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (_: any, __: any, index: number) => totalData - index, // 역순 번호 매기기
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
          onClick={()=>{router.push(`/sayang/sample/wait/form/${value}`)}}
        >
          <p className="w-18 h-18"><Edit /></p>
        </div>
      </div>
    )
  },
];

export const sayangSampleWaitClmn = (
  totalData: number,
  router:NextRouter,
): CustomColumn[] => [
  {
    title: '대기',
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (_: any, __: any, index: number) => totalData - index, // 역순 번호 매기기
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
    width: 350,
    dataIndex: 'modelNm',
    key: 'modelNm',
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
    width: 80,
    dataIndex: 'hot',
    key: 'hot',
    align: 'center',
    render: (value: number) => (
      <div className="v-h-center">
        {value === 3 ? (
          <FullChip label="일반" />
        ) : value === 2 ? (
          <FullChip label="긴급" state="pink" />
        ) : (
          <FullChip label="초긴급" state="purple"/>
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
          onClick={()=>{router.push(`/sayang/sample/wait/form/${value}`)}}
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
): CustomColumn[] => [
  {
    title: '대기',
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    render: (_: any, __: any, index: number) => totalData - index, // 역순 번호 매기기
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
      <div className="text-left">
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
                value={record.tempPrdInfo?.prdRevNo}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.prdRevNo', e.target.value)}
                className='!text-12'
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={unitSelectList}
                value={record.tempPrdInfo?.unit?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.unit.id', e)}
                styles={{fs:'12px'}}
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
                value={record.tempPrdInfo?.layerEm}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.layerEm', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.tempPrdInfo?.thk}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.thk', e.target.value)}
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
                value={record.tempPrdInfo?.copOut}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.copOut', e.target.value)}
                className="!text-12" 
                type="number"
              /> 외
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.tempPrdInfo?.copIn}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.copIn', e.target.value)}
                className="!text-12" 
                type="number"
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
                value={record.tempPrdInfo?.pltThk}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.pltThk', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record.tempPrdInfo?.pltAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.pltAlph', e.target.value)}
                className="!text-12"
                type="number"
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
                value={record.tempPrdInfo?.spPltNi}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.spPltNi', e.target.value)}
                type="number"
                className="!text-12"
              />
              <AntdInputFill 
                value={record.tempPrdInfo?.spPltNiAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.spPltNiAlph', e.target.value)}
                type="number"
                className="!text-12"
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.tempPrdInfo?.spPltAu}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.spPltAu', e.target.value)}
                type="number"
                className="!text-12"
              />
              <AntdInputFill 
                value={record.tempPrdInfo?.spPltAuAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.spPltAuAlph', e.target.value)}
                type="number"
                className="!text-12"
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
                value={record.tempPrdInfo?.smPrint}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.smPrint', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record.tempPrdInfo?.smColor}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.smColor', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record.tempPrdInfo?.smType}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.smType', e)}
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
                value={record.tempPrdInfo?.mkPrint}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.mkPrint', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record.tempPrdInfo?.mkColor}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.mkColor', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record.tempPrdInfo?.mkType}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.mkType', e)}
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
                value={record.tempPrdInfo?.spPrint}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.spPrint', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={spTypeSelectList}
                value={record.tempPrdInfo?.spType}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.spType', e)}
                styles={{fs:'12px'}}
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
                value={record.tempPrdInfo?.aprType}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.aprType', e)}
                styles={{fs:'12px'}}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={vcutSelectList}
                value={record.tempPrdInfo?.vcutType}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.vcutType', e)}
                styles={{fs:'12px'}}
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
                value={record.tempPrdInfo?.fpNo}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.fpNo', e.target.value)}
                className='w-[100px] !text-12'
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                // value={record.tempPrdInfo?.}
                // onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.', e.target.value)}
                className='w-[100px] !text-12'
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
                value={record.tempPrdInfo?.pcsL}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.pcsL', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.tempPrdInfo?.pcsW}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.pcsW', e.target.value)}
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
                value={record.tempPrdInfo?.kitL}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.kitL', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.tempPrdInfo?.kitW}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.kitW', e.target.value)}
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
                value={record.tempPrdInfo?.pnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.pnlL', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.tempPrdInfo?.pnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.pnlW', e.target.value)}
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
                value={record.tempPrdInfo?.ykitL}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.ykitL', e.target.value)}
                className="!text-12"
                type="number"
              />
              <AntdInputFill
                value={record.tempPrdInfo?.ykitW}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.ykitW', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record.tempPrdInfo?.ypnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.ypnlL', e.target.value)}
                className="!text-12"
                type="number"
              />
              <AntdInputFill
                value={record.tempPrdInfo?.ypnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.ypnlW', e.target.value)}
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
                value={record.tempPrdInfo?.kitPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.kitPcs', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.tempPrdInfo?.pnlKit}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.pnlKit', e.target.value)}
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
                value={record.tempPrdInfo?.sthPnl}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.sthPnl', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.tempPrdInfo?.sthPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.sthPcs', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.tempPrdInfo?.pinCnt}
                onChange={(e)=>handleModelDataChange(record.id, 'tempPrdInfo.pinCnt', e.target.value)}
                className="!text-12"
                type="number"
              />
            </div>
          </div>
        )
      },
    ]
  },
]