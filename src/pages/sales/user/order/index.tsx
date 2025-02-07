import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuProps } from "antd/lib";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Pagination, Radio, Steps } from "antd";
import { getAPI } from "@/api/get";

import AntdModal from "@/components/Modal/AntdModal";
import AntdTable from "@/components/List/AntdTable";
import AddOrderContents from "@/contents/sales/user/modal/AddOrderContents";
import AntdDrawer from "@/components/Drawer/AntdDrawer";
import { AntdModalStep2 } from "@/components/Modal/AntdModalStep";

import Excel from "@/assets/png/excel.png"
import Print from "@/assets/png/print.png"
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import MessageOn from "@/assets/svg/icons/s_inquiry.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";
import Edit from "@/assets/svg/icons/memo.svg";

import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { newDatasalesOrderCUType, salesOrderCUType, salesOrderRType } from "@/data/type/sales/order";
import { salesUserOrderClmn } from "@/data/columns/Sales";
import TitleSmall from "@/components/Text/TitleSmall";
import AntdSelect from "@/components/Select/AntdSelect";
import { getClientCsAPI } from "@/api/cache/client";
import { cuMngRType, cuRType } from "@/data/type/base/cu";
import AntdInput from "@/components/Input/AntdInput";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import { HotGrade } from "@/data/type/enum";
import { LabelIcon, LabelMedium, LabelThin } from "@/components/Text/Label";
import TextArea from "antd/lib/input/TextArea";
import AntdDragger from "@/components/Upload/AntdDragger";
import { useUser } from "@/data/context/UserContext";
import { postAPI } from "@/api/post";

const items: MenuProps['items'] = [
  {
    label: <span className="text-12">Excel</span>,
    key: '1',
    icon: <Image src={Excel} alt="Excel" width={16} height={16} />,
  },
  {
    label: <span className="text-12">Print</span>,
    key: '2',
    icon: <Image src={Print} alt="Print" width={16} height={16} />,
  },
]

const SalesUserPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [ open, setOpen ] = useState<boolean>(false);
  const [ drawerOpen, setDrawerOpen ] = useState<boolean>(false);
  const [ newOpen, setNewOpen ] = useState<boolean>(false);

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  const [ data, setData ] = useState<Array<salesOrderRType>>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['salesUserPage'],
    queryFn: async () => {
      return getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'sales-order/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });
    }
  });

  useEffect(()=>{
    if(!isLoading) {
      setData(queryData?.data.data ?? []);
      setTotalData(queryData?.data.total ?? 0);
    }
  }, [queryData]);

  const menuProps = {
    items,
    // onClick: handleMenuClick,
  };

  const [ stepCurrent, setStepCurrent ] = useState<number>(0);
  const [ stepItems, setStepItems ] = useState<any[]>([
    {title:'고객 발주 등록'}, 
    {title:'고객 발주 모델 등록'}, 
  ]);

  const [ formData, setFormData ] = useState<salesOrderCUType>(newDatasalesOrderCUType);
  const { me } = useUser();
  useEffect(()=>{
    setFormData({...formData, empId:me?.id??''});
  }, [me])
  useEffect(()=>{console.log(formData, me);},[formData]);

  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const [ csMngList, setCsMngList ] = useState<Array<cuMngRType>>([]);
  const { data:cs } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getClientCsAPI(),
  });
  
  useEffect(()=>{
    if(cs?.data.data?.length) {
      setCsList(cs.data.data.map((cs:cuRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data.data]);

  useEffect(()=>{
    if(formData.partnerId !== '' && cs?.data.data?.length) {
      const data = cs?.data.data as cuRType[];
      const mng = data.find((cu:cuRType) => cu.id === formData.partnerId)?.managers;
      setCsMngList(mng ?? []);
    }
  }, [formData.partnerId])

  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);

  useEffect(()=>{
    setFormData({ ...formData, files:fileIdList });
    console.log(fileList, fileIdList);
  }, [fileIdList]);

  const handleSubmit = async () => {
    console.log(JSON.stringify(formData));
    const result = await postAPI({
      type: 'core-d1',
      utype: 'tenant/',
      url: 'sales-order',
      jsx: 'default'},
      formData
    );

    if(result.resultCode === 'OK_0000') {
      console.log('ok');
      refetch();
    }
  }

  return (
    <>
      <div 
        className="w-full h-50 flex h-center justify-end px-60 pt-10 absolute top-0"
        onClick={()=>{setOpen(true)}}
      >
        <div className="w-80 h-30 rounded-6 bg-point1 text-white v-h-center cursor-pointer flex gap-4 z-20">
          <SplusIcon stroke="#FFF"className="w-16 h-16"/>
          <span>신규</span>
        </div>
      </div>
      <div className="flex w-full h-50 gap-20 justify-end items-center">
        <span>총 {totalData}건</span>
        <Pagination size="small" defaultCurrent={1} current={pagination.current} total={totalData} />
        <Dropdown menu={menuProps} trigger={['click']} placement="bottomCenter" getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}>
          <Button type="text" size="small" icon={<MoreOutlined />} style={{backgroundColor: "#E9EDF5"}}/>
        </Dropdown>
      </div>
      <div className="flex flex-col gap-20" style={{borderTop:' 1px solid rgba(0,0,0,6%)'}}>
        <AntdTable
          columns={salesUserOrderClmn(totalData, setOpen, setNewOpen)}
          data={data}
          styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
        />
        
        {/* <AntdModal
          open={open}
          setOpen={setOpen}
          width={1288}
          title={"고객발주 등록"}
          contents={<AddOrderContents setOpen={setOpen} />}
        /> */}

        <AntdModalStep2
          items={stepItems}
          current={stepCurrent}
          open={open}
          setOpen={setOpen}
          width={1300}
          contents={<>
            <div className="w-[1188px] min-h-[515px] flex flex-col p-30 gap-20 border-bdDefault border-[0.3px] rounded-14 bg-white">
              <LabelMedium label="고객발주 등록"/>
              <div className="w-full h-1 border-t-1"/>
              <div className="w-full h-[421px] h-center gap-30">
                <div className="flex flex-col w-[222px] h-full gap-24">
                  <div className="flex flex-col gap-8">
                    <LabelThin label="고객"/>
                    <AntdSelect 
                      options={csList}
                      value={formData.partnerId}
                      onChange={(e)=>{
                        const value = e+'';
                        setFormData({...formData, partnerId:value});
                      }}
                      styles={{ht:'36px'}}
                    />
                  </div>
                  <div className="flex flex-col gap-8">
                    <LabelThin label="총 수주 금액"/>
                    <AntdInput 
                      value={formData.orderName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({...formData, orderName:value});
                      }}
                      styles={{ht:'36px'}}
                      type="number"
                    />
                  </div>
                  <div className="flex flex-col gap-8">
                    <LabelThin label="발주일"/>
                    <AntdDatePicker
                      value={formData.orderDt}
                      onChange={(value)=>setFormData((prev => ({ ...prev, orderDt:value })))}
                      styles={{br:"2px",bc:"#D5D5D5"}}
                      className="w-full h-36"
                      suffixIcon={"cal"}
                    />
                  </div>
                  {/* <div className="flex flex-col gap-8">
                    <LabelThin label="납기요청일"/>
                    <AntdDatePicker
                      value={formData.orderRepDt}
                      onChange={(value)=>setFormData((prev => ({ ...prev, orderRepDt:value })))}
                      styles={{br:"2px",bc:"#D5D5D5"}}
                      className="w-full h-36"
                      suffixIcon={"cal"}
                    />
                  </div> */}
                  <div className="flex flex-col gap-8">
                    <LabelThin label="긴급상태"/>
                    <AntdSelect 
                      options={[
                        {value:HotGrade.SUPER_URGENT,label:'초긴급'},
                        {value:HotGrade.URGENT,label:'긴급'},
                        {value:HotGrade.NORMAL,label:'일반'},
                      ]}
                      value={formData.hotGrade}
                      onChange={(e)=>{
                        const value = e+'' as HotGrade;
                        setFormData({...formData, hotGrade:value});
                      }}
                      styles={{ht:'36px'}}
                    />
                  </div>
                </div>
                <div className="w-1 h-full border-r-1"/>
                <div className="flex-1 h-full flex flex-col gap-24">
                  <div className="flex flex-col gap-8">
                    <LabelThin label="고객발주 메일 내용"/>
                    <TextArea
                      value={formData.orderTxt}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({...formData, orderTxt:value});
                      }}
                      className="rounded-2"
                    />
                  </div>
                  <div className="flex flex-col gap-8">
                    <LabelThin label="첨부파일"/>
                    <div className="w-full h-[150px]">
                      <AntdDragger
                        fileList={fileList}
                        setFileList={setFileList}
                        fileIdList={fileIdList}
                        setFileIdList={setFileIdList}
                        mult={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[1188px] min-h-[333px] bg-white flex flex-col rounded-14 border-[0.3px] border-bdDefult mt-10 px-30 py-20 gap-10">
              <LabelMedium label="담당자 정보"/>
              <div className="w-full h-1 border-t-1"/>
              {
                csMngList.map((mng:cuMngRType) => (
                  <div className="w-full h-40 h-center gap-10" key={mng.id}>
                    <p className="w-100 h-center gap-8">
                      <Radio
                        name="csMng"
                        checked={formData.partnerManagerId === mng.id}
                        onChange={() => setFormData({...formData, partnerManagerId:mng.id})}
                      /> {mng.prtMngNm}
                    </p>
                    <div className="w-[200px] px-12">
                      <LabelIcon label={mng.prtMngDeptNm} icon={<MessageOn />}/>
                    </div>
                    <div className="w-[200px] px-12">
                      <LabelIcon label={mng.prtMngTel} icon={<Call />}/>
                    </div>
                    <div className="w-[200px] px-12">
                      <LabelIcon label={mng.prtMngMobile} icon={<Mobile />}/>
                    </div>
                    <div className="flex-1 px-12">
                      <LabelIcon label={mng.prtMngMobile} icon={<Mail />}/>
                    </div>
                    <div className="w-40 h-40 v-h-center">
                      <p className="w-24 h-24"><Edit /></p>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="w-full h-50 v-h-center">
              <div 
                className="w-100 h-40 cursor-pointer"
                onClick={handleSubmit}
              >
                저장
              </div>
            </div>
          </>}
        />

        <AntdDrawer
          open={drawerOpen}
          close={()=>{setDrawerOpen(false)}}
          maskClosable={false}
          mask={false}
        >
          <div>

          </div>
        </AntdDrawer>
      </div>
    </>
  )
};

SalesUserPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="고객발주/견적"
    menu={[
      { text: '고객발주', link: '/sales/user/order' },
      { text: '견적', link: '/sales/user/estimate' },
    ]}
  >{page}</MainPageLayout>
);

export default SalesUserPage;