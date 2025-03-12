import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { newDataProcessVendorCUType, processGroupRType, processRType, processVendorCUType, processVendorRType } from "@/data/type/base/process";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import AntdPagination from "@/components/Pagination/AntdPagination";
import AddContents from "@/contents/base/wk/process/vendor/AddContents";
import { partnerRType } from "@/data/type/base/partner";
import CustomTree from "@/components/Tree/CustomTree";
import { treeType } from "@/data/type/componentStyles";
import CustomTreeCheck from "@/components/Tree/CustomTreeCheck";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { CheckboxChangeEvent } from "antd";

const WkProcessVendorListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

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
  const { data:queryDataVendor } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'client', 'vndr'],
    queryFn: async () => {
      setDataVendor([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner/jsxcrud/many'
      },{
        s_query: [{key: "prtTypeEm", oper: "eq", value: "vndr"}]
      });

      if (result.resultCode === 'OK_0000') {
        setDataVendor(result.data?.data ?? []);
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
    queryKey: ['setting', 'wk', 'process', 'group'],
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
    queryKey: ['setting', 'wk', 'process'],
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
  const [ data, setData ] = useState<Array<processVendorRType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['processVendor', pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-vendor/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        setTotalData(result.data.total ?? 0);
        console.log('data : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      setDataLoading(false);
      return result;
    },
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
    // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');
    //등록 모달창을 위한 변수
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
    //등록 모달창 데이터
  const [ newData, setNewData ] = useState<processVendorCUType>(newDataProcessVendorCUType);
    //값 변경 함수
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
        setNewData(newDataProcessVendorCUType);
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

  return (
    <>
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        <div className="w-full flex gap-30">
          <div className="p-20 w-[30%]">
            <CustomTreeCheck
              data={treeData}
              childCheck={true}
              onChange={handleCheck}
            />
          </div>
          <div className="p-20 w-[70%]">
            <AntdTableEdit
              columns={[
                {
                  title: 'No',
                  width: 50,
                  dataIndex: 'no',
                  align: 'center',
                  render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
                },
                {
                  title: '공정그룹명',
                  dataIndex: 'processGroup.prcGrpNm',
                  key: 'processGroup.prcGrpNm',
                  align: 'center',
                  editable: true,
                  editType: 'select',
                  selectOptions: dataGroup?.map((item:processGroupRType)=>({value:item.id,label:item.prcGrpNm})) ?? [],
                  selectValue: 'processGroup.id',
                  req: true,
                },
                {
                  title: '공정명',
                  dataIndex: 'process.prcNm',
                  key: 'process.prcNm',
                  align: 'center',
                  editable: true,
                  editType: 'select',
                  selectOptions: dataProcess?.map((item:processRType)=>({value:item.id,label:item.prcNm})) ?? [],
                  selectValue: 'process.id',
                  req: true,
                },
                {
                  title: '공급처명',
                  dataIndex: 'vendor.prtNm',
                  key: 'vendor.prtNm',
                  align: 'center',
                  editable: true,
                  editType: 'select',
                  selectOptions: dataVendor?.map((item:partnerRType)=>({value:item.id,label:item.prtNm})) ?? [],
                  selectValue: 'vendor.id',
                  req: true,
                },
                {
                  title: '생성일',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  align: 'center',
                  editable: true,
                  editType: 'date',
                },
                {
                  title: '사용여부',
                  width: 130,
                  dataIndex: 'useYn',
                  key: 'useYn',
                  align: 'center',
                  editable: true,
                  editType: 'toggle',
                },
              ]}
              data={data}
            />
          </div>
        </div>
        <div className="v-between-h-center p-20">
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
        </div>
      </>}
        
      <AntdModal
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
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "success" ? "공정 공급처 등록 성공" : "공정 공급처 등록 실패"}
        contents={resultType === "success" ? <div>공정 공급처 등록이 완료되었습니다.</div> : <div>공정 공급처 등록이 실패하였습니다.</div>}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}

WkProcessVendorListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '공정', link: '/setting/wk/process/list' },
      { text: '공정 공급처', link: '/setting/wk/process/vendor' },
      { text: '공정 공급처 가격', link: '/setting/wk/process/vendor-price' },
    ]}
  >{page}</SettingPageLayout>
)

export default WkProcessVendorListPage;