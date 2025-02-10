import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { commonCodeCUType, commonCodeGroupType, commonCodeGrpReq, commonCodeReq, commonCodeRType, newDataCommonCode, newDataCommonCodeGroupType } from "@/data/type/base/common";
import { deptRType } from "@/data/type/base/hr";
import { treeType } from "@/data/type/componentStyles";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const CommonListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const { showToast, ToastContainer } = useToast();

  const [dataDept, setDataDept] = useState<{value:string,label:string}[]>([]);
  const { data:queryDept } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'hr', 'dept'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'dept/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data.data ?? []).map((dept:deptRType) => ({
          value: dept.id,
          label: dept.deptNm,
        }))
        setDataDept(arr);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });

  // --------- 리스트 데이터 시작 ---------
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [editIndexCode, setEditIndexCode] = useState<number>(-1);

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [ dataSelect, setDataSelect ] = useState<Array<{value:string, label:string}[]>>([]);
  const [ data, setData ] = useState<Array<commonCodeGroupType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'comm'],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'common-code-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data.data ?? []);
        setTotalData(result.data.total ?? 0);
        const arr = (result.data.data ?? []).map((d:commonCodeGroupType) => ({
          value: d.id,
          label: d.cdGrpNm,
        }))
        setDataSelect(arr);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });

    // 그룹 등록 함수
  const handleSubmit = async () => {
    try {
      const newData = data[editIndex];
      console.log(newData);
      
      if(newData.id?.includes('new')){
        const val = validReq(newData, commonCodeGrpReq());
        if(!val.isValid) {
          showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
          return;
        }

        const result = await postAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'common-code-group',
          jsx: 'jsxcrud'
        }, {
          cdGrpNm: newData.cdGrpNm,
          cdGrpDesc: newData.cdGrpDesc,
          dept: { id: newData.dept?.id },
          useYn: newData.useYn,
        } as commonCodeGroupType);

        if(result.resultCode === 'OK_0000') {
          showToast("등록 완료", "success");
        } else {
          showToast(result?.response?.data?.message, "error");
        }
      } else {
        const result = await patchAPI({
          type: 'baseinfo',
          utype: 'tenant/',
          url: 'common-code-group',
          jsx: 'jsxcrud'
        },
        newData.id || '',
        {
          cdGrpNm: newData.cdGrpNm,
          cdGrpDesc: newData.cdGrpDesc,
          dept: { id: newData.dept?.id },
          useYn: newData.useYn,
        } as commonCodeGroupType);

        if(result.resultCode === 'OK_0000') {
          showToast("수정 완료", "success");
        } else {
          showToast(result?.response?.data?.message, "error");
        }
      }
      
      refetch();
      setEditIndex(-1);
    } catch(e) {
      showToast("공통코드 그룹 등록 중 문제가 발생하였습니다. 잠시후 다시 이용해주세요.", "error");

      refetch();
      setEditIndex(-1);
    }
  }

  // 엔터 시 data의 값이 변경되므로 useEffect로 자동 insert / update 되도록 변경
  useEffect(()=>{
    if(editIndex > -1) {
      handleSubmit();
    }
  }, [data])

  const [selectedRowKeys, setSelectedRowKeys] = useState<string | number | null>(null);

  const [ dataCode, setDataCode ] = useState<Array<commonCodeRType | commonCodeCUType>>([]);
  const { data:queryDataCode, refetch:codeRefetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'comm', 'code', selectedRowKeys],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: `common-code/jsxcrud/many/by-cd-grp-idx/${selectedRowKeys}`
      });
      
      if (result.resultCode === 'OK_0000') {
        setDataCode(result.data.data ?? []);
        // setTotalData(result.data.total ?? 0);
      } else {
        console.log('error:', result.response);
      }
      console.log(result.data);
      return result;
    },
    enabled: !!selectedRowKeys
  });

  // 등록 함수
