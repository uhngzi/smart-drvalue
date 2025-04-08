import { LabelThin } from "./Label";

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  labelIcon?: React.ReactNode;
}

const LabelItemH:React.FC<Props> = ({
  label,
  children,
  className,
  labelClassName,
  labelIcon,
}) => {
  return (
    <div className={`h-center gap-8 ${className}`}>
      <LabelThin label={label} className={`${labelClassName}`} icon={labelIcon} />
      {children}
    </div>
  )
}

export default LabelItemH;