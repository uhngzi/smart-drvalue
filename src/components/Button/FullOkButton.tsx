import { componentsStyles, componentsStylesType } from "@/data/type/componentStyles";
import { Button } from "antd";

import Submit from "@/assets/svg/icons/submit.svg";

interface Props {
  label: string;
  click: () => void;
  className?: string;
  disabled?: boolean;
}

const FullOkButton : React.FC<Props> = ({
  label,
  click,
  className,
  disabled,
}) => { 
  return (
    <>
      <Button 
        //default style (className으로 해당 값 변경 시 !important로 지정)
        style={{  width:175, height:50, backgroundColor:'#4880FF', color:'#FFF', fontSize:'16px', fontWeight:'bold', border:0, boxShadow:'none' }}
        className={className}
        onClick={click}
        disabled={disabled}
      >
        <div className="w-full v-h-center gap-10">
          <div className="w-24 h-24"><Submit stroke={'#fff'} /></div>
          <p className="">{label}</p>
        </div>
      </Button>
    </>
  )
 }

 export default FullOkButton;