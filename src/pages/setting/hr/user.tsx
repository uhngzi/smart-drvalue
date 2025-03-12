import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useRouter } from "next/router";

import People from "@/assets/svg/icons/people.svg";
import UserSetting from "@/assets/svg/icons/user-setting.svg";
import UserFollow from "@/assets/svg/icons/user-follow.svg";
import UserAdd from "@/assets/svg/icons/user-add.svg";
import { useState } from "react";
import BaseTreeCUDModal from "@/components/Modal/BaseTreeCUDModal";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import { CUtreeType } from "@/data/type/componentStyles";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import { onTreeAdd, onTreeDelete, onTreeEdit, updateTreeDatas } from "@/utils/treeCUDfunc";
import useToast from "@/utils/useToast";

const groupType = {
  dept: {name: '조직도', child:'team'},
  workType: {name: '근무형태', child:''},
  work: {name: '업무구분', child:''},
  user: {name: '조직 구성원', child:''},
}

const HrUserListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const { showToast, ToastContainer } = useToast();

  const router = useRouter();
  const [newOpen, setNewOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<keyof typeof groupType>('dept');
  const [newData, setNewData] = useState<any>([]);

  // 트리를 사용하는 메뉴인 경우, 추가, 수정, 삭제를 하기위한 리스트, 한번에 submit을 하기때문에 각각의 리스트를 만들어서 한번에 처리
  const [addList, setAddList] = useState<CUtreeType[]>([]);
  const [editList, setEditList] = useState<CUtreeType[]>([]);
  const [deleteList, setDeleteList] = useState<{type: string, id: string}[]>([]);



  //데이터 관련
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const { data:queryData, refetch } = useQuery< apiGetResponseType, Error>({
    queryKey: ['setting', 'hr', 'user', newTitle],
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: `${newTitle}/jsxcrud/many`
      });

      if (result.resultCode === 'OK_0000') {
        console.log(result.data?.data)
        let arr = [];
        console.log(newTitle)
        if(newTitle === 'dept'){
          arr = (result.data?.data ?? []).map((group:any) => ({
            id: group.id,
            label: group.deptNm,
            children: group.teams.map((team:any) => ({
              id: team.id,
              label: team.teamNm,
            })),
            open: true,
          }));
        }
        console.log(arr)
        setNewData(arr);
      } else {
        console.log('error:', result.response);
        setNewData([]);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });

  // function onTreeSubmit(list: treeType[]){
  //   const newParentsList = list.filter((item) => item.id.includes('temp'));
  //   if(newTitle === 'dept'){
  //     newParentsList.forEach( async (item) => {
  //       const jsonData = {deptNm: item.label, "useYn": true}
  //       const parentResult = await postAPI({
  //         type: 'baseinfo', 
  //         utype: 'tenant/',
  //         url: `${newTitle}/jsxcrud/many`,
  //         jsx: 'jsxcrud'
  //       }, jsonData);

  //       const parentId = parentResult.data.entity.id;
  //       if(item.children && item.children.length > 0){
  //         item.children.forEach( async (child) => {

  //           const childJsonData = {
  //             dept: {id: parentId},
  //             teamNm: child.label,
  //             useYn:  true
  //           }
  //           const childResult = await postAPI({
  //             type: 'baseinfo', 
  //             utype: 'tenant/',
  //             url: `${newTitle}/jsxcrud/many`,
  //             jsx: 'jsxcrud'
  //           }, childJsonData);
  //         })
  //       }
  //     })
  //   }
  // }
  async function onTreeSubmit(){
    console.log(addList, editList, deleteList);
    const { updatedAddList, finalEditList, updatedDeleteList } = updateTreeDatas(addList, editList, deleteList);
    console.log("add:",updatedAddList, "edit:", finalEditList, "delete: ",updatedDeleteList);
    let result = false

    for(const item of updatedAddList){
      let url: string = newTitle;
      let parent: string = '';
      const jsonData: { [key: string]: any, useYn: boolean } = {useYn: true}

      if(item.parentId) {
        url = groupType[newTitle].child;
        parent = newTitle;
        jsonData[parent] = {id: item.parentId};
        jsonData[`${groupType[newTitle].child}Nm`] = item.label;
      }else{
        jsonData[`${newTitle}Nm`] = item.label;
      }
      result = await onTreeAdd(url, jsonData);
      if(!result) {
        showToast('데이터 추가중 오류가 발생했습니다.', 'error');
      }
      console.log("add", result)
    }

    for(const item of finalEditList){
      let url: string = newTitle;
      const jsonData: { [key: string]: any, useYn: boolean } = {useYn: true}

      if(item.parentId) {
        url = groupType[newTitle].child;
        jsonData[newTitle] = {id: item.parentId};
        jsonData[`${groupType[newTitle].child}Nm`] = item.label;
      }else{
        jsonData[`${newTitle}Nm`] = item.label;
      }
      result = await onTreeEdit(item, url, jsonData);
      if(!result){
        showToast('데이터 수정중 오류가 발생했습니다.', 'error');
      }
    }

    for(const item of updatedDeleteList){
      let url: string = newTitle;
      if(item.type === 'child'){
        url = groupType[newTitle].child;
      }
      result = await onTreeDelete(item, url);
      if(!result){
        showToast('데이터 삭제중 오류가 발생했습니다.', 'error');
      }
    }
    console.log(result);
    if(result) {
      setAddList([]);
      setEditList([]);
      setDeleteList([]);
      showToast('저장이 완료되었습니다.', 'success');
      refetch();
    }
  }

  

  function modalOpen(title: keyof typeof groupType){
    setNewOpen(true);
    setNewTitle(title);
  }

  function modalClose(){
    setNewOpen(false);
  }

  return (
    <section className="flex flex-col gap-20">
      <div>
        <p className="text-18 font-bold">조직도</p>
      </div>
      <div className="flex v-between-h-center">
        <div>
          <p className="text-16 font-medium">조직 설정하기</p>
          <p className="text-14 font-medium" style={{color:'#00000073'}}>회사의 조직도를 관리해보세요.</p>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex p-20 gap-10 rounded-8 h-center cursor-pointer" style={{border: '1px solid #D9D9D9'}} onClick={() => modalOpen("dept")}>
          <People/>
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{color:'#000000D9'}}>조직도</span>
            <span style={{color:'#00000073'}}>회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.</span>
          </div>
        </div>
        <div className="flex p-20 gap-10 rounded-8 h-center cursor-pointer" style={{border: '1px solid #D9D9D9'}} onClick={() => modalOpen("workType")}>
          <UserSetting/>
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{color:'#000000D9'}}>근무형태</span>
            <span style={{color:'#00000073'}}>회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.</span>
          </div>
        </div>
        <div className="flex p-20 gap-10 rounded-8 h-center cursor-pointer" style={{border: '1px solid #D9D9D9'}} onClick={() => modalOpen("work")}>
          <UserFollow/>
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{color:'#000000D9'}}>업무구분</span>
            <span style={{color:'#00000073'}}>회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.</span>
          </div>
        </div>
        <div className="flex p-20 gap-10 rounded-8 h-center cursor-pointer" style={{border: '1px solid #D9D9D9'}} onClick={() => modalOpen("user")}>
          <UserAdd/>
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{color:'#000000D9'}}>조직 구성원</span>
            <span style={{color:'#00000073'}}>회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.</span>
          </div>
        </div>
      </div>

      <BaseTreeCUDModal
        title={{name: `${groupType[newTitle].name} 설정`}}
        open={newOpen} 
        setOpen={setNewOpen} 
        data={newData}
        onClose={() => modalClose()}
        onSubmit={onTreeSubmit}
        onUpdateDataFunc={{
          addList: addList,
          editList: editList,
          deleteList: deleteList,
          setAddList: setAddList,
          setEditList: setEditList,
          setDeleteList: setDeleteList,
        }}
      />
      <ToastContainer/>
    </section>
  )
}

HrUserListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}>{page}</SettingPageLayout>
)

export default HrUserListPage;