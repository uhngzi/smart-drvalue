import React, { memo, SetStateAction } from "react";

import { laminationRType } from "@/data/type/base/lamination";
import { LamDtlTypeEm } from "@/data/type/enum";

import Close from "@/assets/svg/icons/s_close.svg";
interface LaminationRowProps {
  item: laminationRType;
  index: number;
  color: string[];
  lamination?: laminationRType[];
  setLamination?: React.Dispatch<SetStateAction<laminationRType[]>>;
  disable?: boolean;
}

const LaminationRow: React.FC<LaminationRowProps> = memo(({ item, index, color, lamination, setLamination, disable }) => {
  return (
    <div
      key={item.id}
      className="w-full h-26 v-between-h-center border-1 border-line rounded-4"
      style={{
        background:
          item.lamDtlTypeEm === LamDtlTypeEm.CF
            ? color[0]
            : item.lamDtlTypeEm === LamDtlTypeEm.CCL
            ? color[1]
            : color[2],
      }}
    >
      <div className="w-40 v-h-center">
        <div className="w-18 h-18 bg-[#E9EDF5] rounded-4 v-h-center">{index}</div>
      </div>
      <p className="w-full v-h-center">
        {"(" +
          item.lamDtlTypeEm.toUpperCase() +
          ") " +
          item.lamDtlThk +
          "T " +
          item.copOut +
          "/" +
          item.copIn}
      </p>
      { lamination &&
        <div
        className="w-34 v-h-center cursor-pointer"
        onClick={()=>{
          const newArray = [
            ...lamination.slice(0, index),
            ...lamination.slice(index + 1)
          ];
          setLamination?.(newArray);
        }}
      >
        { item.lamDtlTypeEm !== 'cf' && !disable &&
          <Close />
        }
      </div>}
    </div>
  );
});

LaminationRow.displayName = 'LaminationRow';

export default LaminationRow;