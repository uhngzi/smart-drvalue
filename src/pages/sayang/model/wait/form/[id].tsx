import MainPageLayout from "@/layouts/Main/MainPageLayout";
import FilterRightTab from "@/layouts/Body/Grid/FilterRightTab";
import BorderButton from "@/components/Button/BorderButton";
import EditButtonSmall from "@/components/Button/EditButtonSmall";
import NewModelContents from "@/contents/sayang/model/add/NewModelContents";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import InputList from "@/components/List/InputList";
import AntdInput from "@/components/Input/AntdInput";
import AntdTable from "@/components/List/AntdTable";

import { filterType } from "@/data/type/filter";
import { TabSmall } from "@/components/Tab/Tabs";

import SearchIcon from "@/assets/svg/icons/s_search.svg";
import Hint from "@/assets/svg/icons/hint.svg";
import User from "@/assets/svg/icons/user_chk.svg";
import Category from "@/assets/svg/icons/category.svg";
import Back from "@/assets/svg/icons/back.svg";
import Edit from "@/assets/svg/icons/edit.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";

import { useEffect, useState } from "react";
import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from 'antd';
import { modelSampleDataType, newModelSampleData } from "@/contents/sayang/model/add/AddModal";
import PopRegLayout from "@/layouts/Main/PopRegLayout";
import AntdSelect from "@/components/Select/AntdSelect";
import { sayangModelWaitAddClmn, sayangSampleWaitAddClmn } from "@/data/columns/Sayang";
import CardList from "@/components/List/CardList";
import { MOCK } from "@/utils/Mock";
import { LabelIcon } from "@/components/Text/Label";

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
  const MockItem = MOCK.modelOrderInfo
  const [selectTab, setSelectTab] = useState<number>(1);
  const [selectTabDrawer, setSelectTabDrawer] = useState<number>(1);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  const [data, setData] = useState([
    {
      id:4,
      modelNm: '모델4',
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
      id:2,
      modelNm: '모델2',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
    {
      id:1,
      modelNm: '모델1',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
  ]);
  const [filterModel, setFilterModel] = useState([
    {
      id:4,
      modelNm: '모델4',
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
      id:2,
      modelNm: '모델2',
      rev: 'RevNO',
      layer: 1,
      thic: 1.6,
      dongback: 1,
    },
    {
      id:1,
      modelNm: '모델1',
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

  const [model, setModel] = useState<Array<modelSampleDataType>>([]);
  const [modelNew, setModelNew] = useState<modelSampleDataType>(newModelSampleData(model.length));
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    name: string,
    type: 'one' | 'mult',
  ) => {
    const { value } = e.target;
    if(type === 'one')
      setModelNew((prev:modelSampleDataType) => ({ ...prev, [name]: value }));
    else {

    }
  };
  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    key?: string
  ) => {
    if(typeof e === "string") {
      const parsedDate = new Date(e);
      console.log(e, parsedDate);
    } else {
      const { value } = e.target;
      console.log(value);
    }
  }

  //임시 함수
  function deleteModel(idx: number) {
    setData(data.filter((f:any) => f.id !== idx));
  }
  
  return (
    <>
      <div 
        className="gap-20 flex"
        style={{minWidth:model.length > 0?"2050px":"1022px"}}
      >
        <div className="border-1 bg-white  border-line rounded-14 p-20 flex flex-col overflow-auto gap-40" style={{width:'calc(100% - 100px)', height:'calc(100vh - 192px)'}}>
        {data.map((model:any) => (
          <div className="flex flex-col gap-16" key={model.id}>
            <div className="w-full min-h-32 h-center border-1 border-line rounded-14">
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">발주명 </p>
                <AntdInput className="w-[180px!important]" readonly={true} styles={{ht:'32px', bg:'#F5F5F5'}} />
                <AntdSelect options={[{value:1,label:'신규'},{value:2,label:'?'}]} className="w-[54px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}/>
              </div>
              <div className="w=[1px] h-full" style={{borderLeft:"0.3px solid #B9B9B9"}}/>
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">모델명 </p>
                <AntdInput className="w-[180px!important]" styles={{ht:'32px'}} />
                <p className="h-center justify-end">관리번호 </p>
                <AntdInput className="w-[180px!important]" styles={{ht:'32px'}} />
                <p className="h-center justify-end">원판 </p>
                <AntdSelect options={[{value:1,label:'1220 x 1020(J)'},{value:2,label:'?'}]} className="w-[125px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}/>
                <p className="h-center justify-end">제조사 </p>
                <AntdInput className="w-[120px!important]" styles={{ht:'32px'}} />
                <p className="h-center justify-end">재질 </p>
                <AntdSelect options={[{value:1,label:'FR-4(DS-7402)'},{value:2,label:'?'}]} className="w-[155px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}/>
              </div>
              <div className="w=[1px] h-full" style={{borderLeft:"0.3px solid #B9B9B9"}}/>
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">납기 </p>
                <p className="h-center justify-end">2024-09-23</p>
              </div>
            </div>
            <div className="flex flex-col ">
              <AntdTable
                columns={sayangModelWaitAddClmn(deleteModel)}
                data={[model]}
                styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
                tableProps={{split:'none'}}
                />
            </div>
            <div className="w-full h-32 flex justify-end gap-5">
            <FullOkButtonSmall click={()=>{}} label="확정저장" />
              <Button variant="outlined" color="primary">임시저장</Button>
            </div>
            {/* <div className="min-h-46 h-center gap-5 text-point1 border-b-1 border-line">
              <p className="w-20 h-20"><Hint /></p>
              <p>기존 사양 모델 등록에 매칭됩니다.</p>
              </div> */}
          </div>
        ))}
          {/* <div className="flex min-w-[982px]">
            <NewModelContents item={modelNew} handleInputChange={handleInputChange} type={'one'}/>
          </div> */}
          
          {/* <div className="w-full h-center justify-end">
            <FullOkButtonSmall
              click={()=>{
                setModel(((prev) => [...prev, modelNew]));
                setModelNew(newModelSampleData(model.length+1));
              }}
              label="저장"
            />
          </div> */}
        </div>
        <div className=" min-w-[80px] w-[3%] px-10 py-20 h-center flex-col bg-white rounded-l-14 gap-20" style={{height:'calc(100vh - 192px)'}} key="contents-tab">
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
        </div>
        {model.length > 0 ?
        <div className="w-[1022px] h-[915px] border-1 border-line rounded-14 p-20 mr-20 flex flex-col h-full gap-17 bg-back2">
          <div className="h-95 flex flex-col gap-17">
            <div className="w-full min-h-32 v-between-h-center">
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
            <NewModelContents item={model[selectTab]} handleInputChange={handleInputChange} type={'mult'}/>
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
      {/* <FilterRightTab
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
                <div className="w-full min-h-32 v-between-h-center">
                  <p className="text-16 font-semibold">모델등록</p>
                  <div className="w-96 h-32 px-15 v-between-h-center text-14 border-1 border-bdDefault rounded-6 mr-20">
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
                    setModelNew(newModelSampleData(model.length+1));
                  }}
                  label="저장"
                />
              </div>
            </div>
            {model.length > 0 ?
            <div className="w-[1022px] h-[915px] border-1 border-line rounded-14 p-20 mr-20 flex flex-col h-full gap-17 bg-back2">
              <div className="h-95 flex flex-col gap-17">
                <div className="w-full min-h-32 v-between-h-center">
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
      /> */}

      

      <AntdDrawer
        open={drawerOpen}
        width={610}
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
              <CardList items={MockItem} title="" btnLabel="" btnClick={()=>{}} />
              <CardList items={[]} title="" btnLabel="" btnClick={()=>{}}>
                <div className="flex flex-col gap-10">
                  <div className="w-full text-16 font-medium" >담당자 정보</div>
                  <div className="w-full" style={{borderBottom:'1px solid #d9d9d9'}}/>
                  <p className="">홍길동(사업관리부)</p>
                  <div className="w-full h-40 h-center gap-10">
                    <div className="w-[200px]">
                      <LabelIcon label="031-123-1234" icon={<Call />}/>
                    </div>
                    <div className="w-[200px]">
                      <LabelIcon label="010-1234-5678" icon={<Mobile />}/>
                    </div>
                    <div className="flex-1">
                      <LabelIcon label="test@gmail.com" icon={<Mail />}/>
                    </div>
                  </div>

                </div>
              </CardList>
              <CardList items={[]} title="" btnLabel="" btnClick={()=>{}}>
                <div className="flex flex-col gap-10">
                  <div className="w-full text-16 font-medium" >등록된 고객발주 모델</div>
                  <div className="w-full" style={{borderBottom:'1px solid #d9d9d9'}}/>
                  <table>
                    <colgroup>
                      <col style={{width:'auto'}}/>
                      <col style={{width:'5%'}}/>
                      <col style={{width:'10%'}}/>
                      <col style={{width:'10%'}}/>
                      <col style={{width:'20%'}}/>
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="text-left font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>발주 모델명</th>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>층</th>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>두께</th>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>수량</th>
                        <th className="text-left font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>납기일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK.regOrderModel.map((m, idx) => (
                        <tr key={idx}>
                          <td className="py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.name}</td>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.layer}</td>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.thic}</td>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.cnt}</td>
                          <td className="py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.dueDt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardList>
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
  <PopRegLayout 
    menuTitle="모델 등록 및 현황"
    subTitle="모델등록"
    menu={[]}
  >{page}</PopRegLayout>
)

export default SayangModelAddPage;