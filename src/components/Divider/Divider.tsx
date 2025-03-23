interface Props {
  className?: string;
}

export const DividerH = () => {
  return <div className="w-full h-1 border-t-1"/>
}

export const DividerV:React.FC<Props> = ({
  className
}) => {
  return <div className={`w-1 h-full border-r-1 ${className}`}/>
}