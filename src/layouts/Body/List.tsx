interface Props {
  children: React.ReactNode;
}

export const List:React.FC<Props> = ({
  children,
}) => {
  return (
    <div className="flex flex-col gap-20" style={{borderTop:' 1px solid rgba(0,0,0,6%)'}}>
      {children}
    </div>
  )
}