import MainPageLayout from "@/layouts/Main/MainPageLayout";
import BorderButton from "@/components/Button/BorderButton";
import EditButtonSmall from "@/components/Button/EditButtonSmall";
import ModelContents from "@/contents/sayang/model/add/ModelContents";

import { filterType } from "@/data/type/filter";
import { TabSmall } from "@/components/Tab/Tabs";

import SearchIcon from "@/assets/svg/icons/s_search.svg";
import Hint from "@/assets/svg/icons/hint.svg";
import User from "@/assets/svg/icons/user_chk.svg";
import Category from "@/assets/svg/icons/category.svg";
import Back from "@/assets/svg/icons/back.svg";
import Edit from "@/assets/svg/icons/edit.svg";

import { useEffect, useState } from "react";
import FilterRightTab from "@/layouts/Body/Grid/FilterRightTab";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import AntdDrawer from "@/components/Modal/AntdDrawer";
import InputList from "@/components/List/InputList";
import AntdInput from "@/components/Input/AntdInput";
import AntdTable from "@/components/List/AntdTable";
import { Dropdown, Space } from "antd";
import type { MenuProps } from 'antd';

const items: MenuProps['items'] = [
  {
    label: <>복사하여 새로 등록</>,
    key: 0,
  },
  {
    label: <>그대로 등록</>,
    key: 1,
  },
]

type DataType = {
  id: number;
  cuNm: string;
  no: string;
  modelNm: string;
  rev: string;
  cuCode: string;
  layer: string;
  thic: string;
  unit: string;
  wonpan: string;
  makeNm: string;
  texture: string;
  surf: string;
  dongbackO: string;
  donbackI: string;
  smprint: string;
  smcolor: string;
  smtype: string;
  mkprint: string;
  mkcolor: string;
  mktype: string;
  tprintstate: string;
  tprinttype: string;
  outtype: string;
  vcut: number | null;
  doNum: string;
  pmNum: string;
  pcsX: string;
  pcsY: string;
  kitX: string;
  kitY: string;
  pnlX: string;
  pnlY: string;
  kitArX: string;
  kitArY: string;
  pnlArX: string;
  pnlArY: string;
  kit_pcs: string;
  pnl_kit: string;
  sth_pnl: string;
  sth_pcs: string;
  dogeumP: string;
  dogeumM: string;
  dogeumNiP: string;
  dogeumNiM: string;
  dogeumAuP: string;
  dogeumAuM: string;
  pin: string;
}
const newData = (id:number) => {
  return {
    id: id,
    cuNm: '',
    no: '',
    modelNm: '',
    rev: '',
    cuCode: '',
    layer: '',
    thic: '',
    unit: '',
    wonpan: '',
    makeNm: '',
    texture: '',
    surf: '',
    dongbackO: '',
    donbackI: '',
    smprint: '',
    smcolor: '',
    smtype: '',
    mkprint: '',
    mkcolor: '',
    mktype: '',
    tprintstate: '',
    tprinttype: '',
    outtype: '',
    vcut: 0,
    doNum: '',
    pmNum: '',
    pcsX: '',
    pcsY: '',
    kitX: '',
    kitY: '',
    pnlX: '',
    pnlY: '',
    kitArX: '',
    kitArY: '',
    pnlArX: '',
    pnlArY: '',
    kit_pcs: '',
    pnl_kit: '',
    sth_pnl: '',
    sth_pcs: '',
    dogeumP: '',
    dogeumM: '',
    dogeumNiP: '',
    dogeumNiM: '',
    dogeumAuP: '',
    dogeumAuM: '',
    pin: '',
  }
}

