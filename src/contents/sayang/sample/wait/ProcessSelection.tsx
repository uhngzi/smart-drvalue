import { useQuery } from "@tanstack/react-query";
import { Button, Tree, TreeDataNode } from "antd";
import { SetStateAction, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import styled from "styled-components";

import AntdSelect from "@/components/Select/AntdSelect";
import TitleModalSub from "@/components/Text/TitleModalSub";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";

import useToast from "@/utils/useToast";

import { apiGetResponseType } from "@/data/type/apiResponse";
import { processGroupRType, processRType } from "@/data/type/base/process";
import { productLinesGroupRType, productLinesRType } from "@/data/type/base/product";
import { selectType } from "@/data/type/componentStyles";
import { specType } from "@/data/type/sayang/sample";

import Star from "@/assets/svg/icons/star.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";

interface Props {
  detailData: specType;
}

const ProcessSelection: React.FC<Props> = ({
  detailData,
}) => {
  const { showToast, ToastContainer } = useToast();

  // 알림창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"already" | "">("");

  // 체크 박스 값
  const [ selectedKeys, setSelectedKeys ] = useState<string[]>([]);

  // ------------- 트리 데이터 세팅 ----------- 시작
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);
  const [ dataTree, setDataTree ] = useState<TreeDataNode[]>([]);
  const [ dataProcessGrp, setDataProcessGrp ] = useState<processGroupRType[]>([]);
  const { data:queryData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['process-group/jsxcrud/many'],
    queryFn: async () => {
      setDataLoading(true);
      setDataTree([]);
      setDataProcessGrp([]);
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
              <div className="flex-1 v-between-h-center">
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
        setDataProcessGrp(data);
      } else {
        console.log('error:', result.response);
      };
      setDataLoading(false);
      return result;
    },
  });
  // ------------- 트리 데이터 세팅 ----------- 끝

  // ------------- 공정 데이터 세팅 ----------- 시작
  const [ dataProcess, setDataProcess ] = useState<processRType[]>([]);
  const { data:prcQueryData } = useQuery<
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
        setDataProcess(result.data.data ?? []);
      } else {
        console.log('error:', result.response);
      }

      setPrdGrpLoading(false);
      return result;
    },
  });
  // ------------ 공정 데이터 세팅 ------------ 끝

  // ------------ 제품군 데이터 세팅 ----------- 시작
  const [ prdGrpLoading, setPrdGrpLoading ] = useState<boolean>(true);
  const [ prdGrpSelectList, setPrdGrpSelectList ] = useState<selectType[]>([]);
  const { data:prdGrpQueryData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['product-lines-group/jsxcrud/many'],
    queryFn: async () => {
      setPrdGrpLoading(true);
      setPrdGrpSelectList([]);

      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'product-lines-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data.data ?? []).map((d:productLinesGroupRType)=>({
          value: d.id,
          label: d.name
        }))
        setPrdGrpSelectList(arr);
      } else {
        console.log('error:', result.response);
      }

      setPrdGrpLoading(false);
      return result;
    },
  });
  // ---------- 제품군 그룹 데이터 세팅 ---------- 끝

  // 선택한 제품군 그룹
  const [ selectPrdGrp, setSelectPrdGrp ] = useState<productLinesGroupRType | null>(null);
  // 선택한 제품군의 공정들
  const [ selectPrdPrcGrp, setSelectPrdPrcGrp ] = useState<processRType[]>([]);
  // 선택한 공정들 (저장될 값)
  const [ selectPrc, setSelectPrc ] = useState<processRType[]>([]);

  // 제품군 그룹 선택 후 공정 변경 시 실행 함수
  const handleChangePrc = () => {
    let arr = [] as string[];
    selectPrdPrcGrp?.map((item:processRType) => {
      arr.push(item.id);
    })
    setSelectedKeys(arr);
    setSelectPrc(selectPrdPrcGrp);
  }

  // 편집 저장을 눌렀을 경우 실행
  const handleSubmit = async () => {
    try {
      if(!selectPrdGrp) {
        showToast("제품군을 선택해주세요.", "error");
        return;
      }
  
      if(selectPrc.length < 1) {
        showToast("공정을 선택해주세요.", "error");
        return;
      }
  
      const jsonData = {
        specId: detailData.id,
        prdGrpNm: selectPrdGrp.name,
        data: selectPrc.map((item:processRType, index:number) => ({
          prcIdx: item.id,
          order: index,
          prcWkRemark: item.remark
        }))
      }
      console.log(jsonData);

      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'spec/prd-group/default/save',
        jsx: 'default',
        etc: true,
      }, jsonData);

      if(result.resultCode === "OK_0000") {
        showToast("저장 완료", "success");
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  // 디플트 값 세팅
  useEffect(()=>{
    if((detailData.specPrdGroupPrcs ?? []).length > 0) {
      // 제품군 그룹 아이디가 없어서 일단 보류..
      // const group = dataProcessGrp.find(f=> f.prcGrpNm === detailData.specPrdGroupPrcs?.[0].prdGrpNm);
      // console.log(group, detailData.specPrdGroupPrcs);
      // selectPrdGrp

      // 스팩 내 선택된 공정 추가
      let defaultPrc = [] as processRType[];
      let defaultKey = [] as string[];
      detailData.specPrdGroupPrcs?.map((item) => {
        if(item.process) {
          defaultPrc.push(item.process);
          defaultKey.push(item.process.id);
        }
      });
      setSelectPrc(defaultPrc);
      setSelectedKeys(defaultKey);
    }
  }, [detailData.specPrdGroupPrcs]);

  return (
    <div className="w-full h-full h-center gap-10">
      <div className="w-1/3 h-[700px] bg-white rounded-14 p-30 flex flex-col gap-20 border-[0.3px] border-line">
        <TitleModalSub title="선택 제품군의 공정 지정" />
        <div className="w-full flex flex-col gap-10">
          <div className="w-full h-32 h-center gap-10">
            <p className="flex-none">제품군 선택</p>
            <div className="flex-1">
              <AntdSelect
                options={prdGrpSelectList}
                value={selectPrdGrp?.id}
                onChange={(e) => {
                  if(selectedKeys.length > 0) {
                    setResultOpen(true);
                    setResultType("already");
                  } else {
                    setResultType("");
                    handleChangePrc();
                  }

                  const value = e+"" as string;
                  const rdata = prdGrpQueryData?.data.data as productLinesGroupRType[];
                  const prc = rdata.find(f=> f.id === value);
                  if(prc) {
                    if(prc.productLines) {
                      let arr = [] as processRType[];
                      prc.productLines.map((item:productLinesRType) => {
                        if(item.process)  arr.push({...item.process, remark:item.prcWkRemark});
                      });
                      setSelectPrdPrcGrp(arr);
                    }
                    setSelectPrdGrp(prc);
                  }
                }}
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
                const id = info.node.key.toString();
                if(info.checked) {  // 체크가 안 되어 있을 경우 값 추가
                  setDataLoading(true);
                  setSelectedKeys((prev:Array<string>) => [...prev, id]);

                  // 선택한 제품군 값 자동 추가
                  const addData = dataProcess.find(f=> f.id === id);
                  if(addData)
                    setSelectPrc([
                      ...selectPrc,
                      { ...addData },
                    ]);
                  setDataLoading(false);
                } else {            // 이미 체크 되어 있을 경우 값 삭제
                  setSelectedKeys((prev:Array<string>) => prev.filter((key:string) => key !== id));

                  // 선택한 제품군 값 자동 삭제
                  if(selectPrc && selectPrc.length > 0) 
                    setSelectPrc(selectPrc?.filter((f) => f.id !== id));
                }
              }}
              onClick={(_, info) => {
                if(info.children) {
                  let addArr = selectPrc;
                  info.children.map((child:any) => {
                    const id = child.key.toString();
                    if(selectedKeys.includes(id)) {
                      // 이미 자식의 키를 가지고 있는 경우 해당 자식의 키는 체크 해제
                      // ... 근데 만약에 2개를 이미 선택했고 전체를 선택하고 싶은 경우에는.. 미정...
                      setSelectedKeys((prev:Array<string>) => prev.filter((key:string) => key !== id));
                      addArr = addArr.filter(f => f.id !== id);
                    } else {
                      // 자식의 키를 추가
                      setSelectedKeys((prev:Array<string>) => [...prev, id]);
                      const addData = dataProcess.find(f=> f.id === id);
                      if(addData) addArr.push(addData as processRType);
                    }
                  });
                  setSelectPrc(addArr);
                }
              }}
            />}
          </TreeStyled>
        </div>
      </div>
      <div className="w-2/3 h-[700px] bg-white rounded-14 p-30 gap-20 border-[0.3px] border-line">
        <TitleModalSub title="선택된 공정별 작업 방법" />
        <div className="w-full h-[550px] flex flex-col gap-10 overflow-y-auto">
          {
            dataProcessGrp.map((group:processGroupRType) => (
              group.processes?.map((process:processRType) => (
                selectedKeys.includes(process.id) ? 
                <div key={process.id} className="w-full min-h-70 border-[0.6px] border-line rounded-14 px-30 h-center gap-10">
                  <Star />
                  <div className="flex-1 h-full h-center gap-50">
                    <div className="w-[150px] h-center font-medium" style={{letterSpacing:-0.05}}>
                      {group.prcGrpNm + ' > ' + process.prcNm}
                    </div>
                    <div className="flex-1 h-full h-center gap-10 text-[#444444]" style={{letterSpacing:-0.05}}>
                      <div className="flex-1 h-full h-center whitespace-pre-wrap">
                        {
                          selectPrc?.find(f=>f.id.includes(process.id))?.remark
                        }
                      </div>
                      <div
                        className="w-32 h-32 rounded-50 bg-back v-h-center cursor-pointer"
                        onClick={() => {
                          setSelectedKeys((prev:Array<string>) => prev.filter((key:string) => key !== process.id));
                          setSelectPrc(selectPrc.filter(f => f.id !== process.id));
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
        <div className="v-h-center mt-20">
          <Button
            className="h-32 rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
            onClick={()=>{
              handleSubmit();
            }}
          >
            <Arrow /> 편집 저장
          </Button>
        </div>
      </div>
      
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "already" ? "선택한 공정이 이미 존재합니다." :""}
        contents={resultType === "already" ? <div>해당 제품군의 공정으로 변경하시겠습니까?</div> : <div></div>}
        type="warning"
        onOk={()=>{
          if(resultType === "already"){
            handleChangePrc();
          }
          setResultOpen(false);
        }}
        onCancle={()=>{
          setResultOpen(false);
        }}
        okText="선택한 제품군의 공정으로 변경 할래요"
        cancelText="현재 공정으로 할래요"
      />
      <ToastContainer/>
    </div>
  );
};

const TreeStyled = styled.div`
  width: 100%;
  height: 550px;
  font-weight: 500;
  overflow-y: auto;

  & .ant-tree-switcher {
    display: none;
  }

  & .ant-tree-switcher:before {
    display: none;
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
