import React from "react";
import Check from "@/assets/svg/icons/s_check.svg";
import Edit from "@/assets/svg/icons/edit.svg";
import { specLaminationType } from "@/data/type/sayang/lamination";

interface SpecSourceRowProps {
  source: specLaminationType;
  index: number;
  isSelected: boolean;
  onSelect: (source: specLaminationType) => void;
}

const SpecSourceRow: React.FC<SpecSourceRowProps> = ({
  source,
  index,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      key={source.id}
      className="w-full h-40 h-center border-b-1 border-[#0000006]"
      style={
        isSelected
          ? { border: "1px solid #4880FF", background: "#DFE9FF", color: "#4880FF", fontWeight: 500 }
          : {}
      }
    >
      <div className="w-40 h-40 v-h-center">
        <div
          className="w-24 h-24 bg-[#E9EDF5] rounded-4 v-h-center"
          style={isSelected ? { border: "0.3px solid #4880FF" } : {}}
        >
          {index + 1}
        </div>
      </div>
      <div className="w-[112px] px-8 py-8">{source.lamNo}</div>
      <div className="w-45 v-h-center">{source.lamThk}T</div>
      <div
        className="w-34 v-h-center cursor-pointer"
        onClick={() => onSelect(source)}
      >
        <p
          className="w-16 h-16"
          style={{ color: isSelected ? "#4880FF" : "#00000080" }}
        >
          {isSelected ? <Check /> : <Edit />}
        </p>
      </div>
    </div>
  );
};

SpecSourceRow.displayName = 'SpecSourceRow';

export default React.memo(SpecSourceRow);
