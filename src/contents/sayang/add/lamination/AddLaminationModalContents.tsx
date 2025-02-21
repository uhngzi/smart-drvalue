import { useQuery } from "@tanstack/react-query";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "antd";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { specType } from "@/data/type/sayang/sample";

import useToast from "@/utils/useToast";

import AntdInputRound from "@/components/Input/AntdInputRound";
import AntdSelectRound from "@/components/Select/AntdSelectRound";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { LabelMedium } from "@/components/Text/Label";

import Edit from "@/assets/svg/icons/edit.svg";
import Back from "@/assets/svg/icons/back.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Check from "@/assets/svg/icons/s_check.svg";

import { generateFloorOptions, LamDtlTypeEm, LayerEm } from "@/data/type/enum";
import { specLaminationType } from "@/data/type/sayang/lamination";
import { laminationRType } from "@/data/type/base/lamination";
import { apiGetResponseType } from "@/data/type/apiResponse";

import SpecSourceRow from "./SpecSourceRow";
import LaminationRow from "./LaminationRow";
import BaseLaminationRow from "./BaseLaminationRow";
import { patchAPI } from "@/api/patch";

interface Props {
  defaultLayerEm?: LayerEm;
  detailData: specType;
  setDetailData: React.Dispatch<SetStateAction<specType>>;
  handleSumbitTemp: () => void;
  baseLamination: laminationRType[],
  baseLaminationLoading: boolean;
  color: string[];
  mainLamination: laminationRType[];
  setMainLamination: React.Dispatch<SetStateAction<laminationRType[]>>;
  submitFlag: boolean;
  setSubmitFlag: React.Dispatch<SetStateAction<boolean>>;
  setLamNo: React.Dispatch<SetStateAction<string>>;
}

