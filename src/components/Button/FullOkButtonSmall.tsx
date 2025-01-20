import { Button } from "antd";

import Submit from "@/assets/svg/icons/submit.svg";

interface Props {
  label: string;
  click: () => void;
  className?: string;
  disabled?: boolean;
}

const FullOkButtonSmall : React.FC<Props> = ({
  label,
  click,
  className,
  disabled,
}) => { 
  return (
    <>
      <Button 
        //default style (className으로 해당 값 변경 시 !important로 지정)
        style={{ backgroundColor:'#4880FF', color:'#FFF', fontWeight:500, border:0, boxShadow:'none' }}
        className={className}
        onClick={click}
        disabled={disabled}
      >
        <div className="w-full h-center justify-between gap-10">
          <p className="w-14 h-14"><Submit stroke={'#fff'} /></p>
          <p className="">{label}</p>
        </div>
      </Button>
    </>
  )
 }

 export default FullOkButtonSmall;