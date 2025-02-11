import { SetStateAction, useEffect, useState } from "react";
import { Dropdown, MenuProps, Space } from "antd";

import AntdDrawer from "@/components/Drawer/AntdDrawer";
import AntdInput from "@/components/Input/AntdInput";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import InputList from "@/components/List/InputList";
import { TabSmall } from "@/components/Tab/Tabs";

import { modelsType } from "@/data/type/sayang/models";

import Edit from "@/assets/svg/icons/edit.svg";
import SearchIcon from "@/assets/svg/icons/s_search.svg";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";

interface Props {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  selectTabDrawer: number;
  setSelectTabDrawer: React.Dispatch<SetStateAction<number>>;
  handleDataChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => void;
}

const AddDrawer:React.FC<Props> = ({
  drawerOpen,
  setDrawerOpen,
  selectTabDrawer,
  setSelectTabDrawer,
  handleDataChange,
}) => {
  
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

  const [modelDataLoading, setModelDataLoading] = useState<boolean>(true);
  const [modelData, setModelData] = useState<modelsType[]>([]);
  const { data:modelQueryData, isLoading:modelQueryLoading, refetch:modelQueryRefetch } = useQuery({
    queryKey: ['models/jsxcrud/many'],
    queryFn: async () =>{
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: 'models/jsxcrud/many',
        });
      } catch (e) {
        console.log('models/jsxcrud/many Error : ', e);
        return;
      }
    }
  });

  useEffect(()=>{
    setModelDataLoading(true);
    if(!modelQueryLoading && modelQueryData?.resultCode === "OK_0000") {
      setModelData(modelQueryData?.data.data ?? []);
      setModelDataLoading(false);
    }
  }, [modelQueryData]);

  const [searchModel, setSearchModel] = useState<string>('');
  useEffect(()=>{
    setModelData(modelData.filter((f:modelsType) => f.prdNm.includes(searchModel)));
  }, [searchModel]);

  return (
    <>
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
                { !modelDataLoading &&
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
                        render: (value, record:modelsType) => (
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
                        render: (value, record:modelsType) => (
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
                  /> }
              </div>
            </div>
          }
        </div>
      </AntdDrawer>
    </>
  )
}

export default AddDrawer;