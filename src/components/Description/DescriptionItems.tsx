import Hint from "@/assets/svg/icons/hint.svg";

interface Props {
  title: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  errorMessage?: string;
  isError?: boolean;
  height?: string;
}

const DescriptionItems: React.FC<Props> = ({
  title,
  description,
  required = false,
  children,
  errorMessage,
  isError,
  height = 60,
}) => {
  return (
    <div className="flex">
      <div className={`flex h-${height} w-[150px] flex-col justify-center bg-back px-20 py-10 text-15`}>
        <div className={`v-h-center gap-8 text-[#222222]`}>
          {/* 제목 */}
          <p>{title}</p>
          {/* 필수 */}
          {/* {required && <Highlight />} */}
        </div>

        {/* 설명 */}
        {description && <p className="text-[#666666]">{description}</p>}
      </div>

      {/* 내용 */}
      <div className={`w-[calc(100%-150px)] h-${height} h-center self-center px-20 py-10`}>
        {children}

        {/* {isError && (
          <div className="flex h-26 items-center gap-4 py-5">
            <Hint color="#ff1744" />
            <p className={'text-[#ff1744]'}>{errorMessage}</p>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default DescriptionItems;