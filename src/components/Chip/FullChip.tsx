import { useEffect, useState } from "react";

interface Props {
  label: string;
  state?: 'purple' | 'pink' | 'yellow' | 'mint' | 'line' | 'default';
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
      case 'purple' : setBg('bg-[#6226EF20]'); setFc('text-[#6226EF]'); break;
      case 'pink' : setBg('bg-[#D456FD20]'); setFc('text-[#D456FD]'); break;
      case 'yellow' : setBg('bg-[#FFA75620]'); setFc('text-[#FFA756]'); break;
      case 'mint' : setBg('bg-[#00B69B20]'); setFc('text-[#00B69B]'); break;
      case 'line' : setBg('bg-white'); setFc('!text-[#444444] border-1 border-[#4880FF]'); break;
      case 'default' : setBg('bg-[#8D8D8D20]'); setFc('text-[#8D8D8D]'); break;
      default : setBg('bg-[#8D8D8D20]'); setFc('text-[#8D8D8D]'); break;
    }
  }, [state])

  return (
    <>
      <div 
        className={`w-fit p-5 rounded-4 h-25 v-h-center ${bg} ${fc} font-medium ${className}`+(click?' cursor-pointer':' cursor-default')}
        onClick={click}
      >
        {label}
      </div>
    </>
  )
}

export default FullChip;