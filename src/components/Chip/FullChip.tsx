import { useEffect, useState } from "react";

interface Props {
  label: string;
  state?: 'super' | 'primary' | 'warning' | 're' | 'default';
  className?: string;
  click?: () => void;
}

const FullChip: React.FC<Props> = ({ 
  label, 
  state, 
  className,
  click,
}) => {
  const [bg, setBg] = useState<string>('bg-border');
  const [fc, setFc] = useState<string>('text-[#8D8D8D]');
  useEffect(()=>{
    switch(state) {
      case 'super' : setBg('bg-[#d6cbff]'); setFc('text-[#6226EF]'); break;
      case 'primary' : setBg('bg-[#f3d1ec]'); setFc('text-[#D456FD]'); break;
      case 'warning' : setBg('bg-[#ffe6d2]'); setFc('text-[#E99151]'); break;
      case 're' : setBg('bg-[#d9f1ec]'); setFc('text-[#00B69B]'); break;
      case 'default' : setBg('bg-line'); setFc('text-[#8D8D8D]'); break;
      default : setBg('bg-line'); setFc('text-[#8D8D8D]'); break;
    }
  }, [state])

  return (
    <>
      <div 
        className={`flex w-fit p-5 rounded-4 ${bg} ${fc} font-semibold ${className}`+(click?' cursor-pointer':' cursor-default')}
        onClick={click}
      >
        {label}
      </div>
    </>
  )
}

export default FullChip;