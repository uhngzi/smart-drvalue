import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAPI } from "@/api/get";

import useToast from "@/utils/useToast";

import AntdInputRound from "@/components/Input/AntdInputRound";
import AntdSelectRound from "@/components/Select/AntdSelectRound";

import Edit from "@/assets/svg/icons/edit.svg";
import Back from "@/assets/svg/icons/back.svg";

import { generateFloorOptions, LamDtlTypeEm, LayerEm } from "@/data/type/enum";
import { specLaminationType } from "@/data/type/sayang/lamination";
import { laminationRType } from "@/data/type/base/lamination";
import { apiGetResponseType } from "@/data/type/apiResponse";

import SpecSourceRow from "./SpecSourceRow";
import LaminationRow from "./LaminationRow";
import BaseLaminationRow from "./BaseLaminationRow";
import { LabelMedium } from "@/components/Text/Label";

interface Props {
  defaultLayerEm?: LayerEm;
}

const AddLaminationModalContents: React.FC<Props> = ({
  defaultLayerEm,
}) => {
  const { showToast, ToastContainer } = useToast();

  // 라이브러리 ID 선택 값 저장
  const [select, setSelect] = useState<number | string>();

  // 구성 요소에 따른 색상
  const color = ['#CEE4B3','#F1F4F9','#7551E933','#F5D9B1','#F5B1A1'];

  // 라이브러리 필터 값 선택
  const [ selectLamiEm, setSeletLamiEm ] = useState<'cf' | 'pp' | 'ccl'>('cf');
  const [ selectSpecLamiFilter, setSelectSpecLamiFilter ] = useState<{
    layer?: LayerEm,
    oz?: 'cf' | 'pp' | 'ccl',
    thk?: number,
    cf?: number,
  }>({cf:0});

  // 첫 모델의 Layer로 초기값 설정
  useEffect(()=>{
    setSelectSpecLamiFilter({
      ...selectSpecLamiFilter,
      layer:defaultLayerEm
    })
  }, [defaultLayerEm]);

  // ------------ 베이스 데이터 세팅 ----------- 시작
  const [ baseLaminationLoading, setBaseLaminationLoading ] = useState<boolean>(true);
  const [ baseLamination, setBaseLamination ] = useState<Array<laminationRType>>([]);
  const { refetch:baseLaminationRefetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['lamination-source/jsxcrud/many'],
    queryFn: async () => {
      setBaseLaminationLoading(true);
      setBaseLamination([]);

      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'lamination-source/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setBaseLamination(result.data.data ?? []);
      } else {
        console.log('error:', result.response);
      }

      setBaseLaminationLoading(false);
      return result;
    },
  });
  // ------------ 베이스 데이터 세팅 ----------- 끝

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
  const handleSelectSource = (source:specLaminationType) => {
    let arr = [] as laminationRType[];
    source.specDetail?.data?.map((detail) => {
      const item = baseLamination.find((f) => f.id === detail.specLamIdx) as laminationRType;
      if(item)  arr.push(item);
    });
    setLamination(arr);
    setSelect(source.id);
  }

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
        showToast("OZ는 한 번만 추가 가능합니다.", "error");
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

  return (
    <div className="v-h-center gap-20 px-10">
      <div className="min-w-[319px] h-[612px] bg-white rounded-14 border-[1.3px] border-[#B9B9B9] p-30 flex flex-col gap-20">
        <div className="v-between-h-center h-40">
          <LabelMedium label="적층구조 라이브러리" />
          <div className="w-96 h-24 flex v-h-center">
            <div
              onClick={()=>
                setSelectSpecLamiFilter({
                  ...selectSpecLamiFilter,
                  cf: 1,
                })
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
                setSelectSpecLamiFilter({
                  ...selectSpecLamiFilter,
                  cf: 0,
                })
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
            // .filter((source:specLaminationType) => {
            //   if(!selectSpecLamiFilter.oz)  return true;
            //   else                          return source.specDetail?.data?.[0]?.
            // })
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
                    handleSelectSource(selectedSource);
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
              <p className="text-16 font-medium">적층구조 라이브러리 구성/편집</p>
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
          <div className="h-[440px]">
            <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
              {
                Array.isArray(lamination) && lamination.length > 0 &&
                lamination.map((item:laminationRType, index:number) => (
                  <LaminationRow
                    key={item.id+':'+index}
                    item={item}
                    index={index}
                    color={color}
                  />
                ))
              }
            </div>
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
          <div className="h-[480px] overflow-y-auto text-12">
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
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AddLaminationModalContents;