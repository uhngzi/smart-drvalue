import React from "react";
import { Dropdown } from "antd";
import Edit from "@/assets/svg/icons/edit.svg";
import { laminationRType } from "@/data/type/base/lamination";
import { MenuProps } from "antd/lib";

interface BaseLaminationRowProps {
  item: laminationRType;
  onMenuClick: (e: any, item: laminationRType) => void;
  index: number;
}

const items: MenuProps['items'] = [
  {
    label: <>편집</>,
    key: 0,
  },
  {
    label: <>맨 위에 추가</>,
    key: 1,
  },
  {
    label: <>중간에 추가</>,
    key: 2,
  },
  {
    label: <>맨 아래에 추가</>,
    key: 3,
  },
]

const BaseLaminationRow: React.FC<BaseLaminationRowProps> = ({ item, onMenuClick, index }) => {
  return (
    <div
      key={item.id}
      className="w-full h-40 h-center border-b-1 border-[#0000006] text-center"
    >
      <div className="w-70 h-40 v-h-center">{item.matCd}</div>
      <div className="w-56 px-8 py-8">{item.copOut}</div>
      <div className="w-56 px-8 py-8">{item.lamDtlThk}</div>
      <div className="w-56 px-8 py-8">{item.lamDtlRealThk}</div>
      <div className="w-34 v-h-center cursor-pointer">
        <Dropdown
          trigger={["click"]}
          menu={{ items: items, onClick: (e) => onMenuClick(e, item) }}
        >
          <p className="w-16 h-16">
            <Edit />
          </p>
        </Dropdown>
      </div>
    </div>
  );
};

BaseLaminationRow.displayName = 'BaseLaminationRow';

export default React.memo(BaseLaminationRow);