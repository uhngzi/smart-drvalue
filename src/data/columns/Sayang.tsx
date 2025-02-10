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
import { HotGrade } from '../type/enum';
import { CustomColumn } from '@/components/List/AntdTableEdit';

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
        width: 90,
        dataIndex: 'user',
        key:'user',
        align: 'center',
        render: (value:any, record:any) => (
          <>
            <div className="h-[50%] w-[100%] v-h-center">{record.no}</div>
            <div className="h-[50%] w-[100%] v-h-center">{record.cuNm+'-'+record.cuCode}</div>
          </>
        )
      },
    ]
  },
  {
    title: '모델',
    dataIndex: 'modelNm',
    key: 'modelNm',
    align: 'center',
    children: [
      {
        title:'Rev',
        width: 160,
        dataIndex: 'rev',
        key:'rev',
        align: 'center',
        render: (value:any, record:any) => (
          <>
            <div className="h-[50%] w-[100%] h-center break-words text-left">{record.modelNm}</div>
            <div className="h-[50%] w-[100%] h-center">{value}</div>
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
        width: 65,
        dataIndex: 'thic_layer',
        key:'thic_layer',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'10'}]} /></div>
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'1.6'}]} /></div>
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
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3 gap-5"}><AntdInputFill className="w-[60px!important]"/>외</div>
        <div className={divClass+"gap-5"}><AntdInputFill className="w-[60px!important]"/>내</div>
      </div>
    )
  },
  {
    title: '도금(㎛)',
    width: 60,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdInputFill /></div>
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
        <div className={divClass+"mb-3 gap-5"}><AntdSelectFill options={[{value:1,label:'Ni'}]} className="w-[60px!important]"/><AntdInputFill className="w-[60px!important]"/></div>
        <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'Au'}]} className="w-[60px!important]"/><AntdInputFill className="w-[60px!important]"/></div>
      </div>
    )
  },
  {
    title: 'UL/위치',
    width:135,
    dataIndex: 'ul',
    key: 'ul',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3"}><AntdInputFill /></div>
        <div className={divClass+"mb-3"}><AntdInputFill /></div>
        <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'M/K'}]} className="w-[60px!important]"/><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} className="w-[60px!important]"/></div>
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
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
      </div>
    )
  },
  {
    title: 'PSR색상',
    width:130,
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
            <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} /></div>
            <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
          </div>
        )
      }
    ]
  },
  {
    title: 'M/K',
    width:90,
    dataIndex: 'mk',
    key: 'mk',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
      </div>
    )
  },
  {
    title: 'M/K색상',
    width:130,
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
            <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} /></div>
            <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수인쇄',
    width:70,
    dataIndex: 'tPrint',
    key: 'tPrint',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
      </div>
    )
  },
  {
    title: '표면처리',
    width:115,
    dataIndex: 'surf',
    key: 'surf',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
      </div>
    )
  },
  {
    title: '외형가공',
    width:130,
    dataIndex: 'out',
    key: 'out',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
      </div>
    )
  },
  {
    title: 'PCS SIZE',
    width:60,
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
            <div className={divClass+"mb-3"}><AntdInputFill /></div>
            <div className={divClass}><AntdInputFill /></div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT SIZE',
    width:60,
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
            <div className={divClass+"mb-3"}><AntdInputFill /></div>
            <div className={divClass}><AntdInputFill /></div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조',
    width:90,
    dataIndex: 'ar',
    key: 'ar',
    align: 'center',
    render: (value, record) => (
      <div className={divTopClass}>
        <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
        <div className={divClass+"gap-10"}><AntdInputFill className="w-[50px!important]"/>연조</div>
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
        <div className={divClass+"mb-3"}><p className="text-left w-37">LINE</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">㎜</p></div>
        <div className={divClass+"mb-3"}><p className="text-left w-37">SPACE</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">㎜</p></div>
        <div className={divClass+"mb-3"}><p className="text-left w-37">DR</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">￠</p></div>
        <div className={divClass}><p className="text-left w-37">PAD</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">￠</p></div>
      </>
    )
  },
]

