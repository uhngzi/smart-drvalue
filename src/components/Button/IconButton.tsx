interface Props {
  icon?: React.ReactNode;
  size?: "lg" | "sm";
  onClick?: () => void;
  className?: string;
}

export const IconButton:React.FC<Props> = ({
  icon,
  size,
  onClick,
  className,
}) => {
  return (
    <div 
      className={"cursor-pointer bg-back v-h-center " + className}
      onClick={onClick}
      style={size==="lg" ? {width:45, height:45, borderRadius:6} : {width: 24, height: 24, borderRadius:4}}
    >
      <p className={size === "lg" ? "w-20 h-20" : "w-16 h-16"}>
        {icon}
      </p>
    </div>
  )
}