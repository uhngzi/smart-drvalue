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
      className={"cursor-pointer rounded-6 bg-back v-h-center " + className}
      onClick={onClick}
      style={size==="lg" ? {width:45, height:45} : {width: 20, height: 20}}
    >
      <p className={size === "lg" ? "w-20 h-20" : "w-16 h-16"}>
        {icon}
      </p>
    </div>
  )
}