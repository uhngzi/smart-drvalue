import { SetStateAction, useEffect, useState } from "react";
import { Dropdown, MenuProps, Radio, Space } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import dayjs from "dayjs";

import AntdDrawer from "@/components/Drawer/AntdDrawer";
import AntdInput from "@/components/Input/AntdInput";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import CardList from "@/components/List/CardList";
import { TabSmall } from "@/components/Tab/Tabs";
import { LabelIcon } from "@/components/Text/Label";

import { modelsType, orderModelType } from "@/data/type/sayang/models";
import { salesOrderDetailRType } from "@/data/type/sales/order";

import Edit from "@/assets/svg/icons/edit.svg";
import SearchIcon from "@/assets/svg/icons/s_search.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import styled from "styled-components";
import FullChip from "@/components/Chip/FullChip";
import { HotGrade } from "@/data/type/enum";
import ModelDrawerContent from "./ModelDrawerContent";

interface Props {
  orderId: string | string[] | undefined;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  selectTabDrawer: number;
  setSelectTabDrawer: React.Dispatch<SetStateAction<number>>;
  products: orderModelType[];
  setProducts: React.Dispatch<SetStateAction<orderModelType[]>>;
  setNewFlag: React.Dispatch<SetStateAction<boolean>>;
  selectId: string | null;
  setSelectId: React.Dispatch<SetStateAction<string | null>>;
  modelData: modelsType[];
  setModelData: React.Dispatch<SetStateAction<modelsType[]>>;
  modelDataLoading: boolean;
}

const AddDrawer:React.FC<Props> = ({
  orderId,
  drawerOpen,
  setDrawerOpen,
  selectTabDrawer,
  setSelectTabDrawer,
  products,
  setProducts,
  setNewFlag,
  selectId,
  setSelectId,
  modelData,
  setModelData,
  modelDataLoading,
}) => {
  const items = (record: any): MenuProps['items'] => [
    {
      label: <>복사하여 새로 등록</>,
      key: 0,
      onClick:()=>{
        setAlertOpen(true);
        setSelectMenuKey(0);
        setSelectRecord(record);
      },
    },
    {
      label: <>그대로 등록</>,
      key: 1,
      onClick:()=>{
        setAlertOpen(true);
        setSelectMenuKey(1);
        setSelectRecord(record);
      }
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

  const [searchModel, setSearchModel] = useState<string>('');
  useEffect(()=>{
    setModelData(modelData.filter((f:modelsType) => f.prdNm.includes(searchModel)));
  }, [searchModel]);
  
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectMenuKey, setSelectMenuKey] = useState<number | null>(null);
  const [selectRecord, setSelectRecord] = useState<modelsType | null>(null);
  const handleSelectMenu = () => {
    if(selectMenuKey===0) setNewFlag(true);   // 복사하여 새로 등록
    else                  setNewFlag(false);  // 그대로 등록
    
    if(selectRecord !== null) {
      const newData = [...products];
      const index = newData.findIndex((item) => selectId === item.id);
      if (index > -1) {
        newData[index] = { ...newData[index], model:{ ...selectRecord }, editModel: { ...selectRecord } };
        setProducts(newData);
      }
      setAlertOpen(false);
      setDrawerOpen(false);
    }
  }
  
  return (
    <>
      <AntdDrawer
        open={drawerOpen}
        width={643}
        close={()=>{setDrawerOpen(false)}}
      >
        <div className="w-full px-20 py-30 flex flex-col gap-20">
          <TabSmall
            items={[
              {key:1,text:'고객발주(요구)정보'},
              {key:2,text:'모델목록'},
            ]}
            selectKey={selectTabDrawer}
            setSelectKey={setSelectTabDrawer}
          />
          { selectTabDrawer === 1 ?
            <ModelDrawerContent orderId={orderId} />
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
              <div className="">
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
                          <Dropdown trigger={['click']} menu={{ items:items(record) }}>
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

      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={"등록할 모델의 관리번호 선택"}
        contents={<div>
          <CustomRadioGroup size="large" className="flex gap-20">
          {
            products.map((p) => (
              <Radio.Button
                key={p.id}
                value={p.id}
                onClick={(e)=>{setSelectId(p.id)}}
                className="!rounded-20 [border-inline-start-width:1px]"
              >{p.prtOrderNo}</Radio.Button>
            ))
          }
          </CustomRadioGroup>
        </div>}
        type={'info'} 
        onCancle={()=>{
          setAlertOpen(false);
        }}
        onOk={()=>{
          handleSelectMenu();
        }}
        okText={'완료'}
        cancelText={'취소'}
      />
    </>
  )
}

const CustomRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper::before {
    display: none !important;
  }
`;

export default AddDrawer;