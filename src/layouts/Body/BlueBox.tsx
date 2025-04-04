const BlueBox: React.FC<{
  children: React.ReactNode;
  key?: any;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  key,
  className,
  style,
}) => {
  return (
    <div
      key={key} style={style}
      className={`flex flex-col w-full border-1 bg-[#E9EDF5] border-line rounded-14 p-15 gap-10 ${className}`}
    >
      {children}
    </div>
  )
}

export default BlueBox;