import Highlight from '@assets/svg/icon/highlight.svg';
import Hint from '@assets/svg/icon/hint_16.svg';

interface Props {
  title1: string;
  title2: string;
  description1?: string;
  description2?: string;
  isRequired1?: boolean;
  isRequired2?: boolean;
  children1: React.ReactNode;
  children2: React.ReactNode;
  errorMessage1?: string;
  errorMessage2?: string;
  isError1?: boolean;
  isError2?: boolean;
  titleClassName?: string;
  t1ClassName?: string;
  t2ClassName?: string;
  childClassName?: string;
  c1ClassName?: string;
  c2ClassName?: string;
  height?: string;
}

const DescriptionItems2: React.FC<Props> = ({
  title1,
  title2,
  description1,
  description2,
  isRequired1 = false,
  isRequired2 = false,
  children1,
  children2,
  errorMessage1,
  errorMessage2,
  isError1,
  isError2,
  titleClassName,
  t1ClassName,
  t2ClassName,
  childClassName,
  c1ClassName,
  c2ClassName,
  height = 50,
}) => {
  return (
    <div className="flex">
      <div className={"flex w-[150px] flex-col justify-center bg-back py-15 pl-20 text-14 "+(titleClassName ?? "")+" "+(t1ClassName ?? "")}>
        <div className={`flex h-${height} items-center gap-8 text-[#222222]`}>
          <p>{title1}</p>
        </div>
        {description1 && <p className="text-[#666666]">{description1}</p>}
      </div>

      <div className={"w-[calc(50%-150px)] items-center self-center py-15 pl-32 pr-20 "+(childClassName ?? "")+" "+(c1ClassName ?? "")}>
        {children1}
      </div>

      <div className={"flex w-[150px] flex-col justify-center bg-back py-15 pl-20 text-14 "+(titleClassName ?? "")+" "+(t2ClassName ?? "")}>
        <div className={`flex h-${height} items-center gap-8 text-[#222222]`}>
          <p>{title2}</p>
        </div>
        {description2 && <p className="text-[#666666]">{description2}</p>}
      </div>

      <div className={"w-[calc(50%-150px)] items-center self-center py-15 pl-32 pr-20 "+(childClassName ?? "")+" "+(c2ClassName ?? "")}>
        {children2}
      </div>
    </div>
  );
};

export default DescriptionItems2;
