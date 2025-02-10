import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { boardReq, boardType, newDataBoardType } from "@/data/type/base/board";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WkBoardListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  // true - 등록 눌렸을 때 (저장 시 false)
  const [insertChk, setInsertChk] = useState<boolean>(false);
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

    // 결과 모달창을 위한 변수
  const { showToast, ToastContainer } = useToast();

    // 등록 함수
  const handleSubmit = async () => {
    try {
      const newData = data[editIndex];
      console.log(newData);
      
      if(newData.id?.includes('new')){
        const val = validReq(newData, boardReq());
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
          brdType: newData?.brdType,
          brdDesc: newData?.brdDesc,
          brdW: newData?.brdW,
          brdH: newData?.brdH,
        } as boardType);

        if(result.resultCode === 'OK_0000') {
          showToast("등록 완료", "success");
        } else {
          showToast(result?.response?.data?.message, "error");
        }
      } else {
        const result = await patchAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'board',
          jsx: 'jsxcrud'
        },
        newData.id || '',
        {
          brdType: newData?.brdType,
          brdDesc: newData?.brdDesc,
          brdW: newData?.brdW,
          brdH: newData?.brdH,
        } as boardType);

        if(result.resultCode === 'OK_0000') {
          showToast("수정 완료", "success");
        } else {
          showToast(result?.response?.data?.message, "error");
        }
      }
      
      refetch();
      setInsertChk(false);
      setEditIndex(-1);
    } catch(e) {
      showToast("원판 등록 중 문제가 발생하였습니다. 잠시후 다시 이용해주세요.", "error");

      refetch();
      setInsertChk(false);
      setEditIndex(-1);
    }
  }

  // 엔터 시 data의 값이 변경되므로 useEffect로 자동 insert / update 되도록 변경
  useEffect(()=>{
    if(editIndex > -1) {
      handleSubmit();
    }
  }, [data])
  
  return (
    <>
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        <div className="h-center justify-between p-20">
          <p>총 {totalData}건</p>
          <div
            className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
            onClick={()=>{
              if(!insertChk){
                setData([{...newDataBoardType(), id:'new-'+data.length+1}, ...data]);
              } else {
                handleSubmit();
              }
            }}
          >
            { insertChk? '저장' : '등록'}
          </div>
        </div>
        
        <AntdTableEdit
          columns={[
            {
              title: 'No',
              width: 50,
              dataIndex: 'no',
              render: (_: any, __: any, index: number) => data.length - index, // 역순 번호 매기기
              align: 'center',
            },
            {
              title: '원판유형',
              width: 150,
              dataIndex: 'brdType',
              key: 'brdType',
              align: 'center',
              editable: true,
            },
            {
              title: '원판설명',
              width: 130,
              dataIndex: 'brdDesc',
              key: 'brdDesc',
              align: 'center',
              editable: true,
            },
            {
              title: 'W',
              width: 150,
              dataIndex: 'brdW',
              key: 'brdW',
              align: 'center',
              editable: true,
              inputType: 'number',
            },
            {
              title: 'H',
              width: 150,
              dataIndex: 'brdH',
              key: 'brdW',
              align: 'center',
              editable: true,
              inputType: 'number',
            },
          ]}
          data={data}
          setData={setData}
          setEditIndex={setEditIndex}
        />
      </>}
      <ToastContainer/>
    </>
  )
}

WkBoardListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default WkBoardListPage;