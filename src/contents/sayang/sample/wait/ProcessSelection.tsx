import AntdSelect from "@/components/Select/AntdSelect";
import TitleModalSub from "@/components/Text/TitleModalSub";

type Process = {
  id: number;
  name: string;
  details: string;
  selected: boolean;
};

const ProcessSelection: React.FC = () => {

  return (
    <div className="w-full h-full h-center gap-10">
      <div className="w-1/3 h-full bg-white rounded-14 p-30 flex flex-col gap-20 border-[0.3px] border-line">
        <TitleModalSub title="선택 제품군의 공정 지정" />
        <div className="w-full flex flex-col gap-10">
          <div className="w-full h-32 h-center gap-10">
            <p className="flex-none">제품군선택</p>
            <div className="flex-1">
              <AntdSelect
                options={[]}
              />
            </div>
          </div>
          <div className="w-full">
            ...리스트
          </div>
        </div>
      </div>
      <div className="w-2/3 h-full bg-white rounded-14 p-30 gap-20 border-[0.3px] border-line">
      </div>
    </div>
  );
};

export default ProcessSelection;
