import { deleteAPI } from "@/api/delete";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import BaseTreeCUDModal from "@/components/Modal/BaseTreeCUDModal";
import CustomTreeCheck from "@/components/Tree/CustomTreeCheck";
import CustomTreeView from "@/components/Tree/CustomTreeView";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { processGroupRType, processRType } from "@/data/type/base/process";
import { productLinesGroupRType } from "@/data/type/base/product";
import { CUtreeType, treeType } from "@/data/type/componentStyles";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { onTreeAdd, onTreeDelete, onTreeEdit, updateTreeDatas } from "@/utils/treeCUDfunc";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { Button, CheckboxChangeEvent } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

const WkProductListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const { showToast, ToastContainer } = useToast();

  const router = useRouter();
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const [prodGroupOpen, setProdGroupOpen] = useState<boolean>(false);

  const [ treeData, setTreeData ] = useState<treeType[]>([]);
  const [ procTreeData, setProcTreeData ] = useState<treeType[]>([]);
  const [ prdProcData, setPrdProcData ] = useState<{matchId:string, checkId:string}[]>([]);

  const [productGroupId, setProductGroupId] = useState<string | null>(null)
  const [checkProcessList, setCheckProcessList] = useState<string[]>([])

  // 트리를 사용하는 메뉴인 경우, 추가, 수정, 삭제를 하기위한 리스트, 한번에 submit을 하기때문에 각각의 리스트를 만들어서 한번에 처리
    const [addList, setAddList] = useState<CUtreeType[]>([]);
    const [editList, setEditList] = useState<CUtreeType[]>([]);
    const [deleteList, setDeleteList] = useState<{type: string, id: string}[]>([]);

  const { data:prdGrpQueryData, refetch: groupRefetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['product-lines-group/jsxcrud/many'],
    queryFn: async () => {

      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'product-lines-group/jsxcrud/many'
      },{
        sort: "ordNo,ASC"
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data?.data ?? []).map((d:productLinesGroupRType)=>({
          id: d.id,
          label: d.name,
          ordNo: d.ordNo,
          open: true
        }))
        
        setTreeData(arr);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });

  const { data:prdProcQueryData, refetch: prdProcRefetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['product-lines-group/jsxcrud/one', productGroupId],
    queryFn: async () => {

      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: `product-lines-group/jsxcrud/one/${productGroupId}`
      },{
        sort: "ordNo,ASC"
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data?.data.productLines ?? []).map((d:any)=>({
          matchId: d.id,
          checkId: d.process.id
        }))

        setPrdProcData(arr);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
    enabled: !!productGroupId,
  });

  const { data:queryData, refetch } = useQuery<
      apiGetResponseType, Error
    >({
      queryKey: ['setting', 'wk', 'process'],
      queryFn: async () => {
        setDataLoading(true);
        const result = await getAPI({
          type: 'baseinfo', 
          utype: 'tenant/',
          url: 'process-group/jsxcrud/many'
        },{
          sort: "ordNo,ASC"
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
          setProcTreeData(arr);
        } else {
          console.log('error:', result.response);
        }
  
        setDataLoading(false);
        console.log(result.data);
        return result;
      },
    });
    console.log(procTreeData)
  const handleCheck = async (e: CheckboxChangeEvent, matchId: any) => {
    if(!productGroupId){
      showToast('제품군을 먼저 선택해주세요.', 'error');
      return;
    }
    console.log(e.target.checked, matchId)

    if(e.target.checked) {
      const result = await postAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'product-lines',
        jsx: 'jsxcrud'
      }, {
        productLinesGroup:{
          id: productGroupId,
        },
        process:{
          id: e.target.value,
        },
        ordNo:0,
        useYn:true
      });
      if (result.resultCode === 'OK_0000') {
        setPrdProcData((prev) => ([...prev, {matchId: result.data?.entity.id, checkId: e.target.value}]));
        showToast('저장이 완료되었습니다.', 'success');
      } else {
        console.log('error:', result.response);
      }
    } else {
      const dResult = await deleteAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: `product-lines`,
        jsx: 'jsxcrud'
      }, matchId)
      if(dResult.resultCode === 'OK_0000') {
        setPrdProcData((prev) => prev.filter((item) => item.matchId !== matchId));
        showToast('삭제가 완료되었습니다.', 'success');
      }
    }
    // setPrdProcData((prev) => {
    //   if (prev.includes(e.target.value)) {
    //     return prev.filter((id) => id !== e.target.value);
    //   } else {
    //     return [...prev, e.target.value];
    //   }
    // });
  }

  function onSubmit() {
    console.log(productGroupId, checkProcessList)
  }

  function modalClose(){
    setProdGroupOpen(false);
  }

  async function onProdGroupPopSubmit(list: treeType[]){
    const { updatedAddList, finalEditList, updatedDeleteList } = updateTreeDatas(addList, editList, deleteList);
    console.log("add:",updatedAddList, "edit:", finalEditList, "delete: ",updatedDeleteList);
    let result = false
    const url = "product-lines-group";
    
    for(const item of updatedAddList){
      const jsonData = {name: item.label};

      result = await onTreeAdd(url, jsonData);

      if(!result) {
        showToast('데이터 추가중 오류가 발생했습니다.', 'error');
      }
      console.log("add", result)
    }

    for(const item of finalEditList){
      const jsonData = {name: item.label, ordNo: Number(item.ordNo)};
         
      result = await onTreeEdit(item, url, jsonData);
      if(!result){
        showToast('데이터 수정중 오류가 발생했습니다.', 'error');
      }
    }
    
    for(const item of updatedDeleteList){
     
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
      groupRefetch();
    }
  }

  return (
    <>
      <section className="w=full">
        <div className="h-center justify-between pb-20">
          <div
            className="w-90 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
            onClick={()=>setProdGroupOpen(true)}
          >
            제품군 관리
          </div>
        </div>
        <div className="w-full flex gap-30">

          <div className="p-20 min-h-[600px] w-[50%] rounded-8" style={{border:'1px solid #B9B9B9'}}>
            <CustomTreeView
              data={treeData}
              setSelect={setProductGroupId}
              notCollapsed={true}
              isChild={false}
            />
          </div>
          <div className="p-20 min-h-[600px] w-[50%] rounded-8" style={{border:'1px solid #B9B9B9'}}>
            <CustomTreeCheck
              data={procTreeData}
              checkedData={prdProcData}
              childCheck={true}
              onChange={handleCheck}
              // notCollapsed={true}
            />
          </div>
        </div>
        {/* <div className="py-20">
          <Button type="primary" size="large" onClick={onSubmit} 
            className="w-full flex h-center gap-8 !h-[50px] " 
            style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
            <span>저장하기</span>
          </Button>
        </div> */}
        <BaseTreeCUDModal
          title={{name: "제품군 관리"}}
          open={prodGroupOpen} 
          setOpen={setProdGroupOpen} 
          data={treeData}
          isChild={false}
          onClose={() => modalClose()}
          onSubmit={onProdGroupPopSubmit}
          onUpdateDataFunc={{
            addList: addList,
            editList: editList,
            deleteList: deleteList,
            setAddList: setAddList,
            setEditList: setEditList,
            setDeleteList: setDeleteList,
          }}
        />
      </section>
      <ToastContainer/>
    </>
  )
}

WkProductListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}>{page}</SettingPageLayout>
)

export default WkProductListPage;