import { SetStateAction, useEffect, useState } from "react";
import { Button, Empty } from "antd";

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
}

const LaminationContents: React.FC<Props> = ({
  defaultLayerEm,
  detailData,
  setDetailData,
  handleSumbitTemp,
}) => {
  // 모달 창 띄우기
  const [open, setOpen] = useState<boolean>(false);

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

  const [lamination, setLamination] = useState<laminationRType[]>([]);
  const [submitFlag, setSubmitFlag] = useState<boolean>(false);
  const [lamNo, setLamNo] = useState<string>("");

  useEffect(()=>{
    if(submitFlag)  return;

    setLamination([]);
    if(detailData.specLamination && typeof detailData.specLamination?.specDetail === "string"  && !baseLaminationLoading){
      const detail = JSON.parse(detailData.specLamination?.specDetail?.toString() ?? "");
      let arr = [] as laminationRType[];
      (detail.data ?? []).map((d:{index:number, specLamIdx:string}) => {
        const item = baseLamination.find((f) => f.id === d.specLamIdx) as laminationRType;
        if(item)  arr.push(item);
      });
      setLamination(arr);
    }
  }, [detailData.specLamination, baseLaminationLoading]);

  useEffect(()=>{
    if(submitFlag) {
      handleSumbitTemp();
      setSubmitFlag(false);
    }
  }, [submitFlag])

  // 구성 요소에 따른 색상
  const color = ['#CEE4B3','#F1F4F9','#7551E933','#F5D9B1','#F5B1A1'];

  return (
    <div className="flex flex-col gap-20">
      <div className="v-between-h-center">
        <TitleIcon title="적층구조" icon={<MessageOn />}/>
      </div>
      <div className="w-full flex v-between-h-center h-24 text-14">
        <span>코드 : {detailData.specLamination?.lamNo ?? lamNo}</span>
        <Button size="small" onClick={()=>setOpen(true)}><span className="w-16 h-16"><Memo/></span>선택</Button>
      </div>

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
        {
          (!Array.isArray(lamination) || lamination?.length < 1) &&
          <Empty />
        }
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