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
  height = 50,
}) => {
  return (
    <div className="flex">
      <div className="flex w-[150px] flex-col justify-center bg-back py-15 pl-20 text-14">
        <div className={`flex h-${height} items-center gap-8 text-[#222222]`}>
          <p>{title1}</p>
        </div>
        {description1 && <p className="text-[#666666]">{description1}</p>}
      </div>

      <div className="w-[calc(50%-150px)] items-center self-center py-15 pl-32 pr-20">
        {children1}
      </div>

      <div className="flex w-[150px] flex-col justify-center bg-back py-15 pl-20 text-14">
        <div className={`flex h-${height} items-center gap-8 text-[#222222]`}>
          <p>{title2}</p>
        </div>
        {description2 && <p className="text-[#666666]">{description2}</p>}
      </div>

      <div className="w-[calc(50%-150px)] items-center self-center py-15 pl-32 pr-20">
        {children2}
      </div>
    </div>
  );
};

export default DescriptionItems2;
