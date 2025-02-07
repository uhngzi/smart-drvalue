import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MenuProps } from "antd/lib";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Pagination, Radio, Steps, Table } from "antd";
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

import { newDataSalesOrderCUType, newDataSalesOrderProductCUType, salesOrderCUType, salesOrderProcuctCUType, salesOrderRType } from "@/data/type/sales/order";
import { salesUserOrderClmn } from "@/data/columns/Sales";
import TitleSmall from "@/components/Text/TitleSmall";
import AntdSelect from "@/components/Select/AntdSelect";
import { getClientCsAPI } from "@/api/cache/client";
import { partnerMngRType, partnerRType } from "@/data/type/base/partner";
import AntdInput from "@/components/Input/AntdInput";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import { HotGrade, ModelStatus } from "@/data/type/enum";
import { LabelIcon, LabelMedium, LabelThin } from "@/components/Text/Label";
import TextArea from "antd/lib/input/TextArea";
import AntdDragger from "@/components/Upload/AntdDragger";
import { useUser } from "@/data/context/UserContext";
import { postAPI } from "@/api/post";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import InputList from "@/components/List/InputList";
import { patchAPI } from "@/api/patch";
import dayjs from "dayjs";

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
  const [ newPrtOpen, setNewPrtOpen ] = useState<boolean>(false);
  const [ newPrtMngOpen, setNewPrtMngOpen ] = useState<boolean>(false);

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
  const [ newProducts, setNewProducts ] = useState<salesOrderProcuctCUType[]>([newDataSalesOrderProductCUType()]);
  useEffect(()=>{console.log(newProducts)}, [newProducts]);

  const [ partnerData, setPartnerData ] = useState<partnerRType | null>(null);
  const [ partnerMngData, setPartnerMngData ] = useState<partnerMngRType | null>(null);

  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => {
    if(type === "input" && typeof e !== "string") {
      const { value } = e.target;
      setPartnerData(prev => ({
        ...prev,
        [name]: value,
      } as partnerRType));
    } else if(type === "select") {
      if(key) {
        setPartnerData(prev => ({
          ...prev,
          [name]: {
            [key]: e.toString(),
          },
        } as partnerRType));
      } else {
        setPartnerData(prev => ({
          ...prev,
          [name]: e,
        } as partnerRType));
      }
    }
  }

  const handleProductDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    idx: number,
    key?: string,
  ) => {
    let value = e;
    if(type === "input" && typeof e !== "string") {
      value = e.target.value;
    }

    if(key) {
      setNewProducts((prev) =>
        prev.map((item, i) =>
          i === idx
            ? { ...item, [name]: {
              ...((item as any)[name] || {}), // 기존 객체 값 유지
              [key]: value, // 새로운 key 값 업데이트
            } }
            : item
        )
      );
    } else {
      setNewProducts((prev) =>
        prev.map((item, i) =>
          i === idx
            ? { ...item, [name]: value }
            : item
        )
      );
    }
  }

  const [ formData, setFormData ] = useState<salesOrderCUType>(newDataSalesOrderCUType);
  const { me } = useUser();
  useEffect(()=>{
    setFormData({...formData, empId:me?.id??''});
  }, [me])
  useEffect(()=>{console.log(formData, me);},[formData]);

  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const [ csMngList, setCsMngList ] = useState<Array<partnerMngRType>>([]);
  const { data:cs } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getClientCsAPI(),
  });
  
  useEffect(()=>{
    if(cs?.data.data?.length) {
      setCsList(cs.data.data.map((cs:partnerRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data.data]);

  useEffect(()=>{
    if(formData.partnerId !== '' && cs?.data.data?.length) {
      const data = cs?.data.data as partnerRType[];
      const mng = data.find((cu:partnerRType) => cu.id === formData.partnerId)?.managers;
      setCsMngList(mng ?? []);
    }
  }, [formData.partnerId])

  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);

  useEffect(()=>{
    setFormData({ ...formData, files:fileIdList });
    console.log(fileList, fileIdList);
  }, [fileIdList]);

  const handleNextStep = () => {
    setStepCurrent(1);
  }

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

  const handleSubmitPrtData = async () => {
    console.log(JSON.stringify(partnerData));
    const result = await patchAPI({
      type: 'baseinfo',
      utype: 'tenant/',
      url: 'biz-partner',
      jsx: 'jsxcrud'},
      partnerData?.id ?? '0',
      { ...partnerData, prtTypeEm: 'cs'}
    );
    console.log(result);
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
        <AntdTableEdit
          columns={salesUserOrderClmn(totalData, setDrawerOpen, setPartnerData, setPartnerMngData)}
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
          width={1800}
          contents={
          <div className="flex h-center gap-10">
            <div style={{width:stepCurrent>0?700:'100%'}} className="overflow-x-auto">
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
                  csMngList.map((mng:partnerMngRType) => (
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
              <div className="w-full h-50 v-between-h-center">
                <div 
                  className="w-100 h-40 cursor-pointer"
                  onClick={()=>{
                    setOpen(false);
                    setFormData(newDataSalesOrderCUType);
                  }}
                >
                  취소
                </div>
                {
                  stepCurrent < 1 ?
                  <div 
                    className="w-100 h-40 cursor-pointer"
                    onClick={handleNextStep}
                  >
                    저장
                  </div> : <></>
                }
              </div>
            </div>
            {
              stepCurrent > 0 ?
              <div className="flex-1 p-30 gap-20 border-bdDefault border-[0.3px] rounded-14 bg-white">
                <table>
                  <thead>
                    <tr>
                      <th>발주명</th>
                      <th>구분</th>
                      <th>층</th>
                      <th>두께</th>
                      <th>수량</th>
                      <th>납기일</th>
                      <th>견적단가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      newProducts.map((product:salesOrderProcuctCUType, index:number) => (
                        <tr key={index}>
                          <td>
                            <AntdInput />
                            {/* ...발주명 : orderNm... (현재 API가 모델 바깥에 발주명이 있어서 product 안에 넣어줘야 됨...) */}
                          </td>
                          <td>
                            <AntdSelect
                              value={product.modelStatus}
                              options={[
                                {value:ModelStatus.NEW,label:'신규'},
                                {value:ModelStatus.REPEAT,label:'반복'},
                                {value:ModelStatus.MODIFY,label:'수정'},
                              ]}
                              onChange={(e)=>handleProductDataChange(e, 'modelStatus', 'select', index)}
                            />
                          </td>
                          <td><AntdInput type="number" onChange={(e)=>handleProductDataChange(e, 'currPrdInfo', 'input', index, 'layer')}/></td>
                          <td><AntdInput type="number" onChange={(e)=>handleProductDataChange(e, 'currPrdInfo', 'input', index, 'thic')}/></td>
                          <td><AntdInput type="number" onChange={(e)=>handleProductDataChange(e, 'currPrdInfo', 'input', index, 'amount')}/></td>
                          <td>
                            <AntdDatePicker 
                              value={dayjs(product.orderDt)}
                              onChange={(e)=>{
                                const value = dayjs(e).format('YYYY-MM-DD');
                                handleProductDataChange(value, 'orderDt', 'date', index)
                              }}
                            />
                            {/* 이거 api에는 수주일인데 화면은 납기일임, 그리고 모델에 납기요청일 없음 */}
                          </td>
                          <td><AntdInput type="number" value={product.orderPrdPrice} onChange={(e)=>handleProductDataChange(e, 'currPrdInfo', 'input', index, 'amount')}/></td>
                          <td
                            onClick={()=>{
                              setNewProducts((prev) => prev.filter((_, idx) => idx !== index));
                            }}
                          >삭제</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <div
                  onClick={()=>{
                    setNewProducts([...newProducts, newDataSalesOrderProductCUType()]);
                  }}
                >
                  모델 추가
                </div>
              </div>
              :<></>
            }
          </div>}
        />

        <AntdDrawer
          open={drawerOpen}
          close={()=>{setDrawerOpen(false)}}
          maskClosable={false}
          mask={false}
        >
          <div onClick={()=>{setNewPrtOpen(true);}}>수정</div>
          <div>
            거래처명 : {partnerData?.prtNm ?? '-'}<br/>
            식별코드 : {partnerData?.prtRegCd ?? '-'}<br/>
            축약명 : {partnerData?.prtSnm ?? '-'}<br/>
            영문명 : {partnerData?.prtEngNm ?? '-'}<br/>
            영문 축약 : {partnerData?.prtEngSnm ?? '-'}<br/>
            사업자 : {partnerData?.prtRegNo ?? '-'}<br/>
            법인 : {partnerData?.prtCorpRegNo ?? '-'}<br/>
            업태 : {partnerData?.prtBizType ?? '-'}<br/>
            업종 : {partnerData?.prtBizCate ?? '-'}<br/>
            주소 : {partnerData?.prtAddr ?? '-'}<br/>
            주소세부 : {partnerData?.prtAddrDtl ?? '-'}<br/>
            대표 : {partnerData?.prtCeo ?? '-'}<br/>
            전화 : {partnerData?.prtTel ?? '-'}<br/>
            팩스 : {partnerData?.prtFax ?? '-'}<br/>
            이메일 : {partnerData?.prtEmail ?? '-'}<br/>
          </div>
          <div onClick={()=>{setNewPrtMngOpen(true);}}>수정</div>
          <div>
            담당자명 : {partnerMngData?.prtMngNm}<br/>
            부서 : {partnerMngData?.prtMngDeptNm}<br/>
            팀 : {partnerMngData?.prtMngTeamNm}<br/>
            전화 : {partnerMngData?.prtMngTel}<br/>
            휴대 : {partnerMngData?.prtMngMobile}<br/>
            이메일 : {partnerMngData?.prtMngEmail}<br/>
            팩스 : {partnerMngData?.prtMngFax}<br/>
          </div>
        </AntdDrawer>

        <AntdModal
          open={newPrtOpen}
          setOpen={setNewPrtOpen}
          width={760}
          contents={
            <>
              <InputList
                handleDataChange={handleDataChange}
                labelWidth={100}
                items={[
                  {value:partnerData?.prtNm,name:'prtNm',label:'거래처명', type:'input'},
                  {value:partnerData?.prtRegCd,name:'prtRegCd',label:'식별코드', type:'input'},
                  {value:partnerData?.prtSnm,name:'prtSnm',label:'축약명', type:'input'},
                  {value:partnerData?.prtEngNm,name:'prtEngNm',label:'영문명', type:'input'},
                  {value:partnerData?.prtEngSnm,name:'prtEngSnm',label:'영문축약', type:'input'},
                  {value:partnerData?.prtRegNo,name:'prtRegNo',label:'사업자', type:'input'},
                  {value:partnerData?.prtCorpRegNo,name:'prtCorpRegNo',label:'법인', type:'input'},
                  {value:partnerData?.prtBizType,name:'prtBizType',label:'업태', type:'input'},
                  {value:partnerData?.prtBizCate,name:'prtBizCate',label:'업종', type:'input'},
                  {value:partnerData?.prtAddr,name:'prtAddr',label:'주소', type:'input'},
                  {value:partnerData?.prtAddrDtl,name:'prtAddrDtl',label:'주소세부', type:'input'},
                  {value:partnerData?.prtCeo,name:'prtCeo',label:'대표', type:'input'},
                  {value:partnerData?.prtTel,name:'prtTel',label:'전화', type:'input'},
                  {value:partnerData?.prtFax,name:'prtFax',label:'팩스', type:'input'},
                  {value:partnerData?.prtEmail,name:'prtEmail',label:'메일', type:'input'},
                ]}
              />
              <div
                onClick={handleSubmitPrtData}
              >저장</div>
            </>
          }
        />

        <AntdModal
          open={newPrtMngOpen}
          setOpen={setNewPrtMngOpen}
          width={760}
          contents={
            <>
              
            </>
          }
        />
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