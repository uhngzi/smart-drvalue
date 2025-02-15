import { useState } from "react";
import { Button } from "antd";

import Memo from '@/assets/svg/icons/memo.svg';
import MessageOn from "@/assets/svg/icons/message_on.svg";

import { LayerEm } from "@/data/type/enum";

import AntdModal from "@/components/Modal/AntdModal";
import TitleIcon from "@/components/Text/TitleIcon";

import AddLaminationModalContents from "./lamination/AddLaminationModalContents";

interface Props {
  defaultLayerEm?: LayerEm;
}

const LaminationContents: React.FC<Props> = ({
  defaultLayerEm,
}) => {
  // 모달 창 띄우기
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-20">
      <div className="v-between-h-center">
        <TitleIcon title="적층구조" icon={<MessageOn />}/>
      </div>
      <div className="w-full flex v-between-h-center h-24 text-14">
        <span>코드 : 040000A</span>
        <Button size="small" onClick={()=>setOpen(true)}><span className="w-16 h-16"><Memo/></span>선택</Button>
      </div>

      <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
        <div className="bg-[#CEE4B3] h-26 v-h-center border-1 border-line">Hoz</div>
        <div className="bg-back h-26 v-h-center border-1 border-line">(BS) 7628HRC x 1</div>
        <div className="bg-[#7551E920] h-26 v-h-center border-1 border-line">(T/C) 1.00T 1/1oz</div>
        <div className="bg-back h-26 v-h-center border-1 border-line">(BS) 7628HRC x 1</div>
        <div className="bg-[#CEE4B3] h-26 v-h-center border-1 border-line">Hoz</div>
      </div>

      <AntdModal
        open={open}
        setOpen={setOpen}
        title={"적층구조 라이브러리 선택 및 편집 구성"}
        contents={<AddLaminationModalContents defaultLayerEm={defaultLayerEm} />}
        width={1044}
      />
    </div>
  )
}

export default LaminationContents;