const handleSubmitCode = async () => {
  try {
    const newData = dataCode[editIndexCode];
    console.log('code : ', newData);
    
    if(newData.id?.includes('new')){
      const val = validReq(newData, commonCodeReq());
      if(!val.isValid) {
        showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
        return;
      }

      const result = await postAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code',
        jsx: 'jsxcrud'
      }, {
        cdNm: newData.cdNm,
        cdDesc: newData.cdDesc,
        codeGroup: { id: newData.codeGroup?.id },
        useYn: newData.useYn,
      } as commonCodeCUType);

      if(result.resultCode === 'OK_0000') {
        showToast("공통코드 등록 완료", "success");
    
        refetch();
        codeRefetch();
        setEditIndexCode(-1);
      } else {
        const msg = result?.response?.data?.message;
        if(msg.includes("Duplicate entry")) {
          showToast("중복된 코드값이 있습니다.", "error");
          return;
        }
        showToast(result?.response?.data?.message, "error");
      }
    } else {
      const result = await patchAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code',
        jsx: 'jsxcrud'
      },
      newData.id || '',
      {
        cdNm: newData.cdNm,
        cdDesc: newData.cdDesc,
        codeGroup: { id: newData.codeGroup?.id },
        useYn: newData.useYn,
      } as commonCodeCUType);

      if(result.resultCode === 'OK_0000') {
        showToast("공통코드 수정 완료", "success");
    
        codeRefetch();
        setEditIndexCode(-1);
      } else {
        showToast(result?.response?.data?.message, "error");
      }
    }
  } catch(e) {
    console.log(e);
    showToast("공통코드 등록 중 문제가 발생하였습니다. 잠시후 다시 이용해주세요.", "error");

    codeRefetch();
    setEditIndexCode(-1);
  }
}

// 엔터 시 data의 값이 변경되므로 useEffect로 자동 insert / update 되도록 변경
useEffect(()=>{
  if(editIndexCode > -1) {
    handleSubmitCode();
  }
}, [dataCode])

  return (
    <>
      {dataLoading && <>Loading...</>}
      {!dataLoading &&
      <>
        
        <div className="flex items-start gap-10">
          <div className="w-[50%] h-full">
            <div className="h-center justify-between p-20">
              <p>총 {totalData}건</p>
              <div
                className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
                onClick={()=>{
                  setData([{...newDataCommonCodeGroupType(), id:'new-'+data.length+1}, ...data]);
                }}
              >
                등록
              </div>
            </div>
            <AntdTableEdit
              columns={[
                {
                  title: '그룹명',
                  width: 130,
                  dataIndex: 'cdGrpNm',
                  key: 'cdGrpNm',
                  align: 'center',
                  editable: true,
                },
                {
                  title: '설명',
                  dataIndex: 'cdGrpDesc',
                  key: 'cdGrpDesc',
                  align: 'center',
                  editable: true,
                },
                {
                  title: '관리부서',
                  width: 130,
                  dataIndex: 'dept.deptNm',
                  key: 'dept.deptNm',
                  align: 'center',
                  editable: true,
                  editType: 'select',
                  selectOptions: dataDept,
                  selectValue: 'dept.id'
                },
                {
                  title: '사용여부',
                  width: 80,
                  dataIndex: 'useYn',
                  key: 'useYn',
                  align: 'center',
                  editable: true,
                  editType: 'toggle',
                  render: (value:number) => {
                    return value > 0 ? '사용' : '미사용'
                  }
                },
              ]}
              data={data}
              setData={setData}
              setEditIndex={setEditIndex}
              selectedRowKey={selectedRowKeys}
              setSelectedRowKey={setSelectedRowKeys}
            />
          </div>
          
          <div className="w-[50%] h-full">
            <div className="h-center justify-between p-20">
              <p>{
                selectedRowKeys? 
                '선택한 공통코드 그룹 : '+data.find(d => d.id === selectedRowKeys)?.cdGrpNm
                :
                '공통코드 그룹을 선택해주세요.'
              }</p>
              <div
                className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
                onClick={()=>{
                  setDataCode([{...newDataCommonCode(), id:'new-'+dataCode.length+1, codeGroup: {id: selectedRowKeys?.toString() || ''}}, ...dataCode]);
                }}
              >
                등록
              </div>
            </div>
            <AntdTableEdit
              columns={[
                {
                  title: '코드명',
                  width: 130,
                  dataIndex: 'cdNm',
                  key: 'cdGrpNm',
                  align: 'center',
                  editable: true,
                },
                {
                  title: '그룹명',
                  width: 130,
                  dataIndex: 'codeGroup.cdGrpNm',
                  key: 'codeGroup.cdGrpNm',
                  align: 'center',
                  editable: true,
                  editType: 'select',
                  selectOptions: dataSelect,
                  selectValue: 'codeGroup.id'
                },
                {
                  title: '설명',
                  dataIndex: 'cdDesc',
                  key: 'cdDesc',
                  align: 'center',
                  editable: true,
                },
                {
                  title: '사용여부',
                  width: 80,
                  dataIndex: 'useYn',
                  key: 'useYn',
                  align: 'center',
                  editable: true,
                  editType: 'toggle',
                  render: (value:number) => {
                    return value > 0 ? '사용' : '미사용'
                  }
                },
              ]}
              data={dataCode}
              setData={setDataCode}
              setEditIndex={setEditIndexCode}
            />
          </div>
        </div>
      </>}
      <ToastContainer/>
    </>
  )
}
CommonListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default CommonListPage;