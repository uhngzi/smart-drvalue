import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import CardInputList from "@/components/List/CardInputList";
import AntdModal from "@/components/Modal/AntdModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { boardReq, boardType, newDataBoardType, setDataBoardType } from "@/data/type/base/board";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import { useEffect, useState } from "react";

import Bag from "@/assets/svg/icons/bag.svg";
import { MOCK } from "@/utils/Mock";
import { deleteAPI } from "@/api/delete";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";

const WkBoardListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  // true - 등록 눌렸을 때 (저장 시 false)
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };

  const [addData, setAddData] = useState<boardType>(newDataBoardType);
  const [ data, setData ] = useState<Array<boardType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'board', pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'board/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data.data ?? []);
        setTotalData(result.data.total ?? 0);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      return result;
    },
  });
  function changeNewData(
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
      name: string,
      type: 'input' | 'select' | 'date' | 'other',
    ) {
     
      if(typeof e === "string") {
        setAddData(prev => ({...prev, [name]: e} as boardType));
      } else {
        const { value } = e.target;
        setAddData(prev => ({...prev, [name]: value} as boardType));
      }
    }
  function setResultFunc(type: AlertType, title: string, text: string) {
    setResultOpen(true);
    setResultType(type);
    setResultTitle(title);
    setResultText(text);
  }


  // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');
  const [resultTitle, setResultTitle] = useState<string>('');
  const [resultText, setResultText] = useState<string>('');
  const { showToast, ToastContainer } = useToast();

  const regBoard = async () => {
    const val = validReq(addData, boardReq());
    if(!val.isValid) {
      showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
      return;
    }

    const result = await postAPI({
      type: 'baseinfo',
      utype: 'tenant/',
      url: 'board',
      jsx: 'jsxcrud'
    }, {
      brdType: addData?.brdType,
      brdDesc: addData?.brdDesc,
      brdW: addData?.brdW,
      brdH: addData?.brdH,
    } as boardType);

    if(result.resultCode === 'OK_0000') {
      showToast("등록 완료", "success");
    } else {
      showToast(result?.response?.data?.message, "error");
    }
    refetch();
    setAddOpen(false);
  }
  
    // 수정 함수
  const handleSubmit = async (data: boardType) => {
    try {
      if(data?.id){
        const id = data.id;
        delete data.id;
        const result = await patchAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'board',
          jsx: 'jsxcrud'
        },
        id,
        data);
  
        if(result.resultCode === 'OK_0000') {
          setAddOpen(false);
          setResultFunc('success', '수정 성공', '원판정보 수정이 완료되었습니다');
        } else {
          setAddOpen(false);
          setResultFunc('error', '수정 실패', '원판정보 수정을 실패하였습니다.');
        }
      
      refetch();
      }else{
        const val = validReq(addData, boardReq());
        if(!val.isValid) {
          showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
          return;
        }

        const result = await postAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'board',
          jsx: 'jsxcrud'
        }, data);

        if(result.resultCode === 'OK_0000') {
          setAddOpen(false);
          setResultFunc('success', '등록 성공', '원판정보 등록되었습니다.');
        } else {
          setAddOpen(false);
          setResultFunc('success', '등록 실패', '원판정보 등록을 실패하였습니다.');
        }
        refetch();
        setAddOpen(false);
      }
      // const newData = data[editIndex];
      // console.log(newData);
      
    } catch(e) {
      showToast("원판 등록 중 문제가 발생하였습니다. 잠시후 다시 이용해주세요.", "error");
      refetch();
    }
  }

  const handleDataDelete = async (id: string) => {
      try {
        const result = await deleteAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'board',
          jsx: 'jsxcrud'},
          id,
        );
        console.log(result);
  
        if(result.resultCode === 'OK_0000') {
          setAddOpen(false);
          setResultFunc('success', '삭제 성공', '원판정보 삭제가 완료되었습니다.');
        } else {
          setAddOpen(false);
          setResultFunc('error', '삭제 실패', '원판정보 삭제를 실패하였습니다.');
        }
      }
      catch(e) {
        setAddOpen(false);
        setResultFunc('error', '삭제 실패', '원판정보 삭제를 실패하였습니다.');
      }
    }

  // 엔터 시 data의 값이 변경되므로 useEffect로 자동 insert / update 되도록 변경

  function modalClose(){
    setAddOpen(false);
    setAddData(newDataBoardType);
  }
  
  return (
    <>
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        <div className="h-center justify-between p-20">
          <p>총 {totalData}건</p>
          <div
            className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
            onClick={()=>setAddOpen(true)}
          >
            등록
          </div>
        </div>
        
        <AntdTableEdit
          columns={[
            {
              title: 'No',
              width: 50,
              dataIndex: 'no',
              render: (_: any, __: any, index: number) => data.length - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
              align: 'center',
            },
            {
              title: '원판유형',
              width: 150,
              dataIndex: 'brdType',
              key: 'brdType',
              align: 'center',
              render: (_, record) => (
                <div
                  className="w-full h-full h-center justify-center cursor-pointer"
                  onClick={()=>{
                    setAddData(setDataBoardType(record));
                    setAddOpen(true);
                  }}
                >
                  {record.brdType}
                </div>
              )
            },
            {
              title: '원판설명',
              width: 130,
              dataIndex: 'brdDesc',
              key: 'brdDesc',
              align: 'center',
            },
            {
              title: 'W',
              width: 150,
              dataIndex: 'brdW',
              key: 'brdW',
              align: 'center',
              inputType: 'number',
            },
            {
              title: 'H',
              width: 150,
              dataIndex: 'brdH',
              key: 'brdW',
              align: 'center',
              inputType: 'number',
            },
          ]}
          data={data}
          setData={setData}
          setEditIndex={setEditIndex}
        />
      </>}
      <BaseInfoCUDModal
        title={{name: `원판 ${addData?.id ? '수정' : '등록'}`, icon: <Bag/>}}
        open={addOpen} 
        setOpen={setAddOpen} 
        onClose={() => modalClose()}
        items={MOCK.wkBoardItems.CUDPopItems} 
        data={addData}
        onSubmit={handleSubmit}
        onDelete={handleDataDelete}/>
      {/* <AntdModal
        title="원판 등록"
        width={500}
        open={addOpen}
        setOpen={setAddOpen}
        bgColor="#fff"
        contents={
          <div>
            <CardInputList title="" styles={{gap:'gap-20'}} items={[
              {value:addData?.brdType, name:'brdType',label:'원판유형', type:'input', widthType:'full'},
              {value:addData?.brdDesc, name:'brdDesc',label:'원판명', type:'input', widthType:'full'},
              {value:addData?.brdW, name:'brdW',label:'가로', type:'input', widthType:'full'},
              {value:addData?.brdH, name:'brdH',label:'세로', type:'input', widthType:'full'},
              {value:addData?.brdExtraInfo, name:'brdExtraInfo',label:'추가정보', type:'input', widthType:'full'},
                
            ]} handleDataChange={changeNewData}/>
            <div className="h-[50px] mx-10">
              <Button type="primary" size="large" onClick={regBoard} 
                className="w-full flex h-center gap-8 !h-full" 
                style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
                <span>등록</span>
              </Button>
            </div>
          </div>
        }
      /> */}
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
          setAddData(newDataBoardType);
        }}
        hideCancel={true}
        theme="base"
      />
      <ToastContainer/>
    </>
  )
}

WkBoardListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}>{page}</SettingPageLayout>
)

export default WkBoardListPage;