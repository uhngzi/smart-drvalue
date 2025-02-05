import { getAPI } from "@/api/get";
import AntdSelect from "@/components/Select/AntdSelect";
import TitleModalSub from "@/components/Text/TitleModalSub";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { processGroupRType, processRType } from "@/data/type/base/process";
import { useQuery } from "@tanstack/react-query";
import { Tree, TreeDataNode } from "antd";
import { useState } from "react";

import Star from "@/assets/svg/icons/star.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import styled from "styled-components";

const ProcessSelection: React.FC = () => {
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);
  const [ dataTree, setDataTree ] = useState<Array<TreeDataNode>>([]);
  const [ dataProcess, setDataProcess ] = useState<Array<processGroupRType>>([]);
  const { data:queryData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['sayang', 'sample', 'wait', 'add', 'process'],
    queryFn: async () => {
      setDataLoading(true);
      setDataTree([]);
      setDataProcess([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        const data = result.data.data ?? [];
        const arr = data.map((item:processGroupRType) => ({
          title: 
            <div className="parent-node flex items-center gap-10">
              <Star />
              <div className="flex-1 h-center justify-between">
                <span>{item.prcGrpNm}</span>
                <span className="parent-count font-bold text-[#888]">{item.processes.length}</span>
              </div>
            </div>,
          key: item.id,
          checkable: false,
          children: item.processes.map((process:processRType) => ({
            title: 
              <div className="child-node">
                <span>{process.prcNm}</span>
              </div>,
            key: process.id,
          })),
        }));
        setDataTree(arr);
        setDataProcess(data);
      } else {
        console.log('error:', result.response);
      };
      setDataLoading(false);
      return result;
    },
  });
  
  const [ selectedKeys, setSelectedKeys ] = useState<Array<string>>([]);
  
  return (
    <div className="w-full h-full h-center gap-10">
      <div className="w-1/3 min-h-[700px] bg-white rounded-14 p-30 flex flex-col gap-20 border-[0.3px] border-line">
        <TitleModalSub title="선택 제품군의 공정 지정" />
        <div className="w-full flex flex-col gap-10">
          <div className="w-full h-32 h-center gap-10">
            <p className="flex-none">제품군선택</p>
            <div className="flex-1">
              <AntdSelect
                options={[]}
              />
            </div>
          </div>
          <TreeStyled>
            {!dataLoading &&
            <Tree
              showIcon
              checkable
              defaultExpandAll
              treeData={dataTree}
              switcherIcon={null}
              checkedKeys={selectedKeys}
              onCheck={(_, info) => {
                if(info.checked) {
                  setDataLoading(true);
                  setSelectedKeys((prev:Array<string>) => [...prev, info.node.key.toString()]);
                  setDataLoading(false);
                } else {
                  setSelectedKeys((prev:Array<string>) => prev.filter((key:string) => key !== info.node.key.toString()));
                }
              }}
              onClick={(_, info) => {
                if(info.children) {
                  info.children.map((child:any) => {
                    if(selectedKeys.includes(child.key.toString())) {
                      setSelectedKeys((prev:Array<string>) => prev.filter((key:string) => key !== child.key.toString()));
                    } else {
                      setSelectedKeys((prev:Array<string>) => [...prev, child.key.toString()]);
                    }
                  });
                }
              }}
            />}
          </TreeStyled>
        </div>
      </div>
      <div className="w-2/3 min-h-[700px] bg-white rounded-14 p-30 gap-20 border-[0.3px] border-line">
        <TitleModalSub title="선택된 공정별 작업 방법" />
        <div className="w-full flex flex-col gap-10">
          {
            dataProcess.map((group:processGroupRType) => (
              group.processes?.map((process:processRType) => (
                selectedKeys.includes(process.id) ? 
                <div key={process.id} className="w-full h-70 border-[0.6px] border-line rounded-14 px-30 h-center gap-10">
                  <Star />
                  <div className="flex-1 h-full h-center gap-50">
                    <div className="w-[120px] h-center" style={{letterSpacing:-0.05, fontWeight:500}}>
                      {group.prcGrpNm + ' > ' + process.prcNm}
                    </div>
                    <div className="flex-1 h-full h-center gap-10 text-[#444444]" style={{letterSpacing:-0.05, fontWeight:400}}>
                      <div className="flex-1 h-full h-center whitespace-pre-wrap">
                        최소 비트 : 0.2mm<br />
                        NC관리번호 : 75434-343
                      </div>
                      <div
                        className="w-32 h-32 rounded-50 bg-back v-h-center cursor-pointer"
                        onClick={() => {
                          setSelectedKeys((prev:Array<string>) => prev.filter((key:string) => key !== process.id));
                        }}
                      >
                        <p className="w-14 h-14"><Trash /></p>
                      </div>
                    </div>
                  </div>
                </div> : <></>
              ))
            ))
          }
        </div>
      </div>
    </div>
  );
};

const TreeStyled = styled.div`
  width: 100%;
  height: 100%;
  font-weight: 500;

  & .ant-tree-switcher {
    display: none;
    // height: 100%;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }

  & .ant-tree-switcher:before {
    display: none;
    // height: 100%;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }

  & .ant-tree-treenode {
    width: 100%;
    margin: 0px;
  }

  & .ant-tree-node-content-wrapper {
    display: block;
    width: 100%;
    padding-inline: 0px;
  }

  & .parent-node {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 9px 20px;
  }

  & .child-node {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 9px 0px;
  }

  & .ant-tree-checkbox {
    margin-left: 20px;
    & .ant-tree-checkbox-inner {
      border-radius: 2px;
    }
  }

  & .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
    background-color: #4880FF;
    border-color: #4880FF;
  }

  & .ant-tree-node-selected {
    border-radius: 8px !important;
    background-color: #DFE9FF !important;
    color: #4880FF !important;

    & .parent-count {
      color: #4880FF !important;
    }
  }
`;

export default ProcessSelection;
