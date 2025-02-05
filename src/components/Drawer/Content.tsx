interface BaseInfoProps {
  title: string;
  icon?: React.ReactNode;
  btn?: {
    label: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    icon?: React.ReactNode;
  }
}

export const ContentBaseInfo: React.FC<BaseInfoProps> = ({
  title,
  icon,
  btn,
}) => {
  return (
    <>
      {/* 타이틀 */}
      <div className="h-center gap-10 w-full h-50">
        <p>{icon}</p>
        <div className="flex-1">{title}</div>
        <div
          className="w-fit h-center gap-8 px-15 h-32 border-1 border-bdDefault rounded-6"
          onClick={btn?.onClick || (()=>{})}
        >
          {btn?.icon ?? <p className="w-16 h-16">{btn?.icon}</p>}
          {btn?.label}
        </div>
      </div>
    </>
  )
}