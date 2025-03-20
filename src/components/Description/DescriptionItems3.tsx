import Highlight from '@assets/svg/icon/highlight.svg';
import Hint from '@assets/svg/icon/hint_16.svg';

interface Props {
  title1: string;
  title2: string;
  title3: string;
  description1?: string;
  description2?: string;
  description3?: string;
  isRequired1?: boolean;
  isRequired2?: boolean;
  isRequired3?: boolean;
  children1: React.ReactNode;
  children2: React.ReactNode;
  children3: React.ReactNode;
  errorMessage1?: string;
  errorMessage2?: string;
  errorMessage3?: string;
  titleClassName?: string;
  t1ClassName?: string;
  t2ClassName?: string;
  t3ClassName?: string;
  childClassName?: string;
  c1ClassName?: string;
  c2ClassName?: string;
  c3ClassName?: string;
  height?: string;
}

const DescriptionItems3: React.FC<Props> = ({
  title1,
  title2,
  title3,
  description1,
  description2,
  description3,
  isRequired1 = false,
  isRequired2 = false,
  isRequired3 = false,
  children1,
  children2,
  children3,
  errorMessage1,
  errorMessage2,
  errorMessage3,
  titleClassName,
  t1ClassName,
  t2ClassName,
  t3ClassName,
  childClassName,
  c1ClassName,
  c2ClassName,
  c3ClassName,
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

      <div className={"w-[calc(33%-150px)] items-center self-center py-15 pl-32 pr-20 "+(childClassName ?? "")+" "+(c1ClassName ?? "")}>
        {children1}
      </div>

      <div className={"flex w-[150px] flex-col justify-center bg-back py-15 pl-20 text-14 "+(titleClassName ?? "")+" "+(t2ClassName ?? "")}>
        <div className={`flex h-${height} items-center gap-8 text-[#222222]`}>
          <p>{title2}</p>
        </div>
        {description2 && <p className="text-[#666666]">{description2}</p>}
      </div>

      <div className={"w-[calc(33%-150px)] items-center self-center py-15 pl-32 pr-20 "+(childClassName ?? "")+" "+(c2ClassName ?? "")}>
        {children2}
      </div>

      <div className={"flex w-[150px] flex-col justify-center bg-back py-15 pl-20 text-14 "+(titleClassName ?? "")+" "+(t3ClassName ?? "")}>
        <div className={`flex h-${height} items-center gap-8 text-[#222222]`}>
          <p>{title3}</p>
        </div>
        {description3 && <p className="text-[#666666]">{description3}</p>}
      </div>

      <div className={"w-[calc(33%-150px)] items-center self-center py-15 pl-32 pr-20 "+(childClassName ?? "")+" "+(c3ClassName ?? "")}>
        {children3}
      </div>
    </div>
  );
};

export default DescriptionItems3;
