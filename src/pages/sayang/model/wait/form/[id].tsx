import type { MenuProps } from 'antd';
import { useEffect, useState } from "react";
import { Button, Dropdown, Space } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getAPI } from "@/api/get";

import EditButtonSmall from "@/components/Button/EditButtonSmall";
import NewModelContents from "@/contents/sayang/model/add/NewModelContents";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import InputList from "@/components/List/InputList";
import AntdInput from "@/components/Input/AntdInput";
import AntdTable from "@/components/List/AntdTable";
import AntdSelect from "@/components/Select/AntdSelect";
import { TabSmall } from "@/components/Tab/Tabs";
import AntdTableEdit from "@/components/List/AntdTableEdit";

import { modelSampleDataType, newModelSampleData } from "@/contents/sayang/model/add/AddModal";
import PopRegLayout from "@/layouts/Main/PopRegLayout";

import { ModelStatus } from "@/data/type/enum";
import { sayangModelWaitAddClmn } from "@/data/columns/Sayang";
import { modelsMatchRType, modelsType, orderModelType } from "@/data/type/sayang/models";
import { useBase } from '@/data/context/BaseContext';

import SearchIcon from "@/assets/svg/icons/s_search.svg";
import Hint from "@/assets/svg/icons/hint.svg";
import User from "@/assets/svg/icons/user_chk.svg";
import Category from "@/assets/svg/icons/category.svg";
import Back from "@/assets/svg/icons/back.svg";
import Edit from "@/assets/svg/icons/edit.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import dayjs from 'dayjs';
import AddDrawer from '@/contents/sayang/model/add/AddDrawer';

const SayangModelAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id:orderId } = router.query;
  
  const { 
    boardSelectList,
    metarialSelectList,
    surfaceSelectList,
    unitSelectList,
    vcutSelectList,
    outSelectList,
    smPrintSelectList,
    smColorSelectList,
    smTypeSelectList,
    mkPrintSelectList,
    mkColorSelectList,
    mkTypeSelectList,
    spPrintSelectList,
    spTypeSelectList,
  } = useBase();
  
  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [data, setData] = useState<orderModelType[]>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['sales-order/product/jsxcrud/many/by-order-idx', orderId],
    queryFn: async () => {
      try {
        //api/serv/core-d1/v1/tenant/sales-order/product/jsxcrud/many/by-order-idx/{orderIdx}
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: `sales-order/product/jsxcrud/many/by-order-idx/${orderId}`
        });
      } catch (e) {
        return;
      }
    },
    enabled: !!orderId,
  });
  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading && queryData?.resultCode === "OK_0000") {
      const arr = (queryData?.data.data ?? []).map((d:orderModelType, index:number) => ({
        ...d,
        index: (queryData?.data?.data?.length ?? 0) - index,
      }));

      setData(arr);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  const [selectTab, setSelectTab] = useState<number>(1);
  const [selectTabDrawer, setSelectTabDrawer] = useState<number>(1);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

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
        {data.map((model:orderModelType) => (
          <div className="flex flex-col gap-16" key={model.id}>
            <div className="w-full min-h-32 h-center border-1 border-line rounded-14">
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">발주명</p>
                <AntdInput 
                  value={model.order?.orderNm}
                  className="w-[180px!important]" readonly={true} styles={{ht:'32px', bg:'#F5F5F5'}}
                />
                <p className="h-center justify-end">관리번호 </p>
                <AntdInput 
                  value={model.prtOrderNo}
                  className="w-[180px!important]" styles={{ht:'32px', bg:'#F5F5F5'}} readonly={true}
                />
                <AntdSelect
                  options={[
                    {value:ModelStatus.NEW,label:'신규'},
                    {value:ModelStatus.REPEAT,label:'반복'},
                    {value:ModelStatus.MODIFY,label:'수정'},
                  ]}
                  value={model.modelStatus}
                  className="w-[54px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                />
              </div>
              <div className="w=[1px] h-full" style={{borderLeft:"0.3px solid #B9B9B9"}}/>
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">모델명 </p>
                <AntdInput
                  className="w-[180px!important]" styles={{ht:'32px'}}
                  value={model.orderTit}
                />
                <p className="h-center justify-end">원판 </p>
                <AntdSelect
                  options={boardSelectList}
                  value={model.model?.board?.id}
                  className="w-[125px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                />
                <p className="h-center justify-end">제조사 </p>
                <AntdInput 
                  value={model.model?.mnfNm}
                  className="w-[120px!important]" styles={{ht:'32px'}}
                />
                <p className="h-center justify-end">재질 </p>
                <AntdSelect
                  options={metarialSelectList}
                  value={model.model?.material?.id}
                  className="w-[155px!important]" styles={{ht:'36px', bw:'0px', pd:'0'}}
                />
              </div>
              <div className="w=[1px] h-full" style={{borderLeft:"0.3px solid #B9B9B9"}}/>
              <div className="h-full h-center gap-10 p-10">
                <p className="h-center justify-end">납기 </p>
                <p className="h-center justify-end">{
                  model.orderPrdDueDt ?
                  dayjs(model.orderPrdDueDt).format('YYYY-MM-DD') : null
                }</p>
              </div>
            </div>
            <div className="flex flex-col ">
              <AntdTable
                columns={sayangModelWaitAddClmn(
                  deleteModel,
                  surfaceSelectList,
                  unitSelectList,
                  vcutSelectList,
                  outSelectList,
                  smPrintSelectList,
                  smColorSelectList,
                  smTypeSelectList,
                  mkPrintSelectList,
                  mkColorSelectList,
                  mkTypeSelectList,
                  spPrintSelectList,
                  spTypeSelectList,
                )}
                data={[model]}
                styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
                tableProps={{split:'none'}}
                />
            </div>
            <div className="w-full h-32 flex justify-end gap-5">
            <FullOkButtonSmall click={()=>{}} label="확정저장" />
              <Button variant="outlined" color="primary">임시저장</Button>
            </div>
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

      <AddDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        handleDataChange={handleDataChange}
        selectTabDrawer={selectTabDrawer}
        setSelectTabDrawer={setSelectTabDrawer}
      />


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

      {/* <AntdDrawer
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
                  {name:'1',label:'고객명(고객코드)', type:'input'},
                  {name:'2',label:'고객발주(고객요구)명', type:'input'},
                  {name:'3',label:'고객 담당자명', type:'input'},
                  {name:'4',label:'전화번호', type:'input'},
                  {name:'5',label:'이메일', type:'input'},
                  {name:'6',label:'영업담당자명', type:'input'},
                  {name:'7',label:'접수일', type:'date'},
                  {name:'8',label:'발주(요청)일', type:'date'},
                ]}
                handleDataChange={handleDataChange}
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
                <AntdTableEdit
                  columns={[
                    {
                      title: '모델명',
                      dataIndex: 'prdNm',
                      key: 'prdNm',
                      align: 'center',
                    },
                    {
                      title: 'Rev No',
                      dataIndex: 'prdRevNo',
                      key: 'prdRevNo',
                      align: 'center',
                    },
                    {
                      title: '층/두께',
                      dataIndex: 'thk',
                      key: 'thk',
                      align: 'center',
                      render: (value, record:modelsRType) => (
                        <div className="w-full h-full v-h-center">
                          {record.layerEm} / {value}
                        </div>
                      )
                    },
                    {
                      title: '동박두께',
                      dataIndex: 'copOut',
                      key: 'copOut',
                      align: 'center',
                      render: (value, record:modelsRType) => (
                        <div className="w-full h-full v-h-center">
                          {value+'외'} / {record.copIn+'내'}
                        </div>
                      )
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
                        </Dropdown>
                      )
                    },
                  ]}
                  data={modelData}
                  styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px',}}
                />
              </div>
            </div>
          }
        </div>
      </AntdDrawer> */}
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