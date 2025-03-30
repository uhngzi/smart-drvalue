import { SetStateAction, useEffect, useState } from "react";
import { Button, Empty, Spin } from "antd";

import Memo from '@/assets/svg/icons/memo.svg';
import MessageOn from "@/assets/svg/icons/message_on.svg";

import { LayerEm } from "@/data/type/enum";
import { specType } from "@/data/type/sayang/sample";

import AntdModal from "@/components/Modal/AntdModal";
import TitleIcon from "@/components/Text/TitleIcon";

import AddLaminationModalContents from "./lamination/AddLaminationModalContents";
import { specLaminationType } from "@/data/type/sayang/lamination";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { laminationRType } from "@/data/type/base/lamination";
import { getAPI } from "@/api/get";
import LaminationRow from "./lamination/LaminationRow";

interface Props {
  defaultLayerEm?: LayerEm;
  detailData: specType;
  setDetailData: React.Dispatch<SetStateAction<specType>>;
  handleSumbitTemp: () => void;
  view: string | string[] | undefined;
}

const LaminationContents: React.FC<Props> = ({
  defaultLayerEm,
  detailData,
  setDetailData,
  handleSumbitTemp,
  view,
}) => {
  // 모달 창 띄우기
  const [open, setOpen] = useState<boolean>(false);

  const [lamination, setLamination] = useState<laminationRType[]>([]);
  const [submitFlag, setSubmitFlag] = useState<boolean>(false);
  const [lamNo, setLamNo] = useState<string>("");

  // ------------ 적층구조 구성요소 세팅 ----------- 시작
  const [ baseLamination, setBaseLamination ] = useState<Array<laminationRType>>([]);
  const { data:baseLaminationData, isLoading:baseLaminationLoading, refetch:baseLaminationRefetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['lamination-source/jsxcrud/many'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'lamination-source/jsxcrud/many'
      });

      return result;
    },
  });
  useEffect(()=>{
    if(!baseLaminationLoading && baseLaminationData?.resultCode === 'OK_0000') {
      setBaseLamination(baseLaminationData?.data?.data ?? []);
    }
  }, [baseLaminationData])
  // ------------ 적층구조 구성요소 세팅 ----------- 끝

  // ----------- 사양 적층구조 기본값 세팅 ---------- 시작
  const { data:baseLaminationSourceData } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['spec/lamination-source/jsxcrud/one'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d1',
        utype: 'tenant/',
        url: `spec/lamination-source/jsxcrud/one/${detailData.specLamination?.id}`
      });

      if(result.resultCode === "OK_0000") {
        const specLamination = result.data?.data?.specDetail?.data as {index:number, data:any, mappingResult: laminationRType}[];
        let arr:laminationRType[] = [];
        if(specLamination && specLamination.length > 0) {
          specLamination.sort((a, b) => a.index - b.index).map((item) => {
            arr.push(item.mappingResult);
          })
        }
        setLamination(arr);
      }

      return result;
    },
    enabled: !!detailData.specLamination?.id && !submitFlag,
  });
  // ----------- 사양 적층구조 기본값 세팅 ---------- 끝

  useEffect(()=>{
    if(submitFlag) {
      handleSumbitTemp();
      setSubmitFlag(false);
    }
  }, [submitFlag])

  // 구성 요소에 따른 색상
  const color = ['#CEE4B3','#F1F4F9','#7551E933','#F5D9B1','#F5B1A1'];

  return (
    <div className="flex flex-col h-full gap-20">
      <div className="v-between-h-center">
        <TitleIcon title="적층구조" icon={<MessageOn />}/>
        { !view &&
        <Button
          className="h-32 rounded-6"
          onClick={() => {
            setOpen(true);
          }}
        >
          <p className="w-16 h-16">
            <Memo/>
          </p>
          선택
        </Button>
        }
      </div>
      { (detailData.specLamNo ?? detailData.specLamination?.lamNo ?? lamNo) &&
      <div className="w-full flex v-between-h-center h-24 text-14">
        <span>코드 : {detailData.specLamNo ?? detailData.specLamination?.lamNo ?? lamNo}</span>
      </div>}

      <div className="flex-1 text-12 text-[#292828] flex flex-col gap-3">
        { Array.isArray(lamination) && lamination.length > 0 &&
          lamination.map((item:laminationRType, index:number) => (
            <LaminationRow
              key={item.id+':'+index}
              item={item}
              index={index}
              color={color}
            />
          ))
        }
        { (!Array.isArray(lamination) || lamination?.length < 1) &&
          <div className="w-full h-full v-h-center"><Empty /></div>}
      </div>


      <AntdModal
        open={open}
        setOpen={setOpen}
        title={"적층구조 라이브러리 선택 및 편집 구성"}
        contents={
        <AddLaminationModalContents
          defaultLayerEm={defaultLayerEm}
          detailData={detailData}
          setDetailData={setDetailData}
          handleSumbitTemp={handleSumbitTemp}
          baseLamination={baseLamination}
          baseLaminationLoading={baseLaminationLoading}
          baseLaminationRefetch={baseLaminationRefetch}
          color={color}
          mainLamination={lamination}
          setMainLamination={setLamination}
          submitFlag={submitFlag}
          setSubmitFlag={setSubmitFlag}
          setLamNo={setLamNo}
        />}
        width={1044}
      />
    </div>
  )
}

export default LaminationContents;