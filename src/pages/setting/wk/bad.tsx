import { getAPI } from "@/api/get";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import CustomTree from "@/components/Tree/CustomTree";
import CustomTreeCheck from "@/components/Tree/CustomTreeCheck";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { processGroupRType, processRType } from "@/data/type/base/process";
import { treeType } from "@/data/type/componentStyles";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useQuery } from "@tanstack/react-query";
import { CheckboxChangeEvent } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const WkBadListPage: React.FC & {
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

  // ---------- 필요 데이터 ---------- 시작
  const [ treeData, setTreeData ] = useState<treeType[]>([]);
  const { data:queryTreeData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'process', pagination.current],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo', 
        utype: 'tenant/',
        url: 'process-group/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data?.data ?? []).map((group:processGroupRType) => ({
          id: group.id,
          label: group.prcGrpNm,
          ordNo: group.ordNo,
          children: group.processes.map((process:processRType) => ({
            id: process.id,
            label: process.prcNm,
            ordNo: process.ordNo,
          })),
          open: true,
        }));
        setTreeData(arr);
      } else {
        console.log('error:', result.response);
      }
      console.log(result.data);
      return result;
    },
  });

  const [ dataGroup, setDataGroup ] = useState<Array<processGroupRType>>([]);
  const { data:queryDataGroup } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['process-group/jsxcrud/many'],
    queryFn: async () => {
      setDataGroup([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setDataGroup(result.data?.data ?? []);
        console.log('group : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      };
      return result;
    },
  });

  const [ dataProcess, setDataProcess ] = useState<Array<processRType>>([]);
  const { data:queryDataProcess } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['process/jsxcrud/many'],
    queryFn: async () => {
      setDataProcess([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setDataProcess(result.data?.data ?? []);
        console.log('process : ', result.data?.data);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });
  // ---------- 필요 데이터 ---------- 끝

  const [ addList, setAddList ] = useState<any[]>([]);
  const [ editList, setEditList ] = useState<any[]>([]);
  const [ deleteList, setDeleteList ] = useState<{type: string, id: string}[]>([]);

  return (
    <>
      <div className="w-full flex gap-30">
        <div className="w-[30%] max-h-[calc(100vh-200px)] overflow-y-auto">
          <CustomTree
            data={treeData}
            onSubmit={()=>{}}
            setAddList={setAddList}
            setEditList={setEditList}
            setDelList={setDeleteList}
          />
        </div>
        <div className="w-[70%] max-h-[calc(100vh-200px)] overflow-y-auto">
          <AntdTableEdit
            columns={[
              {
                title: 'No',
                width: 50,
                dataIndex: 'no',
                align: 'center',
                render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
              },
              {
                title: '공정그룹명',
                width: 100,
                dataIndex: 'processGroup.prcGrpNm',
                key: 'processGroup.prcGrpNm',
                align: 'center',
                editable: true,
                editType: 'select',
                selectOptions: dataGroup?.map((item:processGroupRType)=>({value:item.id,label:item.prcGrpNm})) ?? [],
                selectValue: 'processGroup.id',
                req: true,
              },
              {
                title: '공정명',
                width: 100,
                dataIndex: 'process.prcNm',
                key: 'process.prcNm',
                align: 'center',
                editable: true,
                editType: 'select',
                selectOptions: dataProcess?.map((item:processRType)=>({value:item.id,label:item.prcNm})) ?? [],
                selectValue: 'process.id',
                req: true,
              },
              {
                title: '불량명',
                width: 100,
                dataIndex: 'process.prcNm',
                key: 'process.prcNm',
                align: 'center',
                editable: true,
                editType: 'select',
                selectValue: 'process.id',
                req: true,
              },
              {
                title: '불량순서',
                width: 80,
                dataIndex: 'process.prcNm',
                key: 'process.prcNm',
                align: 'center',
                editable: true,
                editType: 'select',
                selectValue: 'process.id',
                req: true,
              },
              {
                title: '타입',
                width: 80,
                dataIndex: 'process.prcNm',
                key: 'process.prcNm',
                align: 'center',
                editable: true,
                editType: 'select',
                selectValue: 'process.id',
                req: true,
              },
              {
                title: '내용',
                dataIndex: 'process.prcNm',
                key: 'process.prcNm',
                align: 'center',
                editable: true,
                editType: 'select',
                selectValue: 'process.id',
                req: true,
              },
              {
                title: '사용여부',
                width: 130,
                dataIndex: 'useYn',
                key: 'useYn',
                align: 'center',
                editable: true,
                editType: 'toggle',
              },
            ]}
            data={[]}
          />
        </div>
      </div>
    </>
  )
}

WkBadListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default WkBadListPage;