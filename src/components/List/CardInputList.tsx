import React from "react";
import { Button } from "antd";



import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";
import AntdInput from "../Input/AntdInput";

interface Item {
  name: string;
  label: string;
  value: any;
  type: string;
  widthType: string; // full: 한 줄 차지, half: 2개씩 나열
}

interface CardInputListProps {
  title?: string;
  btnLabel?: React.ReactNode;
  items: Item[];
  titleIcon?: React.ReactNode;
  styles?: {
    gap?: string;
    bgColor?: string;
  }
  btnClick?: () => void;
  handleDataChange: (e: React.ChangeEvent<HTMLInputElement>, name: string, type: 'input' | 'select' | 'date' | 'other',) => void;
  children?: React.ReactNode;
}

const CardInputList: React.FC<CardInputListProps> = ({ items, title, btnLabel, titleIcon, styles, btnClick, handleDataChange, children}) => {
  return (
    <div className="p-10 flex flex-col gap-10">
      {/* 제목 영역 */}
      {!!title && (
        <div className="w-full flex justify-between items-center h-[50px]">
          <div className="flex items-center gap-10">
              {titleIcon}
            <p className="text-16 font-medium">{title}</p>
          </div>
        </div>
      )}

      {/* 정보 섹션 */}
      <section className="p-20 rounded-lg bg-[#F8F8FA] border border-[#D9D9D9]">
        {children ? (
          children
        ) : (
          // {/* Grid 구조로 동적 배치 */}
          <div className={`grid grid-cols-1 md:grid-cols-6 ${styles?.gap ?? 'gap-10'}`}>
            {items.map((item, index) => (
              <div
                key={index} // index를 key로 사용
                className={` ${
                  item.widthType === "full" ? "col-span-6" :
                  item.widthType === "half" ? "col-span-3" :
                  item.widthType === "third" ? "col-span-2" :
                  "col-span-1"
                }`}
              >
                <p className="pb-8">{item.label}</p>
                <AntdInput 
                  defaultValue={item.value ?? ''}
                  onChange={(e) => handleDataChange(e, item.name, 'input')}
                />
              </div>
            ))}
          </div>
        )}
      </section>
      {!!btnLabel && (
        <div className="h-[50px]">
            {btnLabel}
        </div>
      )}
    </div>
  );
};

export default CardInputList;
