import { SetStateAction, useEffect, useState } from "react";
import { Dropdown, MenuProps, Space } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import dayjs from "dayjs";

import AntdDrawer from "@/components/Drawer/AntdDrawer";
import AntdInput from "@/components/Input/AntdInput";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import CardList from "@/components/List/CardList";
import { TabSmall } from "@/components/Tab/Tabs";
import { LabelIcon } from "@/components/Text/Label";

import { modelsType } from "@/data/type/sayang/models";
import { salesOrderDetailRType } from "@/data/type/sales/order";

import Edit from "@/assets/svg/icons/edit.svg";
import SearchIcon from "@/assets/svg/icons/s_search.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";


interface Props {
  orderId: string | string[] | undefined;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  selectTabDrawer: number;
  setSelectTabDrawer: React.Dispatch<SetStateAction<number>>;
}

const AddDrawer:React.FC<Props> = ({
  orderId,
  drawerOpen,
  setDrawerOpen,
  selectTabDrawer,
  setSelectTabDrawer,
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
  
  const [orderDataLoading, setOrderDataLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<salesOrderDetailRType | null>(null);
  const { data:orderQueryData, isLoading:orderQueryLoading, refetch:orderQueryRefetch } = useQuery({
    queryKey: ['sales-order/detail/jsxcrud/one'],
    queryFn: async () =>{
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: `sales-order/detail/jsxcrud/one/${orderId}`,
        });
      } catch (e) {
        console.log('models/jsxcrud/many Error : ', e);
        return;
      }
    }
  });
  useEffect(()=>{
    setOrderDataLoading(true);
    if(!orderQueryLoading && orderQueryData?.resultCode === "OK_0000") {
      console.log('order : ', orderQueryData.data.data);
      setOrderData(orderQueryData?.data.data ?? null);
      setOrderDataLoading(false);
    }
  }, [orderQueryData]);

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
        width={643}
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
            !orderDataLoading &&
            <>
              <CardList 
                items={[
                  {label: '거래처명/거래처코드', value: orderData?.prtInfo?.prt?.prtNm+'/'+orderData?.prtInfo?.prt?.prtRegCd, widthType: 'half'},
                  {label: '발주일', value: dayjs(orderData?.orderDt).format('YYYY-MM-DD'), widthType: 'half'},
                  {label: '고객발주명', value: orderData?.orderNm, widthType: 'full'},
                  {label: '발주내용', value: orderData?.orderTxt, widthType: 'full'},
                ]}
                title="" btnLabel="" btnClick={()=>{}}
              />
              <CardList items={[]} title="" btnLabel="" btnClick={()=>{}}>
                <div className="flex flex-col gap-10">
                  <div className="w-full text-16 font-medium" >담당자 정보</div>
                  <div className="w-full" style={{borderBottom:'1px solid #d9d9d9'}}/>
                  <p className="">{orderData?.prtInfo.mng.prtMngNm}</p>
                  <div className="w-full h-40 h-center gap-10">
                    <div className="w-[200px]">
                      <LabelIcon label={orderData?.prtInfo.mng.prtMngTel ?? ''} icon={<Call />}/>
                    </div>
                    <div className="w-[200px]">
                      <LabelIcon label={orderData?.prtInfo.mng.prtMngMobile ?? ''} icon={<Mobile />}/>
                    </div>
                    <div className="flex-1">
                      <LabelIcon label={orderData?.prtInfo.mng.prtMngEmail ?? ''} icon={<Mail />}/>
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
                      <col style={{width:'auto'}}/>
                      <col style={{width:'7%'}}/>
                      <col style={{width:'10%'}}/>
                      <col style={{width:'10%'}}/>
                      <col style={{width:'17%'}}/>
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>발주 모델명</th>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>관리번호</th>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>층</th>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>두께</th>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>수량</th>
                        <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>납기일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(orderData?.products ?? []).map((m, idx) => (
                        <tr key={idx}>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.orderTit}</td>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.prtOrderNo}</td>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{JSON.parse(m.currPrdInfo)?.layer}</td>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{JSON.parse(m.currPrdInfo)?.thic}</td>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.orderPrdCnt}</td>
                          <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.orderPrdDueDt ? dayjs(m.orderPrdDueDt).format('YYYY-MM-DD') : null}</td>
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