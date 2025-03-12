import { getAPI } from "@/api/get";
import CustomTreeCheck from "@/components/Tree/CustomTreeCheck";
import CustomTreeView from "@/components/Tree/CustomTreeView";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { processGroupRType, processRType } from "@/data/type/base/process";
import { productLinesGroupRType } from "@/data/type/base/product";
import { treeType } from "@/data/type/componentStyles";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useQuery } from "@tanstack/react-query";
import { Button, CheckboxChangeEvent } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

const WkProductListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const [ treeData, setTreeData ] = useState<treeType[]>([]);
  const [ procTreeData, setProcTreeData ] = useState<treeType[]>([]);

  const [productGroupId, setProductGroupId] = useState<string | null>(null)
  const [checkProcessList, setCheckProcessList] = useState<string[]>([])

  const { data:prdGrpQueryData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['product-lines-group/jsxcrud/many'],
    queryFn: async () => {

      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'product-lines-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data?.data ?? []).map((d:productLinesGroupRType)=>({
          id: d.id,
          label: d.name,
          open: true
        }))
        setTreeData(arr);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
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

  const handleCheck = (e: CheckboxChangeEvent) => {
    setCheckProcessList((prev) => {
      if (prev.includes(e.target.value)) {
        return prev.filter((id) => id !== e.target.value);
      } else {
        return [...prev, e.target.value];
      }
    });
  }

  function onSubmit() {
    console.log(productGroupId, checkProcessList)
  }

  return (
    <>
    <section className="w=full">
      <div className="w=full flex gap-30">

        <div className="p-20 min-h-[600px] w-[50%] rounded-8" style={{border:'1px solid #B9B9B9'}}>
          <CustomTreeView
            data={treeData}
            setSelect={setProductGroupId}
          />
        </div>
        <div className="p-20 min-h-[600px] w-[50%] rounded-8" style={{border:'1px solid #B9B9B9'}}>
          <CustomTreeCheck
            data={procTreeData}
            childCheck={true}
            onChange={handleCheck}
          />
        </div>
      </div>
      <div className="py-20">
        <Button type="primary" size="large" onClick={onSubmit} 
          className="w-full flex h-center gap-8 !h-[50px] " 
          style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
          <span>저장하기</span>
        </Button>
      </div>
    </section>
    </>
  )
}

WkProductListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}>{page}</SettingPageLayout>
)

export default WkProductListPage;