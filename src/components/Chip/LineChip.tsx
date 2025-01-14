import { useEffect, useState } from "react";

interface Props {
  label: string;
  color: string;
  select?: boolean;
  selectLineColor?: string;
  className?: string;
}

const LineChip: React.FC<Props> = ({ label, color, select, selectLineColor, className }) => {
  return (
    <>
      <div 
        className={`flex w-fit p-5 px-15 rounded-50 border-[1.3px] text-[#202224] ${className}`}
        style={{ 
          border:select?selectLineColor?`1px solid ${selectLineColor}`:'1px solid #3749A6':`1px solid ${color}`,
          fontWeight:select?800:400
        }}
      >
        {label}
      </div>
    </>
  )
}

export default LineChip;