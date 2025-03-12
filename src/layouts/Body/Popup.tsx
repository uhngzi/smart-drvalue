import { DividerH } from "@/components/Divider/Divider";
import { LabelMedium } from "@/components/Text/Label";

interface Props {
  children: React.ReactNode;
  title?: string;
  titleEtc?: React.ReactNode;
  className?: string;
}

export const Popup:React.FC<Props> = ({
  children,
  title,
  className,
  titleEtc,
}) => {
  return (
    <div
      className={"w-full p-30 flex flex-col gap-20 rounded-14 bg-white " + className}
    >
      {title && !titleEtc && <>
        <LabelMedium label={title}/>
        <DividerH />
      </>}
      {title && titleEtc && <>
        <div className="flex gap-10 h-center">
          <LabelMedium label={title}/>
          {titleEtc}
        </div>
        <DividerH />
      </>}
      {children}
    </div>
  )
}