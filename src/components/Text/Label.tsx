interface Props {
  label: string;
  icon?: React.ReactNode;
}

export const LabelThin:React.FC<Props> = ({
  label,
}) => {
  return (
    <p className="h-22 text-[rgba(0, 0, 0, 0.85)]">{label}</p>
  )
}

export const LabelMedium:React.FC<Props> = ({
  label,
}) => {
  return (
    <p className="text-[rgba(0, 0, 0, 0.85)] text-16 font-medium">{label}</p>
  )
}

export const LabelIcon:React.FC<Props> = ({
  label,
  icon,
}) => {
  return (
    <div className="text-[rgba(0, 0, 0, 0.85)] h-center gap-4">
      <p className="w-16 h-16">{icon}</p>
      {label}
    </div>
  )
}