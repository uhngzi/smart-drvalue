import { componentsStyles, componentsStylesType } from "@/data/type/componentStyles";
import { Button } from "antd";

interface Props {
  label: string;
  styles?: componentsStylesType
  className?: string;
  click: () => void;
  disabled?: boolean
}

const PopupOkButton : React.FC<Props> = ({
  label,
  styles,
  click,
  className,
  disabled,
}) => { 
  return (
    <>
      <Button 
        //default style (className으로 해당 값 변경 시 !important로 지정)
        style={{ width:130, height:35, backgroundColor:'#4880FF', color:'#FFF', fontWeight:600, border:0, boxShadow:'none' }}
        className={className}
        onClick={click}
        disabled={disabled}
      >
        {label}
      </Button>
    </>
  )
 }

 export default PopupOkButton;