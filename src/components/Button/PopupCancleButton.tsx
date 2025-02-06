import { componentsStyles, componentsStylesType } from "@/data/type/componentStyles";
import { Button } from "antd";

interface Props {
  label: string;
  click: () => void;
  className?: string;
  disabled?: boolean;
}

const PopupCancleButton : React.FC<Props> = ({
  label,
  click,
  className,
  disabled,
}) => { 
  return (
    <>
      <Button 
        //default style (className으로 해당 값 변경 시 !important로 지정)
        style={{ width:130, height:35, color:'#979797', fontWeight:600, border:'1px solid #979797', boxShadow:'none' }}
        className={className}
        onClick={click}
        disabled={disabled}
      >
        {label}
      </Button>
    </>
  )
 }

 export default PopupCancleButton;