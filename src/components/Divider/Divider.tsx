interface Props {
  className?: string;
}

export const DividerH:React.FC<Props> = ({
  className
}) => {
  return <div className={`w-full h-1 border-t-1 ${className}`}/>
}

export const DividerV:React.FC<Props> = ({
  className
}) => {
  return <div className={`w-1 h-full border-r-1 ${className}`}/>
}