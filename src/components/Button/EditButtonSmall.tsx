import { Button } from "antd";

import Edit from "@/assets/svg/icons/memo.svg";

interface Props {
  label: string;
  click: () => void;
  className?: string;
  disabled?: boolean;
}

const EditButtonSmall : React.FC<Props> = ({
  label,
  click,
  className,
  disabled,
}) => { 
  return (
    <>
      <Button 
        //default style (className으로 해당 값 변경 시 !important로 지정)
        style={{ color:'#444444', border:'1px solid #D5D5D5', boxShadow:'none' }}
        className={className}
        onClick={click}
        disabled={disabled}
      >
        <div className="w-full h-center justify-between gap-10">
          <p className="w-14 h-14"><Edit /></p>
          <p className="">{label}</p>
        </div>
      </Button>
    </>
  )
 }

 export default EditButtonSmall;