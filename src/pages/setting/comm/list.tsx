import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import CustomTree from "@/components/Tree/CustomTree";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { commonCodeCUType, commonCodeGroupType, commonCodeGrpReq, commonCodeReq, commonCodeRType, newDataCommonCode, newDataCommonCodeGroupType } from "@/data/type/base/common";
import { deptRType } from "@/data/type/base/hr";
import { selectType, treeType } from "@/data/type/componentStyles";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";



const CommonListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const { showToast, ToastContainer } = useToast();

  const [ treeData, setTreeData ] = useState<treeType[]>([]);

  // ---------- 신규 tree 데이터 시작 ----------
  const [ addList, setAddList ] = useState<any[]>([]);
  const [ editList, setEditList ] = useState<any[]>([]);
  const [ deleteList, setDeleteList ] = useState<{type: string, id: string}[]>([]);
  const [teamList, setTeamList] = useState<selectType[]>([]);
  const [ addEditsInfo, setAddEditsInfo ] = useState<any[]>([]);

  const addEdits = {
    info: addEditsInfo, 
    setInfo: setAddEditsInfo,
    addEditList:[
      {type:"input", key:"cdGrpDesc", name:"시스템사용"},
      {type:"select", key:"teamId", name:"부서", selectData:teamList,}
    ]
  }

  // --------- 리스트 데이터 시작 ---------
  const [editIndex, setEditIndex] = useState<number>(-1);

  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [ data, setData ] = useState<Array<commonCodeGroupType>>([]);
  const { data:queryData, refetch, isFetching: groupFetching } = useQuery< apiGetResponseType, Error>({
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
        const arr = (result.data?.data ?? []).map((d:commonCodeGroupType) => ({
          id: d.id,
          label: d.cdGrpNm,
          children: (d.codes ?? []).map((c:commonCodeRType) => ({
            id: c.id,
            label: c.cdNm,
          })),
          open:true
        }))
        const addInfoArr = (result.data?.data ?? []).map((d:commonCodeGroupType) => ({
          id: d.id,
          cdGrpDesc: d.cdGrpDesc,
          team: d.team?.id,
        }))

        setTreeData(arr);
        setAddEditsInfo(addInfoArr);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      return result;
    },
  });

  const { data:deptData } = useQuery< apiGetResponseType, Error>({
    queryKey: ['setting', 'dept'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'dept/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        const arr = result.data.data
        const teams = arr.map((v:any) => v.teams.flat())[0]
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",teams.map((v:any) => ({value:v.id, label:v.teamNm})))
        setTeamList(teams.map((v:any) => ({value:v.id, label:v.teamNm})))
      } else {
        console.log('error:', result.response);
      }

      return result;
    },
  });

    // 그룹 등록 함수
  const handleSubmit = async () => {
    try {
      const newData = data[editIndex];
      
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
  console.log(addEditsInfo)
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
        <div className="h-[900px] h-full">
        <CustomTree
            data={treeData}
            onSubmit={()=>{}}
            setAddList={setAddList}
            setEditList={setEditList}
            setDelList={setDeleteList}
            addEdits={addEdits}
          />
        </div>
      </>}
      <ToastContainer/>
    </>
  )
}
CommonListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}>{page}</SettingPageLayout>
)

export default CommonListPage;