const SayangModelAddPage: React.FC & {
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

  const [selectTab, setSelectTab] = useState<number>(1);
  const [selectTabDrawer, setSelectTabDrawer] = useState<number>(1);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  const [data, setData] = useState([
    {
      id:1,
      modelNm: '모델1',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
    {
      id:2,
      modelNm: '모델2',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
    {
      id:3,
      modelNm: '모델3',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
    {
      id:4,
      modelNm: '모델4',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
  ]);
  const [filterModel, setFilterModel] = useState([
    {
      id:1,
      modelNm: '모델1',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
    {
      id:2,
      modelNm: '모델2',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
    {
      id:3,
      modelNm: '모델3',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
    {
      id:4,
      modelNm: '모델4',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
  ])
  const [searchModel, setSearchModel] = useState<string>('');
  useEffect(()=>{
    setFilterModel(data.filter((f:any) => f.modelNm.includes(searchModel)));
  }, [searchModel])

  const [model, setModel] = useState<Array<DataType>>([]);
  const [modelNew, setModelNew] = useState<DataType>(newData(model.length));
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    name: string,
    type: 'one' | 'mult',
  ) => {
    const { value } = e.target;
    if(type === 'one')
      setModelNew(prev => ({ ...prev, [name]: value }));
    else {

    }
  };
  useEffect(()=>{
    console.log(model);
  },[model])
  
  return (
    <>
      <FilterRightTab
        filter={filter}
        setFilter={setFilter}
        filterTitle={"모델 등록"}
        filterBtn={
          <BorderButton
            label={<><p className="w-18 h-18 text-point1 mr-5"><SearchIcon /></p><p className="text-point1">모델추가</p></>}
            click={()=>{}}
            styles={{bc:'#4880FF'}}
          />
        }

        main={
          <div 
            className="v-h-center gap-20"
            style={{minWidth:model.length > 0?"2050px":"1022px"}}
          >
            <div className="w-[1022px] h-[915px] border-1 border-line rounded-14 p-20 flex flex-col h-full gap-17 mx-20">
              <div className="h-95 flex flex-col gap-17">
                <div className="w-full min-h-32 h-center justify-between">
                  <p className="text-16 font-semibold">모델등록</p>
                  <div className="w-96 h-32 px-15 h-center justify-between text-14 border-1 border-bdDefault rounded-6 mr-20">
                    <p className="min-w-16 min-h-16 text-[#FE5C73]"><Back stroke={'#FE5C73'} /></p>
                    초기화
                  </div>
                </div>
                <div className="min-h-46 h-center gap-5 text-point1 border-b-1 border-line">
                  <p className="w-20 h-20"><Hint /></p>
                  <p>기존 사양 모델 등록에 매칭됩니다.</p>
                </div>
              </div>
              <div className="flex min-w-[982px]">
                <ModelContents item={modelNew} handleInputChange={handleInputChange} type={'one'}/>
              </div>
              <div className="w-full h-center justify-end">
                <FullOkButtonSmall
                  click={()=>{
                    setModel(((prev) => [...prev, modelNew]));
                    setModelNew(newData(model.length+1));
                  }}
                  label="저장"
                />
              </div>
            </div>
            {model.length > 0 ?
            <div className="w-[1022px] h-[915px] border-1 border-line rounded-14 p-20 mr-20 flex flex-col h-full gap-17 bg-back2">
              <div className="h-95 flex flex-col gap-17">
                <div className="w-full min-h-32 h-center justify-between">
                  <p className="text-16 font-semibold">모델등록중</p>
                  <EditButtonSmall label="수정" click={()=>{}} />
                </div>
                <TabSmall
                  items={model.map(i=>({
                    key:i.id,
                    text:i.modelNm
                  }))}
                  selectKey={selectTab}
                  setSelectKey={setSelectTab}
                />
              </div>
              <div className="flex min-w-[982px]">
                <ModelContents item={model[selectTab]} handleInputChange={handleInputChange} type={'mult'}/>
              </div>
              <div className="w-full h-center justify-end">
                <FullOkButtonSmall
                  click={()=>{}}
                  label="저장"
                />
              </div>
            </div>
            :
            <></>}
          </div>
        }

        tab={<>
          <div 
            className="cursor-pointer rounded-6 bg-back w-45 h-45 v-h-center"
            onClick={()=>{
              setSelectTabDrawer(1);
              setDrawerOpen(true)
            }}
          >
            <p className="w-20 h-20"><User /></p>
          </div>
          <div 
            className="cursor-pointer rounded-6 bg-back w-45 h-45 v-h-center"
            onClick={()=>{
              setSelectTabDrawer(2);
              setDrawerOpen(true);
            }}
          >
            <p className="w-20 h-20"><Category /></p>
          </div>
        </>}
      />

      <AntdDrawer
        open={drawerOpen}
        close={()=>{setDrawerOpen(false)}}
      >
        <div className="w-full h-full px-20 py-30 flex flex-col gap-20">
          <TabSmall
            items={[
              {key:1,text:'고객발주(요구)정보'},
              {key:2,text:'모델목록'},
            ]}
            selectKey={selectTabDrawer}
            setSelectKey={setSelectTabDrawer}
          />
          { selectTabDrawer === 1 ?
            <>
              <InputList
                labelWidth={150}
                gap={24}
                items={[
                  {label:'고객명(고객코드)', type:'input'},
                  {label:'고객발주(고객요구)명', type:'input'},
                  {label:'고객 담당자명', type:'input'},
                  {label:'전화번호', type:'input'},
                  {label:'이메일', type:'input'},
                  {label:'영업담당자명', type:'input'},
                  {label:'접수일', type:'date',value:null,change:()=>{}},
                  {label:'발주(요청)일', type:'date',value:null,change:()=>{}},
                ]}
              />
              <div className="w-full h-36 gap-5 flex mt-4">
                <p 
                  className="ml-10 h-center justify-end text-14"
                  style={{width:150}}
                >고객요구내용 :</p>
                <div
                  style={{width:'calc(100% - 150px)'}}
                >
                  <textarea
                    className="border-1 border-line outline-none w-full min-h-55"
                  />
                </div>
              </div>
            </>
            :
            <div className="flex flex-col gap-20">
              <div className="flex h-70 py-20 border-b-1 border-line">
                <AntdInput value={searchModel} onChange={(e)=>setSearchModel(e.target.value)}/>
                <div
                  className="w-38 h-32 border-1 border-line v-h-center border-l-0 cursor-pointer"
                  onClick={()=>{}}
                >
                  <p className="w-16 h-16 text-[#2D2D2D45]"><SearchIcon /></p>
                </div>
              </div>
              <div>
                <AntdTable
                  columns={[
                    {
                      title: '모델명',
                      dataIndex: 'modelNm',
                      key: 'modelNm',
                      align: 'center',
                    },
                    {
                      title: 'Rev No',
                      dataIndex: 'rev',
                      key: 'rev',
                      align: 'center',
                    },
                    {
                      title: '층/두께',
                      dataIndex: 'layer',
                      key: 'layer',
                      align: 'center',
                      render: (value, record) => (
                        <div className="w-full h-full">
                          {value} / {record.thic}
                        </div>
                      )
                    },
                    {
                      title: '동박두께',
                      dataIndex: 'dongback',
                      key: 'dongback',
                      align: 'center',
                    },
                    {
                      title: '',
                      dataIndex: 'id',
                      key: 'id',
                      align: 'center',
                      render: (value, record) => (
                        <Dropdown trigger={['click']} menu={{ items }}>
                          <a onClick={(e) => e.preventDefault()}>
                            <Space>
                              <div 
                                className="w-full h-full v-h-center cursor-pointer"
                                onClick={()=>{}}
                              >
                                <p className="w-12 h-12 v-h-center"><Edit /></p>
                              </div>
                            </Space>
                          </a>
                          {/* <div 
                            className="w-full h-full v-h-center cursor-pointer"
                            onClick={()=>{}}
                          >
                            <p className="w-12 h-12 v-h-center"><Edit /></p>
                          </div> */}
                        </Dropdown>
                      )
                    },
                  ]}
                  data={filterModel}
                  styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px',}}
                />
              </div>
            </div>
          }
        </div>
      </AntdDrawer>
    </>
  )
}

SayangModelAddPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="모델 등록 및 현황"
    menu={[
      {text:'모델 등록 대기', link:'/sayang/model/wait'},
      {text:'모델 등록 현황', link:'/sayang/model/situation'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangModelAddPage;