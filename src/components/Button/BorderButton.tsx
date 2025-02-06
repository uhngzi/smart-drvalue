import { componentsStylesType } from "@/data/type/componentStyles";

interface Props {
  label: any;
  click?: () => void;
  styles?: componentsStylesType;
}

const BorderButton : React.FC<Props> = ({
  label,
  click,
  styles,
}) => {
  return (
    <div 
      className="v-h-center px-10 rounded-6 border-1 border-[#444444] text-[#444444] h-32 cursor-pointer"
      onClick={click}
      style={{borderColor:styles?.bc,height:styles?.ht,color:styles?.fc,padding:styles?.pd}}
    >
      {label}
    </div>
  )
}

export default BorderButton;