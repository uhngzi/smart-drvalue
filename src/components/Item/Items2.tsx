
export const Label:React.FC<{label:string, className?:string}> = ({ label, className }) => {
  return <p className={`h-center ${className}`}>{label}</p>
}

const Items2:React.FC<{
  children1: React.ReactNode;
  children2?: React.ReactNode;
  label1?: string;
  label2?: string;
  size1?: number;
  size2?: number;
}> = ({
  label1,
  label2,
  children1,
  children2,
  size1 = 2,
  size2 = 2,
}) => {
  return (
    <div className="flex flex-col gap-10 justify-center">
      <div
        className="flex flex-col justify-center !h-54"
        style={{width: 70*size1, minWidth: 70*size1}}
      >
        {label1 && <Label label={label1} />}
        {children1}
      </div>
      { children2 &&
        <div
          className="flex flex-col justify-center !h-54"
          style={{width: 70*size2, minWidth: 70*size2}}
        >
          {label2 && <Label label={label2} />}
          {children2}
        </div>
      }
    </div>
  )
}

export default Items2;