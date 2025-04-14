import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, Skeleton, Spin, Tooltip } from "antd";
import { useRouter } from "next/router";
import { CheckOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";

import AntdTable from "@/components/List/AntdTable";
import AntdModal from "@/components/Modal/AntdModal";
import FullOkButton from "@/components/Button/FullOkButton";
import DefaultFilter from "@/components/Filter/DeafultFilter";
import FullSubButton from "@/components/Button/FullSubButton";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import ArrayContents from "@/contents/sayang/add/array/ArrayContents";
import CutSizeContents from "@/contents/sayang/add/CutSizeContents";
import MessageContents from "@/contents/sayang/add/MessageContents";
import LaminationContents from "@/contents/sayang/add/LaminationContents";
import ProcessSelection from "@/contents/sayang/sample/wait/ProcessSelection";

import Models from "@/assets/svg/icons/sales.svg";
import Prc from "@/assets/svg/icons/data.svg";
import Down from "@/assets/svg/icons/s_drop_down.svg";
import Right from "@/assets/svg/icons/s_drop_right.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import MessageOn from "@/assets/svg/icons/message_on.svg";
import Box from "@/assets/svg/icons/spanner.svg";
import Close from "@/assets/svg/icons/s_close.svg";

import useToast from "@/utils/useToast";

import { filterType } from "@/data/type/filter";
import { useBase } from "@/data/context/BaseContext";
import { useUser } from "@/data/context/UserContext";
import { selectType } from "@/data/type/componentStyles";
import { commonCodeRType } from "@/data/type/base/common";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { sayangSampleWaitAddClmn } from "@/data/columns/Sayang";
import { changeSayangTemp } from "@/data/type/sayang/changeData";
import { specModelType, specType } from "@/data/type/sayang/sample";

import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { Popup } from "@/layouts/Body/Popup";
import { productLinesGroupRType } from "@/data/type/base/product";
import { processRType } from "@/data/type/base/process";
import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";
import cookie from "cookiejs";
import TitleIcon from "@/components/Text/TitleIcon";
import AntdDragger from "@/components/Upload/AntdDragger";

const SayangSampleAddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id, view } = router.query;
  const { showToast, ToastContainer } = useToast();
  const { me } = useUser();

  // 베이스 값 가져오기
  const { 
    board,
    surfaceSelectList,
    unitSelectList,
    vcutSelectList,
    outSelectList,
    smPrintSelectList,
    smColorSelectList,
    smTypeSelectList,
    mkPrintSelectList,
    mkColorSelectList,
    mkTypeSelectList,
    spPrintSelectList,
    spTypeSelectList,
    ozUnitSelectList,
    metarialSelectList,
    stampColorSelectList,
  } = useBase();

  // 결재
  const [filter, setFilter] = useState<filterType>({
    writeDt: null,
    writer: '',
    approveDt: null,
    approver: '',
    confirmDt: null,
    confirmPer: '',
  });
  // 결재 펼치기
  const [approval, setApproval] = useState<boolean>(false);

  // ------------ 필요 데이터 세팅 ------------ 시작
  const [ul1SelectList, setUl1TypeSelectList] = useState<selectType[]>([]);
  const { data:ul1Data } = useQuery<apiGetResponseType, Error>({
    queryKey: ["ul1"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/UL1'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setUl1TypeSelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  const [ul2SelectList, setUl2SelectList] = useState<selectType[]>([]);
  const { data:ul2Data } = useQuery<apiGetResponseType, Error>({
    queryKey: ["ul2"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'common-code/jsxcrud/many/by-cd-grp-nm/UL2'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:commonCodeRType) => ({
          value: d.id,
          label: d.cdNm,
        }))
        setUl2SelectList(arr);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ 필요 데이터 세팅 ------------ 끝

  // ------------ 제조/캠 전달사항 ------------ 시작
  const [prcNotice, setPrcNotice] = useState<string>("");
  const [camNotice, setCamNotice] = useState<string>("");

  useEffect(()=>{
    setDetailData({
      ...detailData,
      prcNotice: prcNotice,
      camNotice: camNotice,
    });
  }, [prcNotice, camNotice]);
  // ------------ 제조/캠 전달사항 ------------ 끝

  // ------------ 세부 데이터 세팅 ------------ 시작
  const [detailDataLoading, setDetailDataLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<specType>({});
  const { data:queryData, isLoading, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['spec/jsxcrud/one'],
    queryFn: async () => {
      setDetailDataLoading(true);
      
      const result = await getAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: `spec/jsxcrud/one/${id}`
      });
      return result;
    },
    enabled: !!id,
  });
  useEffect(()=>{
    if(!isLoading && queryData?.resultCode === "OK_0000") {
      const rdata = queryData?.data?.data as specType;
      const models = rdata.specModels?.map((model:specModelType, index:number) => ({
        ...model,
        index: index+1,
        pcsValue: model.pcsValue && model.pcsValue > 0 ? model.pcsValue : model.modelMatch?.orderModel.orderPrdCnt,
      }))
      setDetailData({
        ...rdata,
        specModels: models,
      });
      setPrcNotice(rdata.prcNotice ?? "");
      setCamNotice(rdata.camNotice ?? "");
      if(cookie.get('company') === 'sy' && (rdata.brdArrStorageKey ?? "").length > 0) {
        setFileIdList((rdata.brdArrStorageKey ?? "").split(','));
        setDetailChk(true);
      }
      setTimeout(() => {
        setDetailDataLoading(false);
      }, 200);
      // 작성일 : 생성 시기
      setFilter({ ...filter, writeDt: dayjs(rdata.createdAt), writer: me?.userName ?? "", })
    }
  }, [queryData]);

  const [detailChk, setDetailChk] = useState<boolean>(false);

  // 데이터 세팅 시 파일 목록이 있을 경우 파일 정보 가져와서 세팅
  useEffect(()=>{
    if(detailChk) {
      fetchFileInfo();
    }
    // 약간의 텀을 두고 update 값 변경 (form에 적용되는 세팅 시간이 있으므로 텀이 필요함)
    setTimeout(()=>setFileSubmitFlag(true), 100);
  }, [detailChk])

  const fetchFileInfo = async () => {
    if(fileIdList.length > 0) {
      let fileArr:any[] = [];
      for (const file of fileIdList) {
        const result = await getAPI({
          type: 'file-mng',
          url: `every/file-manager/default/info/${file}`,
          header: true,
        });
        
        if(result.resultCode === "OK_0000") {
          const entity = result?.data?.fileEntity;
          fileArr.push({
            ...entity,
            name: entity?.originalName,
            originFileObj: {
              name: entity?.originalName,
              size: entity?.size,
              type: entity?.type,
            }
          });
        }
      }
      setFileList(fileArr);
      // 세팅이 완료되었으므로 false (이후 실행을 방지)
      setDetailChk(false);
    }
  }
  // ------------ 세부 데이터 세팅 ------------ 끝
  
  // ----------- 모델 값 변경 함수 ------------ 시작
  const handleModelDataChange = (
    id?: string,
    name?: string,
    value?: any
  ) => {
    if(id && name) {
      // 데이터를 복사
      const updatedData = (detailData.specModels ?? []).map((item) => {
        if (item.id === id) {
          const keys = name.split("."); // ['model', 'a']
          const updatedItem = { ...item };
    
          // 마지막 키를 제외한 객체 탐색
          const lastKey = keys.pop()!;
          let targetObject: any = updatedItem;
    
          keys.forEach((key) => {
            // 중간 키가 없거나 null인 경우 초기화
            if (!targetObject[key] || typeof targetObject[key] !== "object") {
              targetObject[key] = {};
            }
            targetObject = targetObject[key];
          });
    
          // 최종 키에 새 값 할당
          targetObject[lastKey] = value;
    
          return updatedItem;
        }
        return item; // 다른 데이터는 그대로 유지
      });
    
      setDetailData({...detailData, specModels:updatedData}); // 상태 업데이트
    }
  };
  // ------------ 모델 값 변경 함수 ----------- 끝
  
  // --------------- 임시 저장  ------------- 시작
    // 조합일 경우 알림이 뜨지 않게 하기 위한 flag
  const [temp, setTemp] = useState<boolean>(true);
  const handleSumbitTemp = async (main?:boolean, cf?: boolean) => {
    try {
      const jsonData = changeSayangTemp("re", detailData);

      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'spec/default/temporary-save',
        jsx: 'default',
        etc: true,
      }, jsonData);

      if(result.resultCode === 'OK_0000') {
        if(temp) {
          showToast("임시저장 완료", "success");
        }
        // temp 값 초기화
        setTemp(true);
        setFileSubmitFlag(true);

        // 모델 추가 시 임시 저장 후 메인으로 이동
        if(main) {
          router.push({
            pathname:'/sayang/sample/regist',
            query: {id: id, text: detailData.specNo}
          });
        }

        if(cf)  handleSubmitConfirm();
      } else {
        const msg = result?.response?.data?.message;
        setResultMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } catch (e) {
      console.log('CATCH ERROR : ', e);
    }
  }
  // --------------- 임시 저장 --------------- 끝
  
  // --------------- 확정 저장 --------------- 시작
  const handleSubmitConfirm = async () => {
    try {
      const result = await patchAPI({
        type: 'core-d1',
        utype: 'tenant/',
        jsx: 'default',
        url: `spec/default/confirm/${id}`,
        etc: true,
      }, id+"", {});
      
      if(result.resultCode === "OK_0000") {
        setResultOpen(true);
        setResultType("cf");
      } else {
        const msg = result?.response?.data?.message;
        setResultMsg(msg);
        setResultType("error");
        setResultOpen(true);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // --------------- 확정 저장 --------------- 끝
  

  // ------------ 제품군 데이터 세팅 ----------- 시작
  const [ prdGrpSelectList, setPrdGrpSelectList ] = useState<selectType[]>([]);
  const { data:prdGrpQueryData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['product-lines-group/jsxcrud/many'],
    queryFn: async () => {
      setPrdGrpSelectList([]);

      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'product-lines-group/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        const arr = (result.data?.data ?? []).map((d:productLinesGroupRType)=>({
          value: d.id,
          label: d.name
        }))
        setPrdGrpSelectList(arr);
      } else {
        console.log('error:', result.response);
      }
      return result;
    },
  });
  // ------------ 제품군 데이터 세팅 ----------- 끝

  // --------------- 공정 지정 --------------- 시작
  // 공정 지정 팝업
  const [open, setOpen] = useState<boolean>(false);
  // 값 저장 여부 체크
  const [updatePrc, setUpdatePrc] = useState<boolean>(true);

  // 제품군 그룹 선택값
  const [ selectPrdGrp, setSelectPrdGrp ] = useState<productLinesGroupRType | null>(null);
  // 사용자가 선택한 공정들 (저장될 값 / 공정을 임의로 추가, 삭제할 수 있으므로 따로 저장)
  const [ selectPrc, setSelectPrc ] = useState<processRType[]>([]);
  // 체크 박스 값 (프로세스)
  const [ selectedKeys, setSelectedKeys ] = useState<string[]>([]);
  // 라디오 박스 값 (공급처)
  const [selectedVendors, setSelectedVendors] = useState<{pid:string, vid:string, vname:string}[]>([]);

  // 디플트 값 세팅
  useEffect(()=>{
    if (!open) {
      // 모달이 닫혔을 때 상태 초기화
      if ((detailData.specPrdGroupPrcs ?? []).length > 0) {
        // 제품군 디폴트 선택
        const rdata = prdGrpQueryData?.data?.data as productLinesGroupRType[];
        const prc = rdata?.find(f => f.id === detailData.specPrdGroupPrcs?.[0]?.productLinesGroup?.id);
        if(prc) setSelectPrdGrp(prc);
        
        // 스팩 내 선택된 공정들 초기화
        let defaultPrc = [] as processRType[];
        let defaultKey = [] as string[];
        let defaultVndr = [] as { pid: string; vid: string; vname: string }[];
        detailData.specPrdGroupPrcs?.
        sort((a,b) => (a.ordNo ?? 0) - (b.ordNo ?? 0)).
        forEach(item => {
          if (item.process) {
            defaultPrc.push({ ...item.process, remark: item.prcWkRemark });
            defaultKey.push(item.process.id);
            if (item.vendor) {
              defaultVndr.push({
                pid: item.process.id,
                vid: (item.vendor?.id ?? ""),
                vname: (item.vendor?.prtNm ?? ""),
              });
            }
          }
        });
        setSelectPrc(defaultPrc);
        setSelectedKeys(defaultKey);
        setSelectedVendors(defaultVndr);
      } else {
        // 초기값 없을 경우 모두 리셋
        setSelectPrdGrp(null);
        setSelectPrc([]);
        setSelectedKeys([]);
        setSelectedVendors([]);
      }
    }
  }, [open, detailData.specPrdGroupPrcs, prdGrpQueryData]);

  // 값 변경 시 false
  // 닫을 때 값이 변경되었는지 체크하기 위함 (저장이 안 됐을 경우 alert)
  useEffect(()=>{
    if(!open) {
      // 초기화 되었을 경우에는 true로 설정
      setUpdatePrc(true);
    } else {
      setUpdatePrc(false);
    }
  }, [selectPrc, selectPrdGrp, selectedVendors])
  // --------------- 공정 지정 --------------- 끝

  // 결과창
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"cf" | "error" | "del" | "processClose" | "fileClose" | "">("");
  const [resultMsg, setResultMsg] = useState<string>("");

  // 로딩 후 결재창 보여주기
  const [animate, setAnimate] = useState<boolean>(false);
  useEffect(() => {
    if(!detailDataLoading) {
      setApproval(true);
      setAnimate(true);

      const timer = setTimeout(() => {
        setAnimate(false);
        setTimeout(() => setApproval(false), 300); // 0.3초 후에 완전히 닫힘
      }, 1000); // 1초 후 닫힘
  
      return () => clearTimeout(timer); // 클린업 함수
    }
  }, [detailDataLoading]);

  const toggleApproval = () => {
    if (approval) {
      setAnimate(false); // 먼저 애니메이션을 종료
      setTimeout(() => setApproval(false), 300); // 애니메이션이 끝난 후 제거
    } else {
      setApproval(true);
      setTimeout(() => setAnimate(true), 10); // 애니메이션 활성화
    }
  };

  const [deleted, setDeleted] = useState<specModelType | null>(null);

  useEffect(()=>{
    if(deleted) {
      setResultType("del");
      setResultOpen(true);
    }
  }, [deleted])

  const handleDeleteModel = async () => {
    try {
      if(deleted) {
        const result = await deleteAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: `spec/model/default/cancel`,
          jsx: 'default',
          etc: true,
        },
          deleted?.id ?? "",
        );

        if(result.resultCode === "OK_0000") {
          setDeleted(null);
          showToast("사양 모델 취소 성공", "success");
          if(detailData.specModels?.length && detailData.specModels?.length < 2) {
            router.push("/sayang/sample/regist");
          } else {
            refetch();
          }
        } else {
          const msg = result?.response?.data?.message;
          setResultType("error");
          setResultMsg(msg);
          setResultOpen(true);
        }
      } else  console.log("delete 없음 :: ", deleted);
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  // 모델 영역 접었다 피기
  const [modelTabOpen, setModelTabOpen] = useState<boolean>(true);

  // 신양 내 파일
  const [ fileSubmitFlag, setFileSubmitFlag ] = useState<boolean>(false);
  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);

  useEffect(()=>{
    if(cookie.get('company') === 'sy' && fileIdList.length > 0) {
      setDetailData({
        ...detailData,
        brdArrStorageKey: fileIdList.toString(),
      });
    }
    setFileSubmitFlag(false);
    console.log(fileIdList, fileSubmitFlag);
  }, [fileIdList])

  return (
  <>
    <div className="p-30 flex v-between-h-center">
      <p className="text-20 fw-500 font-semibold">사양 등록</p>
      <p 
        className="w-32 h-32 bg-white rounded-50 border-1 border-line v-h-center text-[#666666] cursor-pointer"
        onClick={()=>{
          if(cookie.get('company') === 'sy' && !fileSubmitFlag) {
            setResultType("fileClose");
            setResultOpen(true);
          } else {
            router.back()
          }
        }}
      >
        <Close />
      </p>
    </div>
    <div className="w-full overflow-auto pl-30 pb-20">
      <div className="w-full pr-30 flex flex-col gap-40">
        { detailDataLoading && <>
          <div className="bg-white rounded-14 p-30 pt-70 flex flex-col overflow-auto gap-20 w-full h-[400px]">
            <Skeleton.Node active className="!w-full !h-full" />
          </div>
          <div className="flex bg-white rounded-14 p-30 gap-40 w-full h-[430px]">
            <div className="min-w-[300px]">
              <Skeleton.Node active className="!w-full !h-full" />
            </div>
            <div className="w-full flex gap-40">
              <div className="min-w-[300px] flex-grow-[44]">
                <Skeleton.Node active className="!w-full !h-full" />
              </div>
              <div className="min-w-[400px] flex-grow-[32]">
                <Skeleton.Node active className="!w-full !h-full" />
              </div>
              <div className="min-w-[300px] flex-grow-[24]">
                <Skeleton.Node active className="!w-full !h-full" />
              </div>
            </div>
          </div>
        </>}
        { !detailDataLoading && !modelTabOpen &&
          <div
            className="w-full h-46 bg-white py-30 px-16 h-center gap-12 rounded-14 cursor-pointer"
            onClick={()=>setModelTabOpen(!modelTabOpen)}
          >
            <p className="w-16 h-16">
              { !modelTabOpen ? <Right /> : <Down />}
            </p>
            모델 목록 보기
          </div>
        }
        { !detailDataLoading && <>
        { modelTabOpen &&
        <Popup
          className="overflow-auto !py-30"
        >
          <div className="v-between-h-center">
            <div className="flex gap-10">
              <Button onClick={()=>setModelTabOpen(!modelTabOpen)}>
                모델 목록 접기
              </Button>
              <Button 
                type="text"
                icon={<DoubleRightOutlined/>}
                className="!bg-[#F5F6FA] !h-32"
                style={{border:'1px solid #D9D9D9'}}
                onClick={toggleApproval}
              >
                  결재
              </Button>
              <div className={`filter-container ${animate ? "open" : "close"}`}>
                {approval && <DefaultFilter filter={filter} setFilter={setFilter} />}
              </div>
            </div>
            <div className="h-center gap-20">
              { !view && cookie.get('company') !== 'sy' &&
              <Button
                className="!text-point1 !border-point1" icon={<Models className="w-16 h-16"/>}
                onClick={()=>{
                  setTemp(false);
                  handleSumbitTemp(true);
                }}
              >모델추가</Button>}
            </div>
          </div>
          <div>
            <AntdTable
              columns={
              cookie.get('company') === 'sy' ?
              sayangSampleWaitAddClmn(
                surfaceSelectList,
                unitSelectList,
                vcutSelectList,
                outSelectList,
                smPrintSelectList,
                smColorSelectList,
                smTypeSelectList,
                mkPrintSelectList,
                mkColorSelectList,
                mkTypeSelectList,
                spPrintSelectList,
                spTypeSelectList,
                ul1SelectList,
                ul2SelectList,
                ozUnitSelectList,
                metarialSelectList,
                handleModelDataChange,
                setDeleted,
                view,
                stampColorSelectList,
              )?.filter(f=>f.key !== 'dongback' && f.key !== 'sm' && f.key !== 'mk' && f.key !== 'arkit'
                && f.key !== 'kit' && f.key !== 'pnl' && f.key !== 'kitpcs' && f.key !== 'im')
              :
              sayangSampleWaitAddClmn(
                surfaceSelectList,
                unitSelectList,
                vcutSelectList,
                outSelectList,
                smPrintSelectList,
                smColorSelectList,
                smTypeSelectList,
                mkPrintSelectList,
                mkColorSelectList,
                mkTypeSelectList,
                spPrintSelectList,
                spTypeSelectList,
                ul1SelectList,
                ul2SelectList,
                ozUnitSelectList,
                metarialSelectList,
                handleModelDataChange,
                setDeleted,
                view,
              )}
              data={detailData.specModels}
              styles={{th_bg:'#F9F9FB',th_ht:'30px',th_fw:'bold',td_ht:'170px',td_pd:'15px 3.8px', th_fs:'12px'}}
              tableProps={{split:'none'}}
              loading={detailDataLoading}
            />
          </div>
        </Popup>}
        { cookie.get('company') === 'sy' &&
        <div className="flex gap-40 flex-row">
          <Popup className="!w-[300px] flex-grow-[20]">
            <TitleIcon
              title="설계도면 첨부"
              icon={<Box />}
            />
            <AntdDragger
              fileIdList={fileIdList}
              fileList={fileList}
              setFileIdList={setFileIdList}
              setFileList={setFileList}
              mult max={5}
            />
          </Popup>

          <Popup className="!w-[300px] flex-grow-[20]">
            <TitleIcon
              title="설계 전달사항"
              icon={<MessageOn />}
            />
            <textarea
              className="w-full min-h-[120px] h-full rounded-14 bg-back border-1 border-line text-12 p-20 flex flex-col gap-10"
              value={camNotice}
              onChange={(e)=>{setCamNotice(e.target.value)}}
              disabled={view?true:false}
            />
          </Popup>

          <Popup className="!w-[300px] flex-grow-[20]">
            <TitleIcon
              title="제조 전달사항"
              icon={<MessageOn />}
            />
            <textarea
              className="w-full min-h-[120px] h-full rounded-14 bg-back border-1 border-line text-12 p-20 flex flex-col gap-10"
              value={prcNotice}
              onChange={(e)=>{setPrcNotice(e.target.value)}}
              disabled={view?true:false}
            />
          </Popup>
        </div>
        }
        { cookie.get('company') !== 'sy' &&
        <div className="flex gap-40 flex-row">
          <Popup className="!w-[300px] flex-grow-[20]">
            {/* 적층 구조 */}
            <LaminationContents
              defaultLayerEm={detailData.specModels?.[0]?.layerEm}
              detailData={detailData}
              setDetailData={setDetailData}
              handleSumbitTemp={()=>{
                handleSumbitTemp();
              }}
              view={view}
            />
          </Popup>
          <Popup className="!w-[400px] flex-grow-[40]">
            {/* 배열 도면 */}
            <ArrayContents
              board={board}
              handleSumbitTemp={handleSumbitTemp}
              detailData={detailData}
              setDetailData={setDetailData}
              view={view}
            />
          </Popup>
          {/* <Popup className="!w-[300px] flex-grow-[20]"> */}
            {/* 재단 사이즈 */}
            {/* <CutSizeContents
              specNo={resultOpen && resultType === "cf" && detailData.specNo ? detailData.specNo : ""}
              detailData={detailData}
            />
          </Popup> */}
          <Popup className="!w-[300px] flex-grow-[20]">
            {/* 전달 사항 */}
            <MessageContents
              prcNotice={prcNotice}
              setPrcNotice={setPrcNotice}
              camNotice={camNotice}
              setCamNotice={setCamNotice}
              view={view}
            />
          </Popup>
        </div>}

        <div className="v-between-h-center px-30">
          {
            (detailData?.specPrdGroupPrcs && detailData?.specPrdGroupPrcs?.length > 0) ? 
            <Button
              className="!border-[#444444] !w-[107px]"
              icon={ <CheckOutlined style={{color:"#4880FF"}}/> }
              onClick={()=>{
                setOpen(true);
              }}
            >공정지정</Button>
            :
            <Tooltip title="공정을 지정하세요">
            <Button
              className="!border-[#444444] !w-[107px]"
              icon={<Prc className="w-16 h-16"/>}
              onClick={()=>{
                setOpen(true);
              }}
              >공정지정</Button>
            </Tooltip>
          }

          { !view &&
          <div className="v-h-center gap-5">
            <Button
              className="h-32 rounded-6" variant="outlined" color="primary"
              onClick={()=>{
                handleSumbitTemp();
              }}
            >임시저장</Button>
            <FullOkButtonSmall label="확정저장" click={()=>{
              if(detailData.specPrdGroupPrcs && detailData.specPrdGroupPrcs?.length < 1) {
                showToast("공정을 선택해주세요.", "error");
                return;
              }

              let flag = false;
              detailData.specModels?.map(f=>{
                if((f.prdCnt ?? 0) < 1) {
                  flag = true;
                  return;
                }
              })
              if(flag && cookie.get('company') === 'sy') {
                showToast("모델 내 수량을 입력해주세요.", "error");
                return;
              }
              if(flag && cookie.get('company') !== 'sy') {
                showToast("모델 내 작업량(PNL)을 입력해주세요.", "error");
                return;
              }
              
              handleSumbitTemp(false, true);
            }}/>
          </div>}
        </div>
        </>}

        <AntdModal
          open={open}
          setOpen={setOpen}
          title={"공정 지정"}
          contents={
          <ProcessSelection
            open={open}
            detailData={detailData}
            setDetailData={setDetailData}
            setUpdatePrc={setUpdatePrc}
            prdGrpQueryData={prdGrpQueryData}
            prdGrpSelectList={prdGrpSelectList}
            selectPrdGrp={selectPrdGrp}
            setSelectPrdGrp={setSelectPrdGrp}
            selectPrc={selectPrc}
            setSelectPrc={setSelectPrc}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            selectedVendors={selectedVendors}
            setSelectedVendors={setSelectedVendors}
            view={view}
          />}
          width={1050}
          onClose={()=>{
            // 저장하지 않은 상태일 경우
            if(!updatePrc) {
              setResultType("processClose");
              setResultOpen(true);
            } else {
              setUpdatePrc(true);
              setOpen(false);
            }
          }}
        />
        
        <AntdAlertModal
          open={resultOpen}
          setOpen={setResultOpen}
          title={
            resultType === "cf"? "사양 확정 완료" :
            resultType === "error"? "요청 실패" :
            resultType === "del"? "해당 모델을 삭제하시겠습니까?" :
            resultType === "processClose"? "공정 지정을 하지 않고 닫으시겠습니까?" :
            resultType === "fileClose"? "변경된 설계도면을 저장하지 않고 닫으시겠습니까?" :
            ""
          }
          contents={
            resultType === "cf" ? <div className="h-40">사양 확정에 성공하였습니다.</div> :
            resultType === "error" ? <div className="h-40">{resultMsg}</div> :
            resultType === "del" ? <div className="h-40">해당 모델의 사양 등록을 취소하시겠습니까?</div> :
            resultType === "processClose" ? <div className="h-40">저장되지 않은 공정이 있습니다.<br/>정말 저장하지 않고 닫으시겠습니까?</div> :
            resultType === "fileClose" ? <div className="h-40">저장되지 않은 설계도면이 있습니다.<br/>정말 저장하지 않고 나가시겠습니까?</div> :
            <div className="h-40"></div>
          }
          type={
            resultType === "cf" ? "success" :
            resultType === "error" ? "error" :
            resultType === "del" ? "warning" :
            (resultType === "processClose" || resultType === "fileClose") ? "warning" :
            "success"
          }
          onOk={()=>{
            setResultOpen(false);
            if(resultType === "cf") {
              router.push('/sayang/sample/regist');
            } else if(resultType === "del") {
              handleDeleteModel();
            } else if(resultType === "processClose") {
              setOpen(false);
              setUpdatePrc(true);
            } else if(resultType === "fileClose") {
              router.back();
            }
          }}
          onCancel={()=>{
            setResultOpen(false);
            setDeleted(null);
          }}
          hideCancel={
            resultType === "del"
            || resultType === "processClose"
            || resultType === "fileClose" ? false : true
          }
          okText={
            resultType === "cf" ? "목록으로 이동" :
            resultType === "error" ? "확인" :
            resultType === "del" ? "네 사양 등록 대기로 변경하겠습니다" :
            resultType === "processClose" ? "네 닫을래요" :
            resultType === "fileClose" ? "네 나갈래요" :
            "목록으로 이동"
          }
          cancelText={
            resultType === "del"
            || resultType === "processClose"
            || resultType === "fileClose" ? "아니요 계속 등록할게요" :
            ""
          }
        />

        <ToastContainer />
      </div>
    </div>
  </>
  )
}

SayangSampleAddPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="사양 등록"
    head={false}
    modal={true}
  >{page}</MainPageLayout>
);

export default SayangSampleAddPage;