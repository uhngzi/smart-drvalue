import BorderButton from "@/components/Button/BorderButton";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import AntdTable from "@/components/Table/AntdTable";
import AntdInputFill from "@/components/Input/AntdInputFill";
import AntdSelectFill from "@/components/Select/AntdSelectFill";
import FilterTab from "@/components/Filter/FilterTab";
import CutSizeContents from "@/contents/sayang/add/CutSizeContents";
import LaminationContents from "@/contents/sayang/add/LaminationContents";
import MessageContents from "@/contents/sayang/add/MessageContents";
import ArrayContents from "@/contents/sayang/add/ArrayContents";

import Plus from "@/assets/svg/icons/l_plus.svg";
import Data from "@/assets/svg/icons/data.svg";
import Print from "@/assets/svg/icons/print.svg";
import Back from "@/assets/svg/icons/back.svg";
import Trash from "@/assets/svg/icons/trash.svg";

import { useState } from "react";
import { Checkbox, TableProps } from "antd";

import { filterType } from "@/data/type/filter";
import FullOkButton from "@/components/Button/FullOkButton";
import FullSubButton from "@/components/Button/FullSubButton";

const divClass = "h-35 w-[100%] h-center justify-left ";
const divTopClass = "h-[100%] flex flex-col items-start";

const sampleColumn:TableProps['columns'] = [
  {
    title: 'No',
    dataIndex: 'list_index',
    key: 'list_index',
    align: 'center',
    width: 30,
  },
  {
    title: '관리 No',
    className: '',
    dataIndex: 'user',
    key: 'user',
    align: 'center',
    children: [
      {
        key:'user',
        dataIndex: 'user',
        title:'업체명/코드',
        align: 'center',
        width: 90,
      },
    ]
  },
  {
    title: '모델',
    className: '',
    dataIndex: 'model',
    key: 'model',
    align: 'center',
    children: [
      {
        key:'model',
        dataIndex: 'model',
        title:'Rev',
        align: 'center',
        width: 160,
      },
    ]
  },
  {
    title: '층',
    className: '',
    dataIndex: 'layer',
    key: 'layer',
    align: 'center',
    children: [
      {
        key:'thic_layer',
        dataIndex: 'thic_layer',
        title:'두께(T)',
        align: 'center',
        width: 65,
      },
    ]
  },
  {
    title: '동박두께',
    className: '',
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    width: 75,
  },
  {
    title: '도금(㎛)',
    className: '',
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    width: 60,
  },
  {
    title: '특수도금(㎛)',
    className: '',
    dataIndex: 'tDogeum',
    key: 'tDogeum',
    align: 'center',
    width:110,
  },
  {
    title: 'UL/위치',
    className: '',
    dataIndex: 'ul',
    key: 'ul',
    align: 'center',
    width:135,
  },
  {
    title: 'S/M',
    className: '',
    dataIndex: 'sm',
    key: 'sm',
    align: 'center',
    width:90,
  },
  {
    title: 'PSR색상',
    className: '',
    dataIndex: 'psr',
    key: 'psr',
    align: 'center',
    width:130,
    children: [
      {
        key: 'psrInk_color',
        dataIndex: 'psrInk_color',
        title:'Ink',
        align: 'center',
        width:130,
      }
    ]
  },
  {
    title: 'M/K',
    className: '',
    dataIndex: 'mk',
    key: 'mk',
    align: 'center',
    width:90,
  },
  {
    title: 'M/K색상',
    className: '',
    dataIndex: 'mkC',
    key: 'mkC',
    align: 'center',
    width:130,
    children: [
      {
        key: 'mkInk_color',
        dataIndex: 'mkInk_color',
        title:'Ink',
        align: 'center',
        width:130,
      }
    ]
  },
  {
    title: '특수인쇄',
    className: '',
    dataIndex: 'tPrint',
    key: 'tPrint',
    align: 'center',
    width:60,
  },
  {
    title: '표면처리',
    className: '',
    dataIndex: 'surf',
    key: 'surf',
    align: 'center',
    width:115,
  },
  {
    title: '외형가공',
    className: '',
    dataIndex: 'out',
    key: 'out',
    align: 'center',
    width:130,
  },
  {
    title: 'PCS SIZE',
    className: '',
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    width:60,
    children:[
      {
        title: 'X/Y',
        className: '',
        dataIndex: 'pcsSize_xy',
        key: 'pcsSize_xy',
        align: 'center',
        width:60,
      },
    ]
  },
  {
    title: 'KIT SIZE',
    className: '',
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    width:60,
    children:[
      {
        title: 'X/Y',
        className: '',
        dataIndex: 'kitSize_xy',
        key: 'kitSize_xy',
        align: 'center',
        width:60,
      },
    ]
  },
  {
    title: '연조',
    className: '',
    dataIndex: 'ar',
    key: 'ar',
    align: 'center',
    width:90,
  },
  {
    title: 'SPEC',
    className: '',
    dataIndex: 'spec',
    key: 'spec',
    align: 'center',
    width:110,
  },
];

