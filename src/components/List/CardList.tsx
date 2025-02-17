import React from "react";
import { Button } from "antd";

import Bag from "@/assets/svg/icons/bag.svg";

import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";

interface Item {
  label: string;
  value: any;
  widthType: string; // full: 한 줄 차지, half: 2개씩 나열
}

interface CardListProps {
  title: string;
  btnLabel?: React.ReactNode;
  items: Item[];
  btnClick?: () => void;
  children?: React.ReactNode;
}

const CardList: React.FC<CardListProps> = ({ items, btnClick, title, btnLabel, children}) => {
  return (
    <div className="p-10">
      {/* 제목 영역 */}
      {!!title && (
        <div className="w-full flex justify-between items-center h-[50px]">
          <div className="flex items-center gap-10">
            <Bag />
            <p className="text-16 font-medium">{title}</p>
          </div>
          {btnLabel && <Button onClick={btnClick}>
            {btnLabel}
          </Button>}
        </div>
      )}

      {/* 정보 섹션 */}
      <section className="p-20 rounded-lg bg-[#F8F8F8] border border-[#D9D9D9]">
        {children ? (
          children
        ) : (
          // {/* Grid 구조로 동적 배치 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <div
                key={index} // index를 key로 사용
                className={` ${
                  item.widthType === "full" ? "col-span-2" : "col-span-1"
                }`}
              >
                <p className="pb-8">{item.label}</p>
                <p className="pb-24 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CardList;