export const sayangModelWaitClmn = (
  totalData: number,
  router:NextRouter,
  // setNewOpen: React.Dispatch<React.SetStateAction<boolean>>,
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
    dataIndex: 'prdMngNo',
    key: 'prdMngNo',
    align: 'center',
  },
  {
    title: '업체명/코드',
    width: 120,
    dataIndex: 'prtNm',
    key: 'prtNm',
    align: 'center',
    render: (_, record) => (
      <div className="text-left">
        {record?.partner?.prtNm}
        /
        {record?.partner?.prtRegCd}
      </div>
    )
  },
  {
    title: '고객발주(요구)명',
    dataIndex: 'prdNm',
    key: 'prdNm',
    align: 'center',
    render: (value) => (
      <div className="text-left">{value}</div>
    )
  },
  {
    title: '업체담당',
    width: 100,
    dataIndex: 'mngNm',
    key: 'mngNm',
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
    title: '영업담당',
    width: 100,
    dataIndex: 'salesNm',
    key: 'salesNm',
    align: 'center',
  },
  {
    title: '발주(요구)접수일',
    width: 150,
    dataIndex: 'orderDt',
    key: 'orderDt',
    align: 'center',
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'submitDt',
    key: 'submitDt',
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
            router.push(`/sayang/model/wait/form/${value}`)
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
): TableProps['columns'] => [
  {
    title: 'No',
    width: 30,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value:any, record: any) => (
      <>
        <div className="h-[50%] w-[100%] v-h-center "><p className="w-24 h-24 bg-back rounded-6 v-h-center ">{value}</p></div>
        <div className="h-[50%] w-[100%] v-h-center">
          <div className="w-24 h-24 rounded-6 v-h-center border-1 border-line cursor-pointer" onClick={()=>deleteModel(value)}>
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
            <div className={divClass}><AntdInputFill value={record.rev} className='!text-12'/></div>
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'1.6'}]} styles={{fs:'12px'}}/></div>
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
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'10'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass}><AntdInputFill value={record.thic} className='!text-12'/></div>
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
            <div className={divClass+"gap-5"}><AntdInputFill className="w-[48px!important] !text-12" value={record.dongback}/>외</div>
            <div className={divClass+"gap-5"}><AntdInputFill className="w-[48px!important] !text-12" value={record.dongback}/>내</div>
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
            <div className={divClass}><AntdInputFill className="w-[50px!important] !text-12"/></div>
            <div className={divClass}><AntdInputFill className="w-[50px!important] !text-12"/></div>
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
            <div className={divClass+"gap-5"}><AntdInputFill className="w-[50px!important] !text-12"/><AntdInputFill className="w-[50px!important] !text-12"/></div>
            <div className={divClass+"gap-5"}><AntdInputFill className="w-[50px!important] !text-12"/><AntdInputFill className="w-[50px!important] !text-12"/></div>
          </div>
        )
      },
    ]
    
  },
  // {
  //   title: 'UL/위치',
  //   width:135,
  //   dataIndex: 'ul',
  //   key: 'ul',
  //   align: 'center',
  //   render: (value, record) => (
  //     <div className={divTopClass}>
  //       <div className={divClass+"mb-3"}><AntdInputFill /></div>
  //       <div className={divClass+"mb-3"}><AntdInputFill /></div>
  //       <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'M/K'}]} className="w-[60px!important]"/><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} className="w-[60px!important]"/></div>
  //     </div>
  //   )
  // },
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
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'녹색(무광)'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'PSR-400(HMF)'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'PSR-400(HMF)'}]} styles={{fs:'12px'}}/></div>
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
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'녹색(무광)'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'PSR-400(HMF)'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'PSR-400(HMF)'}]} styles={{fs:'12px'}}/></div>
          </div>
        )
      }
    ]
  },
  // {
  //   title: 'PSR색상',
  //   width:130,
  //   dataIndex: 'psr',
  //   key: 'psr',
  //   align: 'center',
  //   children: [
  //     {
  //       title:'Ink',
  //       width:130,
  //       dataIndex: 'psrInk_color',
  //       key: 'psrInk_color',
  //       align: 'center',
  //       render: (value, record) => (
  //         <div className={divTopClass}>
  //           <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} /></div>
  //           <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
  //         </div>
  //       )
  //     }
  //   ]
  // },
  // {
  //   title: 'M/K',
  //   width:90,
  //   dataIndex: 'mk',
  //   key: 'mk',
  //   align: 'center',
  //   render: (value, record) => (
  //     <div className={divTopClass}>
  //       <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
  //     </div>
  //   )
  // },
  // {
  //   title: 'M/K색상',
  //   width:130,
  //   dataIndex: 'mkC',
  //   key: 'mkC',
  //   align: 'center',
  //   children: [
  //     {
  //       title:'Ink',
  //       width:130,
  //       dataIndex: 'mkInk_color',
  //       key: 'mkInk_color',
  //       align: 'center',
  //       render: (value, record) => (
  //         <div className={divTopClass}>
  //           <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} /></div>
  //           <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
  //         </div>
  //       )
  //     }
  //   ]
  // },
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
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'녹색(무광)'}]} styles={{fs:'12px'}}/></div>
            <div className={divClass}><AntdSelectFill options={[{value:1,label:'PSR-400(HMF)'}]} styles={{fs:'12px'}}/></div>
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
            <div className={divClass}><AntdSelectFill className='w-[90px]' options={[{value:1,label:'ROUTER'}]}  styles={{fs:'12px'}}/></div>
            <div className={divClass}><AntdSelectFill className='w-[90px]' options={[{value:1,label:'유'},{value:2,label:'무'}]} defaultValue={2} styles={{fs:'12px'}}/></div>
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
            <div className={divClass}><AntdInputFill className='w-[100px] !text-12'/></div>
            <div className={divClass+""}><AntdInputFill className='w-[100px] !text-12'/></div>
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
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
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
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
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
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조KIT',
    width:60,
    dataIndex: 'arkit',
    key: 'arkit',
    align: 'center',
    children:[
      {
        title: '연조PNL',
        width:60,
        dataIndex: 'arpnl',
        key: 'arpnl',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
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
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
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
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
            <div className={divClass}><AntdInputFill className="w-[50px] !text-12"/></div>
          </div>
        )
      },
    ]
  },
  // {
  //   title: 'SPEC',
  //   width:110,
  //   dataIndex: 'spec',
  //   key: 'spec',
  //   align: 'center',
  //   render: (value, record) => (
  //     <>
  //       <div className={divClass+"mb-3"}><p className="text-left w-37">LINE</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">㎜</p></div>
  //       <div className={divClass+"mb-3"}><p className="text-left w-37">SPACE</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">㎜</p></div>
  //       <div className={divClass+"mb-3"}><p className="text-left w-37">DR</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">￠</p></div>
  //       <div className={divClass}><p className="text-left w-37">PAD</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">￠</p></div>
  //     </>
  //   )
  // },
]