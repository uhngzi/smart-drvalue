import { useQuery } from "@tanstack/react-query";
import { Button, Radio, Tree, TreeDataNode } from "antd";
import { SetStateAction, useEffect, useMemo, useState } from "react";
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
import AntdInput from "@/components/Input/AntdInput";

interface Props {
  open: boolean;
  detailData: specType;
  setUpdatePrc: React.Dispatch<SetStateAction<boolean>>;
}

const ProcessSelection: React.FC<Props> = ({
  detailData,
  setUpdatePrc,
}) => {
  const { showToast, ToastContainer } = useToast();

  // 알림창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"already" | "error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");

  // 체크 박스 값
  const [ selectedKeys, setSelectedKeys ] = useState<string[]>([]);

  // ------------- 트리 데이터 세팅 ----------- 시작
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);
  const [ dataProcessGrp, setDataProcessGrp ] = useState<processGroupRType[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<{pid:string, vid:string, vname:string}[]>([]);
  const { data:queryData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['process-group/jsxcrud/many'],
    queryFn: async () => {
      setDataLoading(true);
      setDataProcessGrp([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'process-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        const data = result.data.data ?? [];
        setDataProcessGrp(data);
      } else {
        console.log('error:', result.response);
      };
      setDataLoading(false);
      return result;
    },
  });

  const treeData = useMemo(() => {
    return dataProcessGrp.map((item: processGroupRType) => ({
      title: (
        <div className="parent-node flex items-center gap-10">
          <Star />
          <div className="flex-1 v-between-h-center">
            <span>{item.prcGrpNm}</span>
            <span className="parent-count font-bold text-[#888]">{item.processes.length}</span>
          </div>
        </div>
      ),
      key: item.id,
      checkable: false,
      children: item.processes.map((process: processRType) => ({
        title: (
          <div className="child-node">
            <div className="process-name">
              <span>{process.prcNm}</span>
            </div>
            { process.processVendors && process.processVendors.length > 0 && 
            <div className="vendor-group-node" onClick={(e) => e.stopPropagation()} style={{marginLeft:10}}>
              <Radio.Group
                value={
                  selectedVendors.find((sv) =>
                    String(sv.pid) === String(process.id)
                  )?.vid || ""
                }
              >
                {process.processVendors.map((pvendor) => (
                  <Radio
                    className="vendor-node"
                    key={pvendor.vendor.id}
                    value={pvendor.vendor.id}
                    onClick={(e)=>{
                      e.stopPropagation();
                      handleVendorSelect(process.id, pvendor.vendor.id, pvendor.vendor.prtNm);
                    }}
                  >
                    {pvendor?.vendor?.prtNm}
                  </Radio>
                ))}
              </Radio.Group>
            </div>}
          </div>
        ),
        key: process.id,
        checkable: true,
      })),
    }));
  }, [dataProcessGrp, selectedVendors]);
  
  const handleVendorSelect = (processId: string, vendorId: string, vendorName: string) => {
    if (!selectPrdGrp?.id) {
      showToast("제품군을 선택해주세요.", "error");
      return;
    }

    // 프로세스가 체크되지 않은 상태라면 자동으로 체크 처리
    if (!selectedKeys.includes(processId)) {
      setSelectedKeys(prev => [...prev, processId]);
      // dataProcess에서 해당 프로세스를 찾아 selectedPrc에 추가 (dataProcess는 공정 데이터가 저장된 state입니다)
      const addData = dataProcess.find(f => f.id === processId);
      if (addData) {
        setSelectPrc(prev => [...prev, addData]);
      }
    }
  
    setSelectedVendors((prev) => {
      const exists = prev.find(item => item.pid === processId);
      if (exists && exists.vid === vendorId) {
        // 이미 선택되어 있으면 해제
        return prev.filter(item => item.pid !== processId);
      } else {
        // 동일 processId가 있다면 업데이트, 없으면 추가
        return [...prev.filter(item => item.pid !== processId), { pid: processId, vid: vendorId, vname: vendorName }];
      }
    });
  };
  
  const [prcData, setPrcData] = useState<any>();
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

  // 제품군 그룹 선택값
  const [ selectPrdGrp, setSelectPrdGrp ] = useState<productLinesGroupRType | null>(null);
  // 선택한 제품군의 공정들
  const [ selectPrdPrcGrp, setSelectPrdPrcGrp ] = useState<processRType[]>([]);
  // 사용자가 선택한 공정들 (저장될 값 / 공정을 임의로 추가, 삭제할 수 있으므로 따로 저장)
  const [ selectPrc, setSelectPrc ] = useState<processRType[]>([]);

  // 제품군 그룹 선택 후 공정 변경 시 실행 함수
  const handleChangePrc = () => {
    let arr = [] as string[];
    let varr = [] as {pid:string, vid:string, vname:string}[];
    console.log(selectPrdPrcGrp);
    selectPrdPrcGrp?.map((item:processRType) => {
      arr.push(item.id);
      const vid = dataProcessGrp.find(f=>f.id === item.processGroup?.id)?.processes.find(f=>f.id === item.id)?.processVendors?.[0]?.vendor;
      if(vid) varr.push({pid: item.id, vid: vid?.id, vname: vid?.prtNm})
    })
    setSelectedKeys(arr);
    setSelectedVendors(varr);
    setSelectPrc(selectPrdPrcGrp);
  }

  // 공정 저장을 눌렀을 경우 실행
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
        prdGrpIdx: selectPrdGrp.id,
        prdGrpNm: selectPrdGrp.name,
        data: selectPrc.map((item:processRType, index:number) => ({
          prcIdx: item.id,
          vendorIdx: selectedVendors.find(f=>f.pid === item.id)?.vid ?? "",
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
        setUpdatePrc(true);
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  // 디플트 값 세팅
  useEffect(()=>{
    if((detailData.specPrdGroupPrcs ?? []).length > 0) {
      // 제품군 디폴트 선택
      const rdata = prdGrpQueryData?.data.data as productLinesGroupRType[];
      const prc = rdata?.find(f=> f.id === detailData.specPrdGroupPrcs?.[0]?.productLinesGroup?.id);
      if(prc) {
        setSelectPrdGrp(prc);
      }
      
      // 스팩 내 선택된 공정 추가
      let defaultPrc = [] as processRType[];
      let defaultKey = [] as string[];
      let defaultVndr = [] as {pid:string, vid:string, vname:string}[];
      detailData.specPrdGroupPrcs?.map((item) => {
        if(item.process) {
          defaultPrc.push({ ...item.process, remark: item.prcWkRemark });
          defaultKey.push(item.process.id);
          if(item.vendor) {
            defaultVndr.push({pid:item.process.id, vid:item.vendor.id, vname:item.vendor?.prtNm});
          }
        }
      });
      setSelectPrc(defaultPrc);
      setSelectedKeys(defaultKey);
      setSelectedVendors(defaultVndr);
    }
  }, [detailData.specPrdGroupPrcs, prdGrpQueryData]);

  return (
    <div className="w-full h-full h-center gap-10">
      <div className="w-1/3 h-[650px] bg-white rounded-14 p-30 flex flex-col gap-20 border-[0.3px] border-line">
        <TitleModalSub title="선택 제품군의 공정 지정" />
        <div className="w-full flex flex-col gap-10">
          <div className="w-full h-32 h-center gap-10">
            <p className="flex-none">제품군 선택</p>
            <div className="flex-1">
              <AntdSelect
                options={prdGrpSelectList}
                value={selectPrdGrp?.id}
                onChange={(e) => {
                  const value = e+"" as string;
                  const rdata = prdGrpQueryData?.data.data as productLinesGroupRType[];
                  const prc = rdata.find(f=> f.id === value);
                  console.log(prc, rdata);

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

                  if(selectedKeys.length > 0) {
                    setResultOpen(true);
                    setResultType("already");
                  } else {
                    setResultType("");
                    handleChangePrc();
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
              treeData={treeData}
              switcherIcon={null}
              checkedKeys={selectedKeys}
              onCheck={(_, info) => {
                if (!selectPrdGrp?.id) {
                  showToast("제품군을 선택해주세요.", "error");
                  return;
                }
              
                const id = info.node.key?.toString();
                if (info.checked) {
                  setDataLoading(true);
                  setSelectedKeys((prev: string[]) => [...prev, id]);
              
                  // 기존에 선택한 프로세스 데이터 추가
                  const addData = dataProcess.find(f => f.id === id);
                  const vendors = dataProcessGrp.find(f => f.id === addData?.processGroup?.id)?.processes.find(f=>f.id === id)?.processVendors
                  if (addData) {
                    setSelectPrc([...selectPrc, { ...addData }]);
              
                    // 자동으로 첫번째 벤더 선택 (processVendors 배열이 있고, 길이가 0보다 크면)
                    if (vendors && vendors.length > 0) {
                      setSelectedVendors(prev => [
                        ...prev,
                        { pid: addData.id, vid: vendors?.[0].vendor?.id, vname: vendors?.[0]?.vendor?.prtNm}
                      ]);
                    }
                  }
                  setDataLoading(false);
                } else {
                  setSelectedKeys((prev: string[]) => prev.filter((key: string) => key !== id));
                  if (selectPrc && selectPrc.length > 0)
                    setSelectPrc(selectPrc.filter((f) => f.id !== id));
              
                  // 체크 해제 시 해당 프로세스에 대한 벤더 선택값도 삭제
                  setSelectedVendors(prev => prev.filter(item => item.pid !== id));
                }
              }}
              onClick={(_, info) => {
                console.log("1");
                if(!selectPrdGrp?.id) {
                  showToast("제품군을 선택해주세요.", "error");
                  return;
                }

                if(info.children) {
                  let addArr = selectPrc;
                  info.children.map((child:any) => {
                    const id = child.key?.toString();
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
      <div className="w-2/3 h-[650px] bg-white rounded-14 p-30 gap-20 border-[0.3px] border-line">
        <TitleModalSub title="선택된 공정별 작업 방법" />
        <div className="w-full h-[calc(100%-80px)] flex flex-col gap-10 overflow-y-auto">
          {
            dataProcessGrp.map((group:processGroupRType) => (
              group.processes?.map((process:processRType) => (
                selectedKeys.includes(process.id) ? 
                <div key={process.id} className="w-full min-h-70 border-[0.6px] border-line rounded-14 px-30 h-center gap-10">
                  <Star />
                  <div className="flex-1 h-full h-center gap-50">
                    <div className="w-[200px] h-center font-medium" style={{letterSpacing:-0.05}}>
                      {group.prcGrpNm + ' > ' + process.prcNm + ' (' + (selectedVendors.find(f=>f.pid === process.id)?.vname ?? "")+')'}
                    </div>
                    <div className="flex-1 h-full h-center gap-10 text-[#444444]" style={{letterSpacing:-0.05}}>
                      <div className="flex-1 h-full h-center whitespace-pre-wrap">
                        <AntdInput
                          value={selectPrc?.find(f=>f.id.includes(process.id))?.remark ?? process.remark}
                          onChange={(e)=>{
                            const updateData = selectPrc;
                            const index = updateData.findIndex(f=>f.id === process.id)
                            if(index > -1) {
                              updateData[index] = { ...updateData[index], remark: e.target.value };
                      
                              const newArray = [
                                ...updateData.slice(0, index),
                                updateData[index],
                                ...updateData.slice(index + 1)
                              ];
                              setSelectPrc(newArray);
                            }
                          }}
                        />
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
        <div className="v-h-center">
          <Button
            className="h-32 rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
            onClick={()=>{
              handleSubmit();
            }}
          >
            <Arrow /> 공정 저장
          </Button>
        </div>
      </div>
      
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "already" ? "선택한 공정이 이미 존재합니다." :
          resultType === "error" ? "오류 발생" :
          // resultType === "close" ? "저장하지 않은 내용이 존재합니다." :
          ""
        }
        contents={
          resultType === "already" ? <div>해당 제품군의 공정으로 변경하시겠습니까?</div> : 
          resultType === "error" ? <div>{errMsg}</div> : 
          // resultType === "close" ? <div>저장하지 않고 닫을 경우 입력한 데이터가 삭제됩니다.<br/>정말 닫으시겠습니까?</div> : 
          <div></div>}
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
        hideCancel={resultType === "error" ? true : false}
        okText="선택한 제품군의 공정으로 변경 할래요"
        cancelText="현재 공정으로 할래요"
      />
      <ToastContainer/>
    </div>
  );
};

const TreeStyled = styled.div`
  width: 100%;
  height: 480px;
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
    display: flex;
    flex-direction: column;
  }

  & .process-name {
    font-size: 14px;
    height: 40px;
    display: flex;
    align-items: center;
  }

  & .vendor-node {
    margin: 5px 20px 5px 0;
    display: flex;
    height: 30px;
    align-items: center;
  }

  & .ant-tree-checkbox {
    height: 100%;
    align-self: start;
    margin-top: 12px;
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
