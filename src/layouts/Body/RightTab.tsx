interface Props {
  children: React.ReactNode;
  className?: string;
}

export const RightTab:React.FC<Props> = ({
  children,
  className,
}) => {
  return (
    <div
      className={"min-w-[80px] w-[3%] h-[100%] px-10 py-20 h-center flex-col bg-white rounded-l-14 gap-20 " + className}
    >
      {children}
    </div>
  )
}