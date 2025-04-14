import { useQuery } from "@tanstack/react-query";
import { Button, Radio, Tree, TreeDataNode } from "antd";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import styled from "styled-components";

import AntdSelect from "@/components/Select/AntdSelect";
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
import { Popup } from "@/layouts/Body/Popup";
import { LabelMedium } from "@/components/Text/Label";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import FullChip from "@/components/Chip/FullChip";

interface Props {
  open: boolean;
  detailData: specType;
  setDetailData: React.Dispatch<SetStateAction<specType>>;
  setUpdatePrc: React.Dispatch<SetStateAction<boolean>>;
  prdGrpQueryData: apiGetResponseType | undefined;
  prdGrpSelectList: selectType[];
  selectPrdGrp: productLinesGroupRType | null;
  selectPrc: processRType[];
  selectedKeys: string[];
  selectedVendors: {
    pid: string;
    vid: string;
    vname: string;
  }[];
  setSelectPrdGrp: React.Dispatch<SetStateAction<productLinesGroupRType | null>>;
  setSelectPrc: React.Dispatch<SetStateAction<processRType[]>>;
  setSelectedKeys: React.Dispatch<SetStateAction<string[]>>;
  setSelectedVendors: React.Dispatch<SetStateAction<{
    pid: string;
    vid: string;
    vname: string;
  }[]>>;
  view: string | string[] | undefined;
}