const AddLaminationModalContents: React.FC<Props> = ({
  defaultLayerEm,
  detailData,
  setDetailData,
  handleSumbitTemp,
  baseLamination,
  baseLaminationLoading,
  color,
  mainLamination,
  setMainLamination,
  submitFlag,
  setSubmitFlag,
  setLamNo,
}) => {
  const { showToast, ToastContainer } = useToast();

  // 알림창을 위한 변수
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<"sel" | "oz" | "">("");
  const [result, setResult] = useState<laminationRType | null>(null);

  // 라이브러리 ID 선택 값 저장
  const [select, setSelect] = useState<string>();
  const [selectSource, setSelectSource] = useState<specLaminationType | null>();

  // 라이브러리 필터 값 선택
  const [ selectLamiEm, setSeletLamiEm ] = useState<'cf' | 'pp' | 'ccl'>('cf');
  const [ selectSpecLamiFilter, setSelectSpecLamiFilter ] = useState<{
    layer?: LayerEm | "",
    oz?: 'cf' | 'pp' | 'ccl',
    thk?: number,
    cf?: number,
  }>({cf:1});

  // 첫 모델의 Layer로 초기값 설정
  useEffect(()=>{
    setSelectSpecLamiFilter({
      ...selectSpecLamiFilter,
      layer:defaultLayerEm
    })
  }, [defaultLayerEm]);

  // ---------- 라이브러리 데이터 세팅 ---------- 시작
  const [ specSourcesLoading, setSpecSourcesLoading ] = useState<boolean>(true);
  const [ specSources, setSpecSources ] = useState<Array<specLaminationType>>([]);
  const { refetch:specSourcesRefetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['spec/lamination-source/jsxcrud/many'],
    queryFn: async () => {
      setSpecSourcesLoading(true);
      setSpecSources([]);

      const result = await getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: 'spec/lamination-source/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setSpecSources(result.data.data ?? []);
      } else {
        console.log('error:', result.response);
      }

      setSpecSourcesLoading(false);
      return result;
    },
  });
  // ---------- 라이브러리 데이터 세팅 ---------- 끝

  // 구성 요소 저장
  const [lamination, setLamination] = useState<laminationRType[]>([]);

  // 라이브러리 선택 시 구성 요소 보여주는 함수
  const handleSelectSource = () => {
    let arr = [] as laminationRType[];
    if(selectSource && typeof selectSource.specDetail !== "string") {
      selectSource.specDetail?.data?.map((detail) => {
        const item = baseLamination.find((f) => f.id === detail.specLamIdx) as laminationRType;
        if(item)  arr.push(item);
      });
      setLamination(arr);
      setSelect(selectSource.id);
    }
  }

  useEffect(()=>{
    // 확정된 라이브러리를 선택한 상태에서 값을 변경하면 새로 라이브러리를 추가해줘야 하므로 기존 선택된 라이브러리는 취소됨
    if(selectSpecLamiFilter.cf === 1 && select && selectSource && typeof selectSource.specDetail !== "string") {
      // 기존 라이브러리가 있는데 편집을 할 경우 select가 취소되어야 함
      // 1. 구성요소 추가로 인한 길이의 값이 달라짐
      // 2. CF의 값이 달라짐
      // 3. 구성요소의 위치를 변경함 :: 드래그 시 함수 내부에서 자동 취소됨
      if(selectSource.specDetail?.data?.length !== lamination.length) {
        setSelect(undefined);
        setSelectSource(null);
      } else {
        const item = baseLamination.find((f) => 
            typeof selectSource.specDetail !== "string" &&
            f.id === selectSource.specDetail?.data?.[0]?.specLamIdx
          ) as laminationRType;
        if(item.id !== lamination[0].id) {
          setSelect(undefined);
          setSelectSource(null);
        }
      }
    }
  }, [lamination]);

  // 베이스 적층 요소 클릭 시 메뉴 값에 따라 추가해주는 함수
  const handleMenuClick = (e:any, item:laminationRType) => {
    let index = 0;

    // 맨 위에 추가 (CF가 첫번째이므로 1을 넣어줌)
    if(e.key === '1')       index = 1;
    // 중간에 추가
    else if(e.key === '2')  index = Math.trunc(lamination.length / 2);
    // 맨 아래에 추가 (CF가 마지막이므로 -1 해줌)
    else if(e.key === '3')  index = lamination.length - 1;

    // 맨 처음에 CF가 아닌 CCL, PP를 추가했을 경우 추가 안됨
    if(item.lamDtlTypeEm !== 'cf' && lamination.length < 1) {
      showToast("OZ를 먼저 선택해주세요.", "error");
      return;
    } else if(item.lamDtlTypeEm === 'cf') {
      // CF를 선택했으나 이미 값이 있는 경우
      if(lamination.length > 1) {
        // showToast("OZ는 한 번만 추가 가능합니다.", "error");
        setResultOpen(true);
        setResultType("oz");
        setResult(item);
        return;
      } else {
        // 위 아래로 2개 추가 됨
        setLamination((prevItems) => [
          item,
          ...prevItems,
          item,
        ]);
        return;
      }
    }

    // 이 외에는 index 값에 맞게 자동 추가
    setLamination((prevItems) => [
      ...prevItems.slice(0, index), // 기존 배열의 앞 부분
      item, // 추가할 아이템
      ...prevItems.slice(index), // 기존 배열의 뒷 부분
    ]);
  };

  // ---------- 적층 구조 드래그 함수 ---------- 시작
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 기본 동작인 drop 방지
  };

  const handleDrop = (index: number, item:laminationRType) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    // 맨 위 아래는 CF로 고정 되어있으므로 위치 변경 불가
    if(index === 0 || index === lamination.length - 1 ||
      draggedItemIndex === 0 || draggedItemIndex === lamination.length - 1)  return;

    // 확정된 라이브러리의 값을 변경할 경우 새 라이브러리로 생성되기 위해 선택 취소
    if(selectSpecLamiFilter.cf === 1) {
      setSelect(undefined);
      setSelectSource(null);
    }

    const updatedLamination = [...lamination];
    const [movedItem] = updatedLamination.splice(draggedItemIndex, 1); // 드래그한 항목 삭제
    updatedLamination.splice(index, 0, movedItem); // 새로운 위치에 삽입

    setLamination(updatedLamination);
    setDraggedItemIndex(null); // 드래그 상태 초기화
  };
  // ----------- 적층 구조 드래그 함수 ---------- 끝

  // ----------- 라이브러리 수정 함수 ----------- 시작
    // 기존에 매칭된 상태인데 라이브러리를 수정할 수 있나?... 일단 보류
  const handleSubmitTemp = async () => {
    try {
      if(selectSource?.id){
        const jsonData = {
          specDetail: {
            data: lamination.map((d:laminationRType ,idx:number)=> ({
              index: idx,
              specLamIdx: d.id,
            }))
          }
        }
        console.log(JSON.stringify(jsonData), selectSource.id);

        const result = await patchAPI({
          type: 'core-d1', 
          utype: 'tenant/',
          url: 'spec/lamination-source',
          jsx: 'jsxcrud'
        }, selectSource?.id, jsonData);

        if(result.resultCode === 'OK_0000') {
          showToast("라이브러리 수정 완료", "success");
        } else {
          const msg = result?.response?.data?.message;
          showToast(msg, "error");
        }
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ----------- 라이브러리 수정 함수 ----------- 끝

  // ------------ 임시 저장 시 함수 ----------- 시작
  const handleSubmitSaveSource = async (cf:boolean) => {
    try {
      const jsonData = {
        specDetail: {
          data: lamination.map((d:laminationRType ,idx:number)=> ({
            index: idx,
            specLamIdx: d.id,
          }))
        }
      }
      console.log(JSON.stringify(jsonData));

      const result = await postAPI({
        type: 'core-d1', 
        utype: 'tenant/',
        url: 'spec/lamination-source',
        jsx: 'jsxcrud'
      }, jsonData);

      if(result.resultCode === 'OK_0000') {
        const entity = result.data.entity as specLaminationType;
        setSpecSources([...specSources, { ...entity, confirmYn: cf ? 1 : 0 }]);
        // 생성 후 라이브러리 자동 선택
        setSelect(entity?.id);
        setSelectSource(entity);
        if(!cf) {
          showToast("라이브러리 추가 완료", "success");
          setSelectSpecLamiFilter({ ...selectSpecLamiFilter, cf:0, layer:"" });
        } else      handleSubmitSaveSourceCf(true, entity);
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ------------ 임시 저장 시 함수 ----------- 끝

  // ------------ 확정 저장 시 함수 ----------- 시작
  const handleSubmitSaveSourceCf = async (cf:boolean, entity?:any) => {
    try {
      if(selectSource?.id || entity?.id) {
        const result = await patchAPI({
          type: 'core-d1', 
          utype: 'tenant/',
          url: `spec/lamination-source/default/confirm/${selectSource?.id ?? entity?.id}`,
          jsx: 'default',
          etc: true,
        }, selectSource?.id ?? entity?.id);
  
        if(result.resultCode === 'OK_0000') {
          if(!cf) {
            showToast("확정 저장", "success");
            specSourcesRefetch();
          } else {
            setDetailData({
              ...detailData,
              specLamination: { id: select },
            });
            setLamNo(entity?.lamNo);
            setSubmitFlag(true);
          }
        } else {
          const msg = result?.response?.data?.message;
          showToast(msg, "error");
        }
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ------------ 확정 저장 시 함수 ----------- 끝

  // -------------- 선택 시 함수 ------------- 시작
  const handleSubmitSelectSource = async () => {
    // 메인에 해당 라이브러리 보여주기
    setMainLamination(lamination);
    
    // 선택된 라이브러리가 있을 경우
    if(select && selectSource) {
      setDetailData({
        ...detailData,
        specLamination: { id: select },
      });
      setLamNo(selectSource?.lamNo ?? "");
      setSubmitFlag(true);
    } else {
      // 선택된 라이브러리가 없을 경우
      // 새 라이브러리 생성 후 해당 라이브러리 바로 확정한 뒤 메인 라이브러리의 값 임시 저장
      handleSubmitSaveSource(true);
    }
    console.log(selectSource);
  }
  // -------------- 선택 시 함수 ------------- 끝

  return (
    <div className="v-h-center gap-20 px-10">
      <div className="min-w-[319px] h-[612px] bg-white rounded-14 border-[1.3px] border-[#B9B9B9] p-30 flex flex-col gap-20">
        <div className="v-between-h-center h-40">
          <LabelMedium label="적층구조 라이브러리" />
          <div className="w-96 h-24 flex v-h-center">
            <div
              onClick={()=>
                setSelectSpecLamiFilter({...selectSpecLamiFilter, cf: 1})
              }
              className="w-42 v-h-center cursor-pointer"
              style={selectSpecLamiFilter.cf ? 
                {border:"1.6px solid #4880FF", color:"#4880FF"} :
                {border:"1px solid #D5D5D5"}
              }
            >
              확정
            </div>
            <div 
              onClick={()=>
                setSelectSpecLamiFilter({...selectSpecLamiFilter, cf: 0})
              }
              className="w-55 v-h-center cursor-pointer"
              style={!selectSpecLamiFilter.cf ? 
                {border:"1.6px solid #4880FF", color:"#4880FF"} :
                {border:"1px solid #D5D5D5"}
              }
            >
              미확정
            </div>
          </div>
        </div>
        <div className="h-32 v-between-h-center">
          <AntdSelectRound
            options={[
              { value:'', label:'전체' },
              ...generateFloorOptions()
            ]}
            placeholder={"층선택"}
            value={selectSpecLamiFilter.layer}
            onChange={(e)=>{
              setSelectSpecLamiFilter({
                ...selectSpecLamiFilter,
                layer:e+'' as LayerEm
              })
            }}
            className="w-82"
          />
          <AntdSelectRound
            options={baseLamination.filter(f=>f.lamDtlTypeEm === 'cf').map(f=>({
              value: f.id,
              label: '('+f.matCd+')'+f.lamDtlThk+'T',
            })) ?? []}
            value={selectSpecLamiFilter.oz}
            onChange={(e)=>
              setSelectSpecLamiFilter({
                ...selectSpecLamiFilter,
                oz: e+'' as LamDtlTypeEm
              })
            }
            placeholder={"OZ선택"}
            className="w-88"
          />
          <AntdInputRound
            value={selectSpecLamiFilter.thk}
            onChange={(e)=>
              setSelectSpecLamiFilter({
                ...selectSpecLamiFilter,
                thk: Number(e.target.value)
              })
            }
            placeholder={"두께"}
            className="w-69"
            type="number"
          />
        </div>
        <div className="h-[440px] overflow-y-auto">
          {
            !specSourcesLoading && specSources
            .filter((source:specLaminationType) => {
              if(!selectSpecLamiFilter.layer) return true;
              else                            return source.layerEm === selectSpecLamiFilter.layer;
            })
            .filter((source:specLaminationType) => {
              if(!selectSpecLamiFilter.thk) return true;
              else                          return source.lamThk === selectSpecLamiFilter.thk
            })
            .filter((source:specLaminationType) => 
              source.confirmYn === selectSpecLamiFilter.cf
            )
            .map((source:specLaminationType, index:number) => (
              <SpecSourceRow
                key={source.id}
                source={source}
                index={index}
                isSelected={select === source.id}
                onSelect={(selectedSource) => {
                  if (select === selectedSource.id) {
                    setSelect(undefined);
                    setLamination([]);
                  } else {
                    setSelectSource(selectedSource);
                    if(lamination.length > 0) {
                      setResultOpen(true);
                      setResultType("sel");
                    } else {
                      handleSelectSource()
                    }
                  }
                }}
              />
            ))
          }
        </div>
      </div>
      <div className="min-w-[665px] h-[612px] v-h-center gap-5">
        <div className="min-w-[298px] h-full bg-white rounded-14 border-[1.3px] border-[#B9B9B9] p-30">
          <div className="v-between-h-center h-40 w-full mb-20">
            <LabelMedium label="적층구조 라이브러리 구성/편집"/>
            <div
              className="w-24 h-24 flex v-h-center border-1 border-line rounded-4 cursor-pointer"
              onClick={()=>{
                setSelect(undefined);
                setLamination([]);
              }}
            >
              <p className="w-16 h-16 text-[#FE5C73]"><Back /></p>
            </div>
          </div>
          <div className="h-[440px] overflow-y-auto">
            <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
              {
                Array.isArray(lamination) && lamination.length > 0 &&
                lamination.map((item:laminationRType, index:number) => (
                  <div
                    key={item.id+":"+index}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => {
                      handleDrop(index, item);
                    }}
                    style={{cursor:item.lamDtlTypeEm !== 'cf' ? "grab" : "no-drop"}}
                    draggable
                  >
                    <LaminationRow
                      key={item.id+':'+index}
                      item={item}
                      index={index}
                      color={color}
                      lamination={lamination}
                      setLamination={setLamination}
                    />
                  </div>
                ))
              }
            </div>
          </div>
          <div className="w-full v-h-center gap-10">
            {
              selectSpecLamiFilter.cf === 1 ?
              <Button
                className="h-32 rounded-6"
                onClick={()=>{
                  handleSubmitSelectSource();
                }}
              >
                <p className="w-16 h-16 text-[#222222]"><Check /></p> 선택
              </Button>
              : <>
              <Button
                className="h-32 rounded-6"
                onClick={()=>{
                  handleSubmitSaveSource(false);
                }}
              >
                임시 저장
              </Button>
              <Button
                className="h-32 rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                onClick={()=>{
                  if(selectSource?.id) {
                    handleSubmitSaveSourceCf(false);
                  } else {
                    showToast("확정할 라이브러리를 선택해주세요.", "error");
                  }
                }}
              >
                <Arrow /> 확정 저장
              </Button>
              </>
            }
          </div>
        </div>
        <div className="w-24 h-center flex-col gap-5">
          <div 
            className="w-24 h-24 rounded-4 v-h-center cursor-pointer bg-point3 text-white"
            onClick={()=>{}}
          >
            {'<'}
          </div>
          <div 
            className="w-24 h-24 rounded-4 v-h-center cursor-pointer border-1 border-line bg-white"
            onClick={()=>{}}
          >
            {'>'}
          </div>
        </div>
        <div className="min-w-[333px] h-full bg-white rounded-14 border-[1.3px] border-[#B9B9B9] p-30">
          <div className="v-between-h-center h-40 w-full mb-20">
            <p className="text-16 font-medium">적층구조 구성요소</p>
            <div className="w-[128px] h-24 flex v-h-center">
              <div
                className="w-43 v-h-center cursor-pointer"
                onClick={()=>{setSeletLamiEm('cf')}}
                style={selectLamiEm==='cf'?
                  {border:'1.6px solid #4880FF',color:'#4880FF'}
                  :
                  {border:'1px solid #D5D5D5',color:'#22222285'}
                }
              >
                C/F
              </div>
              <div 
                className="w-42 v-h-center cursor-pointer"
                onClick={()=>{setSeletLamiEm('pp')}}
                style={selectLamiEm==='pp'?
                  {border:'1.6px solid #4880FF',color:'#4880FF'}
                  :
                  {border:'1px solid #D5D5D5',color:'#22222285'}
                }
              >
                P/P
              </div>
              <div
                className="w-45 v-h-center cursor-pointer"
                onClick={()=>{setSeletLamiEm('ccl')}}
                style={selectLamiEm==='ccl'?
                  {border:'1.6px solid #4880FF',color:'#4880FF'}
                  :
                  {border:'1px solid #D5D5D5',color:'#22222285'}
                }
              >
                CCL
              </div>
            </div>
          </div>
          <div className="h-[440px] overflow-y-auto text-12">
            <div className="h-40 bg-back v-between-h-center">
              <p className="w-70 v-h-center">재질</p>
              <p className="w-56 v-h-center">동박</p>
              <p className="w-56 v-h-center">두께</p>
              <p className="w-56 v-h-center">실두께</p>
              <div className="w-34 v-h-center"><p className="w-16 h-16"><Edit/></p></div>
            </div>
            {
              !baseLaminationLoading && baseLamination
                .filter((f:laminationRType) => f.lamDtlTypeEm === selectLamiEm)
                .map((item:laminationRType, index:number) => 
              (
                <BaseLaminationRow
                  key={item.id+':'+index}
                  item={item}
                  onMenuClick={handleMenuClick}
                  index={index}
                />
              ))
            }
          </div>
          {/* <div className="w-full v-h-center gap-10">
            <Button
              className="h-32 rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
              onClick={()=>{
                handleSubmitSaveSource();
              }}
            >
              구성 요소 추가
            </Button>
          </div> */}
        </div>
      </div>
      
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "sel" ? "편집중인 라이브러리가 존재합니다." :"OZ는 하나만 추가할 수 있습니다."}
        contents={resultType === "sel" ? <div>해당 적층구조 라이브러리의 구성으로 변경하시겠습니까?</div> : <div>선택하신 OZ로 변경하시겠습니까?</div>}
        type="warning"
        onOk={()=>{
          if(resultType === "sel") {
            handleSelectSource();
          } else {
            if(result) {
              const newLami = lamination.slice(1, -1);
              setLamination([
                result,
                ...newLami,
                result,
              ]);
            }
          }
          setResultOpen(false);
        }}
        onCancle={()=>{
          setResultOpen(false);
        }}
        okText="변경 할래요"
        cancelText="변경 안할래요"
      />

      <ToastContainer />
    </div>
  )
}

export default AddLaminationModalContents;