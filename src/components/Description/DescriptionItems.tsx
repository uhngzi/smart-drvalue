import Hint from "@/assets/svg/icons/hint.svg";

interface Props {
  title: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  errorMessage?: string;
  isError?: boolean;
  height?: string;
  titleClassName?: string;
  childClassName?: string;
}

const DescriptionItems: React.FC<Props> = ({
  title,
  description,
  required = false,
  children,
  errorMessage,
  isError,
  titleClassName,
  childClassName,
  height = 60,
}) => {
  return (
    <div className="flex">
      <div className={`flex w-[150px] flex-col justify-center bg-back py-15 pl-20 text-14 ${titleClassName ?? ""}`}>
        <div className={`flex h-${height} items-center gap-8 text-[#222222]`}>
          {/* 제목 */}
          <p>{title}</p>
        </div>

        {/* 설명 */}
        {description && <p className="text-[#666666]">{description}</p>}
      </div>

      {/* 내용 */}
      <div className={`w-[calc(100%-150px)] h-${height} h-center self-center px-20 py-10 ${childClassName ?? ""}`}>
        {children}
      </div>
    </div>
  )
}

export default DescriptionItems;