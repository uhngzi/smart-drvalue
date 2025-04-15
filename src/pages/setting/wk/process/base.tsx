import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { newDataProcessCUType, processCUType, processGroupRType, processRType } from "@/data/type/base/process";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import AddContents from "@/contents/base/wk/process/base/AddContents";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import { Spin } from "antd";

const WkProcessListPage: React.FC & {
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

  // --------- 리스트 데이터 시작 ---------
  const [ dataGroup, setDataGroup ] = useState<Array<processGroupRType>>([]);
  const { data:queryDataGroup, refetch:refetchGroup } = useQuery<
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
      } else {
        console.log('error:', result.response);
      };
      return result;
    },
  });

  const [ data, setData ] = useState<Array<processRType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'process', pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
        console.log(result.data);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
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
  const [ newData, setNewData ] = useState<processCUType>(newDataProcessCUType);
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
      if(key === 'prcGrpNm') {
        setNewData({...newData, processGroup: {id: e?.toString()}});
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
        url: 'process',
        jsx: 'jsxcrud'
      }, newData);
      console.log(result);

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultOpen(true);
        setResultType('success');
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

  return (
    <>
      {dataLoading && 
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..."/>
        </div>
      }
      {!dataLoading &&
      <>
        <div className="v-between-h-center">
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
              render: (item:processGroupRType) => item.prcGrpNm,
            },
            {
              title: '공정명',
              dataIndex: 'prcNm',
              key: 'prcNm',
              align: 'center',
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
          <AntdSettingPagination
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
            dataGroup={dataGroup}
          />
        }
        onClose={()=>{
          setNewOpen(false);
          setNewData(newDataProcessCUType);
        }}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "success" ? "공정 등록 성공" : "공정 등록 실패"}
        contents={resultType === "success" ? <div>공정 등록이 완료되었습니다.</div> : <div>공정 등록이 실패하였습니다.</div>}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
          setNewData(newDataProcessCUType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}

WkProcessListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout
    menu={[
      { text: '공정', link: '/setting/wk/process/list' },
      { text: '공정 공급처', link: '/setting/wk/process/vendor' },
      { text: '공정 공급처 가격', link: '/setting/wk/process/vendor-price' },
    ]}
  >{page}</SettingPageLayout>
)

export default WkProcessListPage;