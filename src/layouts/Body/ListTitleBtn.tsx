import { SetStateAction } from "react"

interface Props {
  label?: string;
  onClick?: (e?: React.MouseEvent) => void;
  icon?: React.ReactNode;
}

const ListTitleBtn: React.FC<Props> = ({
  label,
  onClick,
  icon,
}) => {
  return (
    <div 
      className="w-full h-50 flex h-center justify-end absolute top-0"
    >
      <div className="w-80 h-30 rounded-6 bg-point1 text-white v-h-center cursor-pointer flex gap-4 z-20"
      onClick={(e) => {
        e.stopPropagation(); 
        onClick?.(e);
      }}>
        {icon}
        <span>{label}</span>
      </div>
    </div>
  )
}

export default ListTitleBtn;