const BoxHead:React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className,
}) => {
  return (
    <div className={`w-full min-h-60 h-center gap-15 ${className}`}>
      {children}
    </div>
  )
}

export default BoxHead;