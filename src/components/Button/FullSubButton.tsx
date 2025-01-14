import { Button } from "antd";

interface Props {
  label: string;
  click: () => void;
  className?: string;
  disabled?: boolean;
}

const FullSubButton : React.FC<Props> = ({
  label,
  click,
  className,
  disabled,
}) => { 
  return (
    <>
      <Button 
        //default style (className으로 해당 값 변경 시 !important로 지정)
        style={{ width:175, height:50, fontSize:'16px', border:'2px solid #4880FF', color:'#4880FF', boxShadow:'none', background:'none', }}
        className={className}
        onClick={click}
        disabled={disabled}
      >
        {label}
      </Button>
    </>
  )
 }

 export default FullSubButton;