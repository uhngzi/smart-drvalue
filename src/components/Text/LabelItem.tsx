import { LabelThin } from "./Label";

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  labelIcon?: React.ReactNode;
}

const LabelItem:React.FC<Props> = ({
  label,
  children,
  className,
  labelClassName,
  labelIcon,
}) => {
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <LabelThin label={label} className={`${labelClassName}`} icon={labelIcon} />
      {children}
    </div>
  )
}

export default LabelItem;