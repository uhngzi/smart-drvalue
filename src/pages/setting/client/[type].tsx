import dayjs from "dayjs";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { autoHyphenBusinessLicense } from "@/utils/formatBusinessHyphen";

import { cuCUType, cuRType, newDataCuType } from "@/data/type/base/cu";
import { apiGetResponseType } from "@/data/type/apiResponse";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdTable from "@/components/List/AntdTable";
import AntdModal from "@/components/Modal/AntdModal";
import AntdPagination from "@/components/Pagination/AntdPagination";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AddContents from "@/contents/base/client/AddContents";

const ClientCuListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type } = router.query;

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
  const [ data, setData ] = useState<Array<cuRType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'client', type, pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'biz-partner/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        s_search: "prtTypeEm",
        s_type: 'eq',
        s_list:[`"${type}"`]
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data.data ?? []);
        setTotalData(result.data.total ?? 0);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
    enabled: !!type // type이 존재할 때만 쿼리 실행
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
    // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');
    //등록 모달창을 위한 변수
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
    //등록 모달창 데이터
  const [ newData, setNewData ] = useState<cuCUType>(newDataCuType);
    //값 변경 함수
  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
  ) => {
    if(typeof e === "string") {
      if(type === "date") {
        setNewData({...newData, [name]: dayjs(e).format('YYYY-MM-DD')});
      } else {
        if (name === "emp") {
          setNewData({
            ...newData,
            emp: { id: e },
          });
        } else {
          setNewData({...newData, [name]: e});
        }
      }
    } else {
      const { value } = e.target;
      setNewData({...newData, [name]: value});
    }
  }
    //등록 버튼 함수
  const handleSubmitNewData = async () => {
    try {
      console.log(newData);
      const result = await postAPI('baseinfo', 'tenant', 'biz-partner', true, {...newData, prtTypeEm:type as 'cs' | 'vndr' | 'sup' | 'both'});
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
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        <div className="h-center justify-between p-20">
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
              render: (_: any, __: any, index: number) => data.length - index, // 역순 번호 매기기
              align: 'center',
            },
            {
              title: '고객명',
              dataIndex: 'prtNm',
              key: 'prtNm',
              align: 'center',
            },
            {
              title: '영문명',
              width: 130,
              dataIndex: 'prtEngNm',
              key: 'prtEngNm',
              align: 'center',
            },
            {
              title: '코드',
              width: 130,
              dataIndex: 'prtRegCd',
              key: 'prtRegCd',
              align: 'center',
            },
            {
              title: '사업자등록번호',
              width: 200,
              dataIndex: 'prtRegNo',
              key: 'prtRegNo',
              align: 'center',
              render: (value:string) => (
                <div className="w-full h-full v-h-center">
                  {autoHyphenBusinessLicense(value)}
                </div>
              )
            },
            {
              title: '업태',
              width: 200,
              dataIndex: 'prtBizType',
              key: 'prtBizType',
              align: 'center',
            },
            {
              title: '업종',
              width: 200,
              dataIndex: 'prtBizCate',
              key: 'prtBizCate',
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
        title={"거래처 등록"}
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
          />
        }
        onClose={()=>{
          setNewOpen(false);
          setNewData(newDataCuType);
        }}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "success" ? "거래처 등록 성공" : "거래처 등록 실패"}
        contents={resultType === "success" ? <div>거래처 등록이 완료되었습니다.</div> : <div>거래처 등록이 실패하였습니다.</div>}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
          setNewData(newDataCuType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}

ClientCuListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default ClientCuListPage;