const ProcessSelection: React.FC<Props> = ({
  open,
  detailData,
  setDetailData,
  setUpdatePrc,
  prdGrpQueryData,
  prdGrpSelectList,
  selectPrdGrp,
  selectPrc,
  selectedKeys,
  selectedVendors,
  setSelectPrdGrp,
  setSelectPrc,
  setSelectedKeys,
  setSelectedVendors,
  view,
}) => {
  const { showToast, ToastContainer } = useToast();

  // 알림창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"already" | "error" | "">("");
  const [selectPrdGrpTmp, setSelectPrdGrpTmp] = useState<productLinesGroupRType | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");


  // ------------- 트리 데이터 세팅 ----------- 시작
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);
  const [ dataProcessGrp, setDataProcessGrp ] = useState<processGroupRType[]>([]);
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
      },{
        sort: "ordNo,ASC"
      });

      if (result.resultCode === 'OK_0000') {
        const data = result.data?.data ?? [];
        setDataProcessGrp(data);
      } else {
        console.log('error:', result.response);
      };
      setDataLoading(false);
      return result;
    },
  });

  const treeData = useMemo(() => {
    return dataProcessGrp.sort((a, b) => a.ordNo - b.ordNo).map((item: processGroupRType) => ({
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
      children: item.processes.sort((a, b) => (a.ordNo ?? 0) - (b.ordNo ?? 0)).map((process: processRType) => ({
        title: (
          <div
            className="child-node"
            style={{cursor:view?"no-drop":"pointer"}}
          >
            <div className="process-name h-center gap-5">
              {!process.isInternal && <FullChip label="외주" state="mint"/>}
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
                {process?.processVendors?.map((pvendor) => (
                  <Radio
                    className="vendor-node"
                    key={pvendor.vendor.id}
                    value={pvendor.vendor.id}
                    style={{cursor:view?"no-drop":"pointer",color:"#4880FF"}}
                    onClick={(e)=>{
                      if (view) {
                        e.preventDefault();
                        return;
                      }
                      e.stopPropagation();
                      handleVendorSelect(process.id, (pvendor?.vendor?.id ?? ""), (pvendor?.vendor?.prtNm ?? ""));
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
      },{
        sort: "ordNo,ASC"
      });

      if (result.resultCode === 'OK_0000') {
        setDataProcess(result.data?.data ?? []);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });
  // ------------ 공정 데이터 세팅 ------------ 끝

  // 선택한 제품군의 공정들
  const [ selectPrdPrcGrp, setSelectPrdPrcGrp ] = useState<processRType[]>([]);

  // 제품군 그룹 선택 후 공정 변경 시 실행 함수
  const handleChangePrc = (processes?:processRType[]) => {
    let arr = [] as string[];
    let varr = [] as {pid:string, vid:string, vname:string}[];
    if(processes) {
      processes?.map((item:processRType) => {
        arr.push(item.id);
        const vid = dataProcessGrp.find(f=>f.id === item.processGroup?.id)?.processes.find(f=>f.id === item.id)?.processVendors?.[0]?.vendor;
        if(vid) varr.push({pid: item.id, vid: (vid?.id ?? ""), vname: (vid?.prtNm ?? "")})
      })
      setSelectPrc(processes);
    } else {
      selectPrdPrcGrp.map((item:processRType) => {
        arr.push(item.id);
        const vid = dataProcessGrp.find(f=>f.id === item.processGroup?.id)?.processes.find(f=>f.id === item.id)?.processVendors?.[0]?.vendor;
        if(vid) varr.push({pid: item.id, vid: (vid?.id ?? ""), vname: (vid?.prtNm ?? "")})
      })
      setSelectPrc(selectPrdPrcGrp);
    }
    setSelectedKeys(arr);
    setSelectedVendors(varr);
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
          vendorIdx: selectedVendors.find(f=>f.pid === item.id)?.vid,
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
        // 값 변경 후 저장 시 true
        // 닫을 때 alert창 안 뜨게 하기 위함
        setUpdatePrc(true);
        setDetailData({
          ...detailData,
          specPrdGroupPrcs: jsonData?.data?.map((item, index) => ({
            ordNo: item.order,
            prcWkRemark: item.prcWkRemark,
            prdGrpNm: selectPrdGrp.name,
            process: {id: item.prcIdx },
            productLinesGroup: { id: selectPrdGrp.id },
            vendor: { id: item.vendorIdx, prtNm:selectedVendors.find(f=>f.vid === item.vendorIdx)?.vname },
          }))
        })
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

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };
  // ★ 드래그가 종료될 때(유효/무효 상관없이) 플레이스홀더 없애기
  const handleDragEnd = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) {
      setDragOverIndex(null);
      return;
    }
    // draggedItemIndex가 dropIndex보다 작다면 배열에서 제거로 인해 인덱스가 당겨지므로 1을 빼준다.
    let newIndex = dropIndex;
    if (draggedItemIndex < dropIndex) {
      newIndex = dropIndex - 1;
    }
    const updated = [...selectPrc];
    const [movedItem] = updated.splice(draggedItemIndex, 1);
    updated.splice(newIndex, 0, movedItem);
    setSelectPrc(updated);
  
    // 드롭 후 상태 초기화
    setDragOverIndex(null);
    setDraggedItemIndex(null);
  };

  return (
    <div className="w-full h-full h-center gap-10">
      <Popup
        className="!w-1/3 !h-[650px] !flex-col"
      >
        <LabelMedium label="선택 제품군의 공정 지정" />
        <div className="w-full flex flex-col gap-10">
          <div className="w-full h-32 h-center gap-10">
            <p className="flex-none">제품군 선택</p>
            <div className="flex-1">
              <AntdSelect
                options={prdGrpSelectList}
                value={selectPrdGrp?.id}
                onChange={(e) => {
                  const value = e+"" as string;
                  const rdata = prdGrpQueryData?.data?.data as productLinesGroupRType[];
                  const prc = rdata.find(f=> f.id === value);
                  
                  let arr = [] as processRType[];
                  if(prc && prc.productLines) {
                    prc.productLines.map((item:productLinesRType) => {
                      if(item.process)  arr.push({...item.process, remark:item.prcWkRemark});
                    });
                    setSelectPrdPrcGrp(arr);
                    setSelectPrdGrpTmp(prc);
                  }

                  if(selectedKeys.length > 0) {
                    setResultOpen(true);
                    setResultType("already");
                  } else {
                    setResultType("");
                    handleChangePrc(arr);
                    setSelectPrdGrp(prc ?? null);
                  }
                }}
              />
            </div>
          </div>
          <TreeStyled
            $cursor={view? true : false}
          >
            {!dataLoading &&
            <Tree
              showIcon
              checkable
              defaultExpandAll
              treeData={treeData}
              switcherIcon={null}
              checkedKeys={selectedKeys}
              style={view?{cursor:"no-drop"}:{}}
              onCheck={(_, info) => {
                if(view)  return;

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
                        { pid: addData.id, vid: (vendors?.[0].vendor?.id ?? ""), vname: (vendors?.[0]?.vendor?.prtNm ?? "")}
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
                if(view)  return;

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
                      // 라디오 버튼 선택 해제
                      setSelectedVendors(prev => prev.filter(item => item.pid !== id));
                    } else {
                      // 자식의 키를 추가
                      setSelectedKeys((prev:Array<string>) => [...prev, id]);
                      const addData = dataProcess.find(f=> f.id === id);
                      if(addData) addArr.push(addData as processRType);
                      // 라디오 버튼 선택
                      const vendorCandidates = dataProcessGrp
                        .find(group => group.id === addData?.processGroup?.id)
                        ?.processes.find(proc => proc.id === id)
                        ?.processVendors;
                      // 벤더 후보가 있다면 첫 번째 벤더 자동 선택
                      if (vendorCandidates && vendorCandidates.length > 0) {
                        setSelectedVendors(prev => [
                          ...prev,
                          {
                            pid: id,
                            vid: (vendorCandidates[0].vendor?.id ?? ""),
                            vname: (vendorCandidates[0].vendor?.prtNm ?? ""),
                          },
                        ]);
                      }
                    }
                  });
                  setSelectPrc(addArr);
                }
              }}
            />}
          </TreeStyled>
        </div>
      </Popup>

      <Popup
        className="!w-2/3 !h-[650px]"
      >
        <LabelMedium label="선택된 공정별 작업 방법 및 외주처" />
        <div className="w-full h-[calc(100%-80px)] flex flex-col gap-10 overflow-y-auto">
        {
          selectPrc.map((process: processRType, index: number) => {
            // group 정보를 dataProcessGrp에서 찾기
            const group = dataProcessGrp.find((g) =>
              g.processes.some((p) => p.id === process.id)
            );
            return (
              <div key={process.id} style={{ position: "relative" }}>
                {/* 드래그 시 내려놓을 위치 표시 */}
                {dragOverIndex === index && (
                  <div
                    style={{
                      height: 10,
                      backgroundColor: "#EBF3FF",
                      border: "1px dashed #4880FF",
                    }}
                  />
                )}
                <div
                  className="w-full min-h-70 border-[0.6px] border-line rounded-14 px-30 h-center gap-10"
                  draggable={!view?true:false}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(index);
                  }}
                  onDrop={(e) => {
                    handleDrop(e, index);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={handleDragEnd}
                >
                  <Star />
                  <div className="flex-1 h-full h-center gap-50">
                    <div className="w-[200px] flex flex-col font-medium" style={{ letterSpacing: -0.05 }}>
                      {group
                        ? <>
                          <span>{`${group.prcGrpNm} > ${group.processes.find(f=>f.id === process.id)?.prcNm ?? ""}`}</span>
                          <span className="text-12 text-[#4880FF]">{selectedVendors.find((sv) => sv.pid === process.id)?.vname ?? ""}</span>
                        </>
                        : process.prcNm}
                    </div>
                    <div className="flex-1 h-full h-center gap-10 text-[#444444]" style={{ letterSpacing: -0.05 }}>
                      <div className="flex-1 h-full h-center whitespace-pre-wrap">
                        <AntdInput
                          value={process.remark}
                          onChange={(e) => {
                            const newRemark = e.target.value;
                            const newSelectPrc = Array.from(selectPrc);
                            newSelectPrc[index] = { ...newSelectPrc[index], remark: newRemark };
                            setSelectPrc(newSelectPrc);
                          }}
                          disabled={view?true:false}
                        />
                      </div>
                      { !view &&
                      <div
                        className="w-32 h-32 rounded-50 bg-back v-h-center cursor-pointer"
                        onClick={() => {
                          setSelectedKeys((prev: string[]) =>
                            prev.filter((key: string) => key !== process.id)
                          );
                          setSelectedVendors(selectedVendors.filter((p) => p.pid !== process.id));
                          setSelectPrc(selectPrc.filter((p) => p.id !== process.id));
                        }}
                      >
                        <p className="w-14 h-14"><Trash /></p>
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
        </div>
        { !view &&
        <div className="v-h-center">
          <Button
            className="h-32 rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
            onClick={()=>{
              handleSubmit();
            }}
          >
            <Arrow /> 공정 저장
          </Button>
        </div>}
      </Popup>
      
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
          resultType === "already" ? <div>현재 공정에 설정한 메모도 사라집니다.<br/>정말 해당 제품군의 공정으로 변경하시겠습니까?</div> : 
          resultType === "error" ? <div>{errMsg}</div> : 
          // resultType === "close" ? <div>저장하지 않고 닫을 경우 입력한 데이터가 삭제됩니다.<br/>정말 닫으시겠습니까?</div> : 
          <div></div>}
        type="warning"
        onOk={()=>{
          if(resultType === "already"){
            handleChangePrc();
            setSelectPrdGrp(selectPrdGrpTmp);
          }
          setResultOpen(false);
        }}
        onCancel={()=>{
          setResultOpen(false);
        }}
        hideCancel={resultType === "error" ? true : false}
        okText={
          resultType === "already" ? "선택한 제품군의 공정으로 변경 할래요" :
          "확인"
        }
        cancelText={
          resultType === "already" ? "현재 공정으로 할래요" :
          "취소"
        }
        maskClosable={false}
      />
      <ToastContainer/>
    </div>
  );
};

const TreeStyled = styled.div<{
  $cursor: boolean
}>`
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
    ${props => props.$cursor ? "cursor: no-drop;" : ""}
  }

  & .child-node {
    width: 100%;
    display: flex;
    flex-direction: column;
    ${props => props.$cursor ? "cursor: no-drop;" : ""}
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
    ${props => props.$cursor ? "cursor: no-drop;" : ""}
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

  & .ant-radio-input {
    ${props => props.$cursor ? "cursor: no-drop;" : ""}
  }
`;

export default ProcessSelection;
