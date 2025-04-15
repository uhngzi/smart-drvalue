import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { newDataProcessVendorCUType, processGroupRType, processRType, processVendorCUType, processVendorRType } from "@/data/type/base/process";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import { partnerRType } from "@/data/type/base/partner";
import { treeType } from "@/data/type/componentStyles";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { Button, Checkbox, CheckboxChangeEvent, Dropdown, Input, Spin } from "antd";

import dayjs from "dayjs";
import useToast from "@/utils/useToast";


import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Search from "@/assets/svg/icons/s_search.svg";
import Bag from "@/assets/svg/icons/bag.svg";
import { MoreOutlined } from "@ant-design/icons";
import { deleteAPI } from "@/api/delete";
import CustomTreeSelect from "@/components/Tree/CustomTreeSelect";

const WkProcessVendorListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const {showToast, ToastContainer} = useToast();

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  // --------- 필요 데이터 시작 ----------


  const [ treeData, setTreeData ] = useState<treeType[]>([]);
  const { data:queryTreeData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'process', pagination.current],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'process-group/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data?.data ?? []).map((group:processGroupRType) => ({
          id: group.id,
          label: group.prcGrpNm,
          children: group.processes.map((process:processRType) => ({
            id: process.id,
            label: process.prcNm,
          })),
          open: true,
        }));
        setTreeData(arr);
      } else {
        console.log('error:', result.response);
      }
      console.log(result.data);
      return result;
    },
  });

  const [ dataVendor, setDataVendor ] = useState<Array<partnerRType>>([]);
  const [vendorSch, setVendorSch] = useState<string>('');
  const { data:queryDataVendor, isLoading: vendorLoading, refetch: vendorRefetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'client', 'vndr', pagination.current],
    queryFn: async () => {
      setDataVendor([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        s_query: [{key: "prtTypeEm", oper: "eq", value: "vndr"},{key: "prtNm", oper: "startsL", value: vendorSch}]
      });

      if (result.resultCode === 'OK_0000') {
        setDataVendor(result.data?.data ?? []);
        setTotalData(result.data.total ?? 0);
        console.log('vendor : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });

  const [ dataGroup, setDataGroup ] = useState<Array<processGroupRType>>([]);
  const { data:queryDataGroup } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['process-group/jsxcrud/many'],
    queryFn: async () => {
      setDataGroup([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setDataGroup(result.data?.data ?? []);
        console.log('group : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      };
      return result;
    },
  });

  const [ dataProcess, setDataProcess ] = useState<Array<processRType>>([]);
  const { data:queryDataProcess } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['process/jsxcrud/many'],
    queryFn: async () => {
      setDataProcess([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setDataProcess(result.data?.data ?? []);
        console.log('process : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });
  // ---------- 필요 데이터 끝 -----------

  // --------- 리스트 데이터 시작 ---------
  const [ data, setData ] = useState<Array<any>>([]);
  const [childCheckId, setChildCheckId] = useState<string | null>(null);
  useEffect(() => {
    if (childCheckId == null) {
      setData([]);
    }
  },[childCheckId]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['processVendor', pagination.current, childCheckId],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: `process-vendor/jsxcrud/many`
      },{
        s_query: childCheckId ? { "process.id": { "$eq": childCheckId } } : undefined
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        console.log('data : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      setDataLoading(false);
      return result;
    },
    enabled: !!childCheckId, // childCheckId가 있을 때만 쿼리 실행
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
    // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');
    //등록 모달창을 위한 변수
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
    //등록 모달창 데이터
  const [ newData, setNewData ] = useState<any[]>([]);
    //값 변경 함수
  const [deleteData, setDeleteData] = useState<string[]>([]); // 삭제할 데이터
  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => {
    if(type === "input" && typeof e !== "string") {
      const { value } = e.target;
      setNewData({...newData, [name]: value});
    } else if(type === "select") {
      if(key) {
        setNewData({...newData, [name]: { 
          ...((newData as any)[name] || {}), // 기존 객체 값 유지
          [key]: e?.toString(), // 새로운 key 값 업데이트
        }});
      } else {
        setNewData({...newData, [name]: e});
      }
    }
  }
    //등록 버튼 함수
  const handleSubmitNewData = async () => {
    try {
      console.log(newData);
      const result = await postAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'process-vendor',
        jsx: 'jsxcrud'
      }, newData);
      console.log(result);

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultOpen(true);
        setResultType('success');
        setNewData([]);
      } else {
        setNewOpen(false);
        setResultOpen(true);
        setResultType('error');
      }
    } catch(e) {
      setNewOpen(false);
      setResultOpen(true);
      setResultType('error');
    }
  }
  // ----------- 신규 데이터 끝 -----------

  const handleCheck = (e: CheckboxChangeEvent) => {
  }

  
  function handleSelect(id: string) {
    const selectId = id;
    setChildCheckId(prev => prev === selectId ? null : selectId);
  }
  
  function addVendor(record: partnerRType) {
      if(data.find(item => item.vendor.id === record.id)) {
        showToast('이미 등록된 공급처입니다.', 'error');
        return;
      }
      const newId = `new${Math.random()}`;
      const group = dataGroup.find(group => group.processes?.some(proc => proc.id === childCheckId));
      const newData = {
        id: newId,
        process: {id: childCheckId},
        processGroup: {id: group?.id ?? ''},
        vendor: {id: record.id ?? ''},
        ordNo:0,
        useYn: true,
      }
      const renderAddData = {
        id: newId,
        processGroup: {id: group?.id ?? '', prcGrpNm: group?.prcGrpNm ?? ''},
        process : {id: childCheckId, prcNm: group?.processes?.find(proc => proc.id === childCheckId)?.prcNm ?? ''},
        vendor : {id: record.id, prtNm: record.prtNm},
        createdAt: dayjs().format('YYYY-MM-DD'),
        useYn: true,
      }
      console.log(newData);
      setNewData((prev:any) => [...prev, newData]);
      setData(prev => ([renderAddData, ...prev]))
  }

  async function vendorSave(){
    console.log(newData)
    console.log(deleteData)
    let flag = false;
    if(deleteData.length > 0) {
      for(const item of deleteData) {
        try{

          const result = await deleteAPI({
            type: 'baseinfo', 
            utype: 'tenant/',
            url: `process-vendor`,
            jsx: 'jsxcrud'
          }, item);
          console.log(result);
          if(result.resultCode === 'OK_0000') {
            flag = true;
          }else{
            flag = false;
            showToast('삭제중 오류가 발생했습니다.', 'error');
          }
        } catch (e){
          showToast('삭제중 오류가 발생했습니다.', 'error');
          console.error('error', '삭제중 오류가 발생했습니다.');
        }
      }
    }
    if(newData.length > 0) {
      for(const item of newData) {
        try{
          delete item.id
          const result = await postAPI({
            type: 'baseinfo', 
            utype: 'tenant/',
            url: 'process-vendor',
            jsx: 'jsxcrud'
          }, item);
          console.log(result);
          if(result.resultCode === 'OK_0000') {
            flag = true;
          } else{
            flag = false;
            showToast('등록중 오류가 발생했습니다.', 'error');
          }
        } catch (e){
          showToast('등록중 오류가 발생했습니다.', 'error');
          console.error('error', '등록중 오류가 발생했습니다.');
        }
      }
    }
    if(flag) {
      showToast('저장되었습니다.', 'success');
    } else {
      showToast('저장중 오류가 발생했습니다.', 'error');
    }
    setNewData([]);
    setDeleteData([]);
    refetch();
  }
  return (
    <>
      {dataLoading && 
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..."/>
        </div>
      }
      {!vendorLoading &&
      <>
        <div className="w-full flex gap-30">
          <div className="w-[30%] rounded-14 p-20" style={{border: '1px solid #D9D9D9'}}>
            <CustomTreeSelect
              data={treeData}
              childCheck={true}
              childCheckId={childCheckId}
              setChildCheckId={handleSelect}
              onChange={handleCheck}
            />
          </div>
          <div className="w-[70%] flex flex-col gap-15">
            <div className="flex flex-col">
              <AntdTableEdit
                columns={[
                  {
                    title: '',
                    width: 50,
                    dataIndex: 'no',
                    align: 'center',
                  },
                  {
                    title: '공정그룹명',
                    dataIndex: 'processGroup.prcGrpNm',
                    key: 'processGroup.prcGrpNm',
                    align: 'center',
                    
                  },
                  {
                    title: '공정명',
                    dataIndex: 'process.prcNm',
                    key: 'process.prcNm',
                    align: 'center',
                    
                  },
                  {
                    title: '공급처명',
                    dataIndex: 'vendor.prtNm',
                    key: 'vendor.prtNm',
                    align: 'center',
                    
                  },
                  {
                    title: '생성일',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    align: 'center',
                    
                    render: (item: string) => item?.substring(0, 10),
                  },
                  {
                    title: '사용여부',
                    width: 130,
                    dataIndex: 'useYn',
                    key: 'useYn',
                    align: 'center',
                    render: (item: boolean) => item ? "사용" : "미사용",
                  },
                  {
                    title: '',
                    width: 30,
                    dataIndex: 'id',
                    key: 'id',
                    align: 'center',
                    render: (item: boolean) => (
                      <Dropdown trigger={['click']} menu={{ items:[
                        {
                          label: <div className="h-center gap-5 flex"><Bag/>외주처 지정해제</div>,
                          key: 0,
                          onClick: () => {
                            console.log(data, item)
                            if(typeof item === 'string' && (item as string).includes('new')) {
                              setNewData((prev:any) => prev.filter((data:any) => data.id !== item));
                            }else{
                              setDeleteData((prev:any) => [...prev, item])
                            }
                            setData((prev:any) => prev.filter((data:any) => data.id !== item));
                          },
                        },
                      ]}}>
                      <Button type="text" className="!w-24 !h-24 !p-0"><MoreOutlined /></Button>
                    </Dropdown>
                    )
                  },
                ]}
                data={data}
              />
              <div className="flex justify-end">
                <Button type="primary" className="bg-[#038D07] text-white" onClick={vendorSave}><p className="w-16 h-16"><Arrow/></p>저장</Button>
              </div>
            </div>
            <div className="v-between-h-center">
              <p>총 {totalData}건</p>
              <div className="flex">
                <Input value={vendorSch} className="!rounded-0 w-[350px]" placeholder="외주처명 또는 업종 검색" onChange={({target}) => setVendorSch(target.value)}/>
                <Button className="!rounded-0 !w-38 !p-0"><p className="w-16 h-16" onClick={() => vendorRefetch()}><Search /></p></Button>
              </div>
            </div>
            
            <AntdTable
              columns={[
                {
                  title: '',
                  width: 50,
                  dataIndex: 'id',
                  render: (_, record) => <Button size="small" onClick={() => addVendor(record)}>추가</Button>,
                  align: 'center',
                },
                {
                  title: '거래처명',
                  dataIndex: 'prtNm',
                  key: 'prtNm',
                  align: 'center',
                },
                {
                  title: '식별코드',
                  width: 65,
                  dataIndex: 'prtTypeEm',
                  key: 'prtTypeEm',
                  align: 'center',
                },
                {
                  title: '축약명',
                  width: 90,
                  dataIndex: 'prtSnm',
                  key: 'prtSnm',
                  align: 'center',
                },
                {
                  title: '영문명',
                  width: 90,
                  dataIndex: 'prtEngNm',
                  key: 'prtEngNm',
                  align: 'center',
                },
                {
                  title: '영문축약',
                  width: 65,
                  dataIndex: 'prtEngSnm',
                  key: 'prtEngSnm',
                  align: 'center',
                },
                {
                  title: '사업자등록번호',
                  width: 130,
                  dataIndex: 'prtRegNo',
                  key: 'prtRegNo',
                  align: 'center',
                },
                {
                  title: '법인등록번호',
                  width: 130,
                  dataIndex: 'prtCorpRegNo',
                  key: 'prtCorpRegNo',
                  align: 'center',
                },
              ]}
              styles={{round:'0'}}
              data={dataVendor}
            />

            <div className="w-full h-50 h-center justify-end">
              <AntdSettingPagination
                current={pagination.current}
                total={totalData}
                size={pagination.size}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        {/* <div className="v-between-h-center">
          <p>총 {totalData}건</p>
          <div
            className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
            onClick={()=>{setNewOpen(true)}}
          >
            등록
          </div>
        </div>
        
        <AntdTable
          columns={[
            {
              title: 'No',
              width: 50,
              dataIndex: 'no',
              render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
              align: 'center',
            },
            {
              title: '공정그룹명',
              dataIndex: 'processGroup',
              key: 'processGroup',
              align: 'center',
              render: (item:processGroupRType) => item?.prcGrpNm,
            },
            {
              title: '공정명',
              dataIndex: 'process',
              key: 'process',
              align: 'center',
              render: (item:processRType) => item?.prcNm,
            },
            {
              title: '공급처명',
              dataIndex: 'vendor',
              key: 'vendor',
              align: 'center',
              render: (item:partnerRType) => item?.prtNm,
            },
            {
              title: '사용여부',
              width: 130,
              dataIndex: 'useYn',
              key: 'useYn',
              align: 'center',
            },
          ]}
          data={data}
        />

        <div className="w-full h-100 v-h-center">
          <AntdPagination
            current={pagination.current}
            total={totalData}
            size={pagination.size}
            onChange={handlePageChange}
          />
        </div> */}
      </>}
        
      {/* <AntdModal
        title={"공정 등록"}
        open={newOpen}
        setOpen={setNewOpen}
        width={800}
        contents={
          <AddContents
            handleDataChange={handleDataChange}
            newData={newData}
            handleSubmitNewData={handleSubmitNewData}
            setNewOpen={setNewOpen}
            setNewData={setNewData}
            item={[
              { 
                name: 'processGroup',
                key: 'id',
                label: '공정그룹',
                type: 'select',
                value: newData.processGroup.id,
                option: dataGroup?.map((item:processGroupRType)=>({value:item.id,label:item.prcGrpNm})) ?? []
              },
              { 
                name: 'process',
                key: 'id',
                label: '공정',
                type: 'select',
                value: newData.process.id,
                option: dataProcess?.filter((item:processRType)=>item?.processGroup?.id === newData.processGroup.id).map((item)=>({value:item.id,label:(item?.prcNm ?? "")})) ?? []
              },
              { 
                name: 'vendor',
                key: 'id',
                label: '공급처',
                type: 'select',
                value: newData.vendor.id,
                option: dataVendor?.map((item)=>({value:item.id,label:(item?.prtNm ?? "")})) ?? []
              },
              { 
                name: 'useYn',
                label: '사용여부',
                type: 'select',
                option: [{value:true,label:"사용"},{value:false,label:"미사용"}],
                value: newData.useYn,
              },
            ]}
          />
        }
        onClose={()=>{
          setNewOpen(false);
          setNewData(newDataProcessVendorCUType);
        }}
      /> */}

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "success" ? "공정 공급처 등록 성공" : "공정 공급처 등록 실패"}
        contents={resultType === "success" ? <div>공정 공급처 등록이 완료되었습니다.</div> : <div>공정 공급처 등록이 실패하였습니다.</div>}
        type={resultType} 
        onOk={()=>{
          // refetch();
          setResultOpen(false);
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer/>
    </>
  )
}

WkProcessVendorListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'50px'}}
    menu={[
      { text: '공정', link: '/setting/wk/process/list' },
      { text: '공정 공급처', link: '/setting/wk/process/vendor' },
      { text: '공정 공급처 가격', link: '/setting/wk/process/vendor-price' },
    ]}
  >{page}</SettingPageLayout>
)

export default WkProcessVendorListPage;