const sampleData = [
  {
    list_index: <>
      <div className="h-[33%] w-[100%] v-h-center "><Checkbox /></div>
      <div className="h-[34%] w-[100%] v-h-center "><p className="w-24 h-24 bg-back rounded-6 v-h-center ">2</p></div>
      <div className="h-[33%] w-[100%] v-h-center">
        <div className="w-24 h-24 rounded-6 v-h-center border-1 border-line cursor-pointer">
          <p className="w-16 h-16"><Trash /></p>
        </div>
      </div>
    </>,
    user: <>
      <div className="h-[50%] w-[100%] v-h-center">900-000</div>
      <div className="h-[50%] w-[100%] v-h-center">GPN-900</div>
    </>,
    model: <>
      <div className="h-[50%] w-[100%] h-center break-words text-left">GPNERPTEST001-00005001V1.5, LALC0100A-0.0</div>
      <div className="h-[50%] w-[100%] h-center">0.0.0</div>
    </>,
    thic_layer: <div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'10'}]} /></div>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'1.6'}]} /></div>
    </div>,
    dongback: <div className={divTopClass}>
      <div className={divClass+"mb-3 gap-5"}><AntdInputFill className="w-[60px!important]"/>외</div>
      <div className={divClass+"gap-5"}><AntdInputFill className="w-[60px!important]"/>내</div>
    </div>,
    dogeum:<div className={divTopClass}>
      <div className={divClass}><AntdInputFill /></div>
    </div>,
    tDogeum:<div className={divTopClass}>
      <div className={divClass+"mb-3 gap-5"}><AntdSelectFill options={[{value:1,label:'Ni'}]} className="w-[60px!important]"/><AntdInputFill className="w-[60px!important]"/></div>
      <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'Au'}]} className="w-[60px!important]"/><AntdInputFill className="w-[60px!important]"/></div>
    </div>,
    ul:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdInputFill /></div>
      <div className={divClass+"mb-3"}><AntdInputFill /></div>
      <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'M/K'}]} className="w-[60px!important]"/><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} className="w-[60px!important]"/></div>
    </div>,
    sm:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    psrInk_color:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} /></div>
      <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
    </div>,
    mk:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    mkInk_color:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} /></div>
      <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
    </div>,
    tPrint:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    surf:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    out:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    pcsSize_xy:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdInputFill /></div>
      <div className={divClass}><AntdInputFill /></div>
    </div>,
    kitSize_xy:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdInputFill /></div>
      <div className={divClass}><AntdInputFill /></div>
    </div>,
    ar:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
      <div className={divClass+"gap-10"}><AntdInputFill className="w-[50px!important]"/>연조</div>
    </div>,
    spec:<>
      <div className={divClass+"mb-3"}><p className="text-left w-37">LINE</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">㎜</p></div>
      <div className={divClass+"mb-3"}><p className="text-left w-37">SPACE</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">㎜</p></div>
      <div className={divClass+"mb-3"}><p className="text-left w-37">DR</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">￠</p></div>
      <div className={divClass}><p className="text-left w-37">PAD</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">￠</p></div>
    </>,
  },
  {
    list_index: <>
      <div className="h-[33%] w-[100%] v-h-center "><Checkbox /></div>
      <div className="h-[34%] w-[100%] v-h-center "><p className="w-24 h-24 bg-back rounded-6 v-h-center ">2</p></div>
      <div className="h-[33%] w-[100%] v-h-center">
        <div className="w-24 h-24 rounded-6 v-h-center border-1 border-line cursor-pointer">
          <p className="w-16 h-16"><Trash /></p>
        </div>
      </div>
    </>,
    user: <>
      <div className="h-[50%] w-[100%] v-h-center">900-000</div>
      <div className="h-[50%] w-[100%] v-h-center">GPN-900</div>
    </>,
    model: <>
      <div className="h-[50%] w-[100%] h-center break-words text-left">GPNERPTEST001-00005001V1.5, LALC0100A-0.0</div>
      <div className="h-[50%] w-[100%] h-center">0.0.0</div>
    </>,
    thic_layer: <div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'10'}]} /></div>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'1.6'}]} /></div>
    </div>,
    dongback: <div className={divTopClass}>
      <div className={divClass+"mb-3 gap-5"}><AntdInputFill className="w-[60px!important]"/>외</div>
      <div className={divClass+"gap-5"}><AntdInputFill className="w-[60px!important]"/>내</div>
    </div>,
    dogeum:<div className={divTopClass}>
      <div className={divClass}><AntdInputFill /></div>
    </div>,
    tDogeum:<div className={divTopClass}>
      <div className={divClass+"mb-3 gap-5"}><AntdSelectFill options={[{value:1,label:'Ni'}]} className="w-[60px!important]"/><AntdInputFill className="w-[60px!important]"/></div>
      <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'Au'}]} className="w-[60px!important]"/><AntdInputFill className="w-[60px!important]"/></div>
    </div>,
    ul:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdInputFill /></div>
      <div className={divClass+"mb-3"}><AntdInputFill /></div>
      <div className={divClass+"gap-5"}><AntdSelectFill options={[{value:1,label:'M/K'}]} className="w-[60px!important]"/><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} className="w-[60px!important]"/></div>
    </div>,
    sm:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    psrInk_color:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} /></div>
      <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
    </div>,
    mk:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    mkInk_color:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Ni'}]} /></div>
      <div className={divClass+""}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
    </div>,
    tPrint:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    surf:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    out:<div className={divTopClass}>
      <div className={divClass}><AntdSelectFill options={[{value:1,label:'CS+S/S'}]} /></div>
    </div>,
    pcsSize_xy:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdInputFill /></div>
      <div className={divClass}><AntdInputFill /></div>
    </div>,
    kitSize_xy:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdInputFill /></div>
      <div className={divClass}><AntdInputFill /></div>
    </div>,
    ar:<div className={divTopClass}>
      <div className={divClass+"mb-3"}><AntdSelectFill options={[{value:1,label:'Au'}]} /></div>
      <div className={divClass+"gap-10"}><AntdInputFill className="w-[50px!important]"/>연조</div>
    </div>,
    spec:<>
      <div className={divClass+"mb-3"}><p className="text-left w-37">LINE</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">㎜</p></div>
      <div className={divClass+"mb-3"}><p className="text-left w-37">SPACE</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">㎜</p></div>
      <div className={divClass+"mb-3"}><p className="text-left w-37">DR</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">￠</p></div>
      <div className={divClass}><p className="text-left w-37">PAD</p><AntdInputFill className="w-[45px!important]" /><p className="w-12 text-12">￠</p></div>
    </>,
  },
]

const SayangSampleAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [filter, setFilter] = useState<filterType>({
    writeDt: null,
    writer: '',
    approveDt: null,
    approver: '',
    confirmDt: null,
    confirmPer: '',
  });

  return (
    <div className="w-[1800px] flex flex-col gap-40">
      <FilterTab
        title="사양 및 생산의뢰 등록"
        titleEtc={
          <BorderButton 
            label={
              <div className="h-center gap-10 text-14 text-[#666666]">
                <p className="w-15 h-15"><Back /></p>
                <p>이전 단계</p>
              </div>
            }
            click={()=>{}}
            styles={{bc:'#666666'}}
          />
        }
        filter={filter}
        setFilter={setFilter}
        filterButton={
          <div className="h-center gap-20 min-w-[200px]">
            <BorderButton 
              label={<><p className="w-18 h-18 text-point1 mr-5"><Plus /></p><p className="text-point1">모델추가</p></>}
              click={()=>{}}
              styles={{bc:'#4880FF'}}
            />
            <BorderButton 
              label={<><p className="w-18 h-18 mr-5"><Data /></p><p>공정지정</p></>}
              click={()=>{}}
            />
            <BorderButton 
              label={<p className="w-20 h-20"><Print /></p>}
              click={()=>{}}
            />
          </div>
        }
        contents={
          <div>
            <AntdTable
              columns={sampleColumn}
              data={sampleData}
              styles={{th_bg:'#F9F9FB',th_ht:'30px',td_ht:'170px',td_pd:'15px 3.8px'}}
              tableProps={{split:'none'}}
            />
          </div>
        }
      />

      <div className="flex w-full bg-white p-30 rounded-14 gap-64 w-[1800px]">
        <div className="w-[300px]">
          <LaminationContents />
        </div>
        
        <div className="w-[550px]">
          <MessageContents />
        </div>

        <div className="w-[400px]">
          <ArrayContents />
        </div>

        <div className="w-[300px]">
          <CutSizeContents />
        </div>
      </div>

      <div className="v-h-center py-50 gap-15">
        <FullOkButton label="확정저장" click={()=>{}}/>
        <FullSubButton label="임시저장" click={()=>{}}/>
      </div>
    </div>
  )
}

SayangSampleAddPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="샘플-사양등록및현황"
    menu={[
      {text:'사양 및 생산의뢰 등록대기', link:'/sayang/sample/add'},
      {text:'사양 및 생산의뢰 등록현황', link:'/sayang/sample/situation'},
    ]}
  >{page}</MainPageLayout>
);

export default SayangSampleAddPage;