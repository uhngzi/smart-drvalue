import Cut from "@/assets/svg/icons/cut.svg";
import TitleIcon from "@/components/Text/TitleIcon";

interface Props {

}

const CutSizeContents: React.FC<Props> = ({

}) => {
  return (
    <div className="w-full flex flex-col gap-20">
      <TitleIcon 
        title="재단 사이즈"
        icon={<Cut />}
      />
      
      <div className="w-full h-[140px] border-1 border-line bg-back rounded-14">
        <p className="text-16 font-medium h-40 v-h-center">8등분/J</p>
        <div className="h-100 flex flex-col text-12 font-medium gap-5 h-center">
          <p className="h-center h-20 w-[160px]">간격(XY) : 2 | 3</p>
          <p className="h-center h-20 w-[160px]">규격 : 489 X 280.36</p>
          <p className="h-center h-20 w-[160px]">W/S : 520 X 310</p>
          <p className="h-center h-20 w-[160px]">Trimmimg size : 516 X 306</p>
        </div>
      </div>

      <div className="w-full h-[165px] flex flex-col gap-10">
        <div className="w-full h-32 v-h-center text-white bg-point1 rounded-6 cursor-pointer">
          사양 편집/확정
        </div>
        <div className="w-full h-32 v-h-center text-white bg-point1 rounded-6 cursor-pointer">
          LOT 생성
        </div>
        <div className="w-full h-32 v-h-center text-white bg-point1 rounded-6 cursor-pointer">
          승인원 작성
        </div>
        <div className="w-full h-40 v-h-center rounded-6 border-2 border-point1 font-semibold cursor-pointer text-18 font-bold">
          S24-L2601
        </div>
      </div>
    </div>
  )
};

export default CutSizeContents;