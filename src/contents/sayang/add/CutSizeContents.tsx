import Cut from "@/assets/svg/icons/cut.svg";
import TitleIcon from "@/components/Text/TitleIcon";
import { specType } from "@/data/type/sayang/sample";
import { Empty } from "antd";

interface Props {
  specNo: string;
  detailData: specType;
}

const CutSizeContents: React.FC<Props> = ({
  specNo,
  detailData,
}) => {
  return (
    <div className="w-full flex flex-col gap-20">
      <TitleIcon 
        title="재단 사이즈"
        icon={<Cut />}
      />
      
      <div className="w-full h-[140px] border-1 border-line bg-back rounded-14">
        {!detailData.cutCnt && <Empty className="pt-5" />}
        {detailData.cutCnt && <>
          <p className="text-16 font-medium h-40 v-h-center">{detailData.cutCnt && detailData.cutCnt+"등분"}{detailData.jYn && "/J"}</p>
          <div className="h-100 flex flex-col text-12 font-medium gap-5 h-center">
            <p className="h-center h-20 w-[160px]">{detailData.stdW && detailData.stdH && "간격(XY) : "+detailData.stdW+" | "+detailData.stdH}</p>
            <p className="h-center h-20 w-[160px]">{detailData.stdW && detailData.stdH && "규격 : "+detailData.stdW+" X "+detailData.stdH}</p>
            <p className="h-center h-20 w-[160px]">{detailData.wksizeW && detailData.wksizeH && "W/S : "+detailData.wksizeW+" X "+detailData.wksizeH}</p>
            <p className="h-center h-20 w-[160px]">{detailData.wksizeW && detailData.wksizeH && "Trimmimg size : 516 X 306"}</p>
          </div>
        </>}
      </div>

      <div className="w-full h-[165px] flex flex-col gap-10">
        {/* <div className="w-full h-32 v-h-center text-white bg-point1 rounded-6 cursor-pointer">
          사양 편집/확정
        </div> */}
        <div className="w-full h-32 v-h-center text-white bg-point1 rounded-6 cursor-pointer">
          LOT 생성
        </div>
        <div className="w-full h-32 v-h-center text-white bg-point1 rounded-6 cursor-pointer">
          승인원 작성
        </div>
        { specNo &&
          <div className="w-full h-40 v-h-center rounded-6 border-2 border-point1 font-semibold cursor-pointer text-18 font-bold">
            {specNo}
          </div>
        }
      </div>
    </div>
  )
};

export default CutSizeContents;