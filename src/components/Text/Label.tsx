interface Props {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const LabelThin:React.FC<Props> = ({
  label,
  className,
}) => {
  return (
    <p className={className+" h-22 text-[rgba(0, 0, 0, 0.85)]"} style={{ whiteSpace: 'pre-line' }}>{label}</p>
  )
}

export const LabelMedium:React.FC<Props> = ({
  label,
  className,
}) => {
  return (
    <p className={className+" text-[rgba(0, 0, 0, 0.85)] text-16 font-medium"} style={{ whiteSpace: 'pre-line' }}>{label}</p>
  )
}

export const LabelBold:React.FC<Props> = ({
  label,
  className,
}) => {
  return (
    <p className={className+" text-[rgba(0, 0, 0, 0.85)] text-16 font-bold"} style={{ whiteSpace: 'pre-line' }}>{label}</p>
  )
}

export const LabelIcon:React.FC<Props> = ({
  label,
  icon,
  className,
}) => {
  return (
    <div className={className+" text-[rgba(0, 0, 0, 0.85)] h-center gap-4"} style={{ whiteSpace: 'pre-line' }}>
      <p className="w-16 h-16 h-center justify-center">{icon}</p>
      {label}
    </div>
  )
}