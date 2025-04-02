import dayjs from "dayjs";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { autoHyphenBusinessLicense, autoHyphenCorpRegNo } from "@/utils/formatBusinessHyphen";

import { partnerCUType, partnerRType, newDataPartnerType, setDataPartnerType } from "@/data/type/base/partner";
import { apiGetResponseType } from "@/data/type/apiResponse";

import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

import AntdTable from "@/components/List/AntdTable";
import AntdModal from "@/components/Modal/AntdModal";
import AntdPagination from "@/components/Pagination/AntdPagination";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AddContents from "@/contents/base/client/AddContents";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { MOCK } from "@/utils/Mock";

import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";
import { Button, Radio } from "antd";
import { LabelIcon } from "@/components/Text/Label";

import Bag from "@/assets/svg/icons/bag.svg";
import Edit from "@/assets/svg/icons/memo.svg"
import MessageOn from "@/assets/svg/icons/s_inquiry.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";
import { MoreOutlined } from "@ant-design/icons";

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
  const [ data, setData ] = useState<Array<partnerRType>>([]);
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
        s_query: [{key: "prtTypeEm", oper: "eq", value: type?.toString() ?? ""}]
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        setTotalData(result.data.total ?? 0);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      return result;
    },
    enabled: !!type // type이 존재할 때만 쿼리 실행
  });
  // ---------- 리스트 데이터 끝 ----------

  // ---------- 신규 데이터 시작 ----------
    // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');
  const [resultTitle, setResultTitle] = useState<string>('');
  const [resultText, setResultText] = useState<string>('');
    //등록 모달창을 위한 변수
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
    //등록 모달창 데이터
  const [ newData, setNewData ] = useState<partnerCUType>(newDataPartnerType);
  
    //버튼 함수
  const handleSubmitNewData = async (data: partnerCUType) => {
    try {
      if(data?.id){
        const id = data.id;
        delete data.id;
        const result = await patchAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'biz-partner',
          jsx: 'jsxcrud'},
          id,
          { ...data, prtTypeEm:type as 'cs' | 'vndr' | 'sup' | 'both'}
        );
  
        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultOpen(true);
          setResultType('success');
          setResultTitle("거래처 수정 성공");
          setResultText("거래처 수정이 완료되었습니다.");
        } else {
          setNewOpen(false);
          setResultOpen(true);
          setResultType('error');
          setResultTitle("거래처 수정 실패");
          setResultText("거래처 수정을 실패하였습니다.");
        }
      }else{
        const result = await postAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'biz-partner',
          jsx: 'jsxcrud'},
          
          { ...data, prtTypeEm:type as 'cs' | 'vndr' | 'sup' | 'both'}
        );
  
        if(result.resultCode === 'OK_0000') {
          setNewOpen(false);
          setResultOpen(true);
          setResultType('success');
          setResultTitle("거래처 등록 성공");
          setResultText("거래처 등록이 완료되었습니다.");
        } else {
          setNewOpen(false);
          setResultOpen(true);
          setResultType('error');
          setResultTitle("거래처 등록 실패");
          setResultText("거래처 등록을 실패하였습니다.");
        }
      }
    } catch(e) {
      setNewOpen(false);
      setResultOpen(true);
      setResultType('error');
    }
  }
  // ----------- 신규 데이터 끝 -----------

  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner',
        jsx: 'jsxcrud'},
        id,
      );

      if(result.resultCode === 'OK_0000') {
        setNewOpen(false);
        setResultOpen(true);
        setResultType('success');
        setResultTitle("거래처 삭제 성공");
        setResultText("거래처 삭제가 완료되었습니다.");
      } else {
        setNewOpen(false);
        setResultOpen(true);
        setResultType('error');
        setResultTitle("거래처 삭제 실패");
        setResultText("거래처 삭제를 실패하였습니다.");
      }
    }
    catch(e) {
      setNewOpen(false);
      setResultOpen(true);
      setResultType('error');
      setResultTitle("거래처 삭제 실패");
      setResultText("거래처 삭제를 실패하였습니다.");
    }
  }

  function modalClose(){
    setNewOpen(false);
    setNewData(newDataPartnerType);
  }

  return (
    <>
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        <div className="h-center justify-between">
          <p>총 {totalData}건</p>
          <div
            className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer mb-10"
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
              title: '거래처명',
              dataIndex: 'prtNm',
              key: 'prtNm',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full h-center cursor-pointer"
                  onClick={()=>{
                    setNewData(setDataPartnerType(record));
                    setNewOpen(true);
                  }}
                >
                  {record.prtNm}
                </div>
              )
            },
            {
              title: '식별코드',
              width: 130,
              dataIndex: 'prtTypeEm',
              key: 'prtTypeEm',
              align: 'center',
            },
            {
              title: '축약명',
              width: 130,
              dataIndex: 'prtSnm',
              key: 'prtSnm',
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
              title: '영문축약',
              width: 130,
              dataIndex: 'prtEngSnm',
              key: 'prtEngSnm',
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
              title: '법인등록번호',
              width: 200,
              dataIndex: 'prtCorpRegNo',
              key: 'prtCorpRegNo',
              align: 'center',
              render: (value:string) => (
                <div className="w-full h-full v-h-center">
                  {autoHyphenCorpRegNo(value)}
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
            {
              title: '주소',
              width: 200,
              dataIndex: 'prtAddr',
              key: 'prtAddr',
              align: 'center',
            },
            {
              title: '상세주소',
              width: 200,
              dataIndex: 'prtAddrDtl',
              key: 'prtAddrDtl',
              align: 'center',
            },
            {
              title: '대표자명',
              width: 200,
              dataIndex: 'prtCeo',
              key: 'prtCeo',
              align: 'center',
            },
            {
              title: '전화번호',
              width: 200,
              dataIndex: 'prtTel',
              key: 'prtTel',
              align: 'center',
            },
            {
              title: '팩스번호',
              width: 200,
              dataIndex: 'prtFax',
              key: 'prtFax',
              align: 'center',
            },
            {
              title: '이메일',
              width: 200,
              dataIndex: 'prtEmail',
              key: 'prtEmail',
              align: 'center',
            },
          ]}
          data={data}
        />
        
        <div className="w-full h-100 h-center justify-end">
          <AntdPagination
            current={pagination.current}
            total={totalData}
            size={pagination.size}
            onChange={handlePageChange}
          />
        </div>
      </>}
      <BaseInfoCUDModal 
        popWidth={800}
        title={{name: `거래처 ${newData?.id ? '수정' : '등록'}`, icon: <Bag/>}}
        open={newOpen} 
        setOpen={setNewOpen} 
        onClose={() => modalClose()}
        items={MOCK.clientItems.CUDPopItems} 
        data={newData}
        onSubmit={handleSubmitNewData}
        onDelete={handleDataDelete}
        addCustom = {
          <>
            <div className="w-full flex justify-between items-center h-[50px]">
              <div className="flex items-center gap-10">
                <Bag/>
                <p className="text-16 font-medium">담당자 정보</p>
              </div>
            </div>
            <section className="rounded-lg border border-[#D9D9D9] !p-10">
              <div className="w-full h-40 h-center gap-5">
                <p className="w-40 h-center gap-8">홍길
                  {/* <Radio
                    name="csMng"
                    checked={formData.partnerManagerId === mng.id}
                    onChange={() => setFormData({...formData, partnerManagerId:mng.id})}
                  /> {mng.prtMngNm} */}
                </p>
                <div className="w-[110px] px-8">
                  <LabelIcon label="사업관리부" icon={<MessageOn />}/>
                </div>
                <div className="w-[140px] px-8">
                  <LabelIcon label="010-1111-2222" icon={<Call />}/>
                </div>
                <div className="w-[140px] px-8">
                  <LabelIcon label="010-1111-2222" icon={<Mobile />}/>
                </div>
                <div className="flex-1 px-12">
                  <LabelIcon label="mon1234234@naver.com" icon={<Mail />}/>
                </div>
                <div className="w-24 h-40 v-h-center">
                  <Button type="text" className="!w-24 !h-24 !p-0"><MoreOutlined /></Button>
                </div>
              </div>
            </section>
          </>
        }
        />
        
      {/* <AntdModal
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
          setNewData(newDataPartnerType);
        }}
      /> */}

      <AntdAlertModal
        key={newData.id}
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
          setNewData(newDataPartnerType);
        }}
        hideCancel={true}
        theme="base"
      />
    </>
  )
}

ClientCuListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}>{page}</SettingPageLayout>
)

export default ClientCuListPage;