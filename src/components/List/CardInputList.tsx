import React, { useEffect } from "react";
import { Button } from "antd";

import Bag from "@/assets/svg/icons/bag.svg";
import Hint from "@/assets/svg/icons/s_excalm.svg";

import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";
import AntdInput from "../Input/AntdInput";
import { isValidEmail } from "@/utils/formatEmail";
import { isValidTel } from "@/utils/formatPhoneNumber";
import AntdDatePicker from "../DatePicker/AntdDatePicker";
import dayjs from "dayjs";
import styled from "styled-components";

interface Item {
  name: string;
  label?: string;
  value: any;
  type: string;
  widthType: string; // full: 한 줄 차지, half: 2개씩 나열
  fbtn?: React.ReactNode;
  placeholder?: string;
  customhtml?: React.ReactNode;
}

interface CardInputListProps {
  title?: string;
  btnLabel?: React.ReactNode;
  items: Item[];
  titleIcon?: React.ReactNode;
  styles?: {
    gap?: string;
    bg?: string;
    pd?: string;
  }
  btnClick?: () => void;
  handleDataChange: (
    e: React.ChangeEvent<HTMLInputElement> | string, 
    name: string, 
    type: 'input' | 'select' | 'date' | 'other',
  ) => void;
  children?: React.ReactNode;
}

const CardInputList: React.FC<CardInputListProps> = ({ items, title, btnLabel, titleIcon, styles, btnClick, handleDataChange, children}) => {
  
  return (
    <StyledCardInputList 
      $bg={styles?.bg ? styles.bg : "#F8F8FA"}
      $pd={styles?.pd ? styles.pd : "20px"}
      className="p-10 flex flex-col gap-10">
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
      <section className="rounded-lg border border-[#D9D9D9]">
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
                { item.label ? <p className="pb-8">{item.label}</p> : null}
                <div className="h-center gap-10" style={{marginTop: item.label ? 0 : -10}}>
                  { item.fbtn ?? null }
                  {item.type === "input" && (
                    <AntdInput 
                      value={item.value ?? undefined}
                      onChange={(e)=>handleDataChange(e, item.name, 'input')}
                      placeholder={item?.placeholder}
                    />
                  )}
                  {item.type === "date" && (
                    <AntdDatePicker
                      value={item.value ?? undefined}
                      onChange={(e:Date)=>handleDataChange(dayjs(e).startOf('day').format('YYYY-MM-DDTHH:mm:ss'), item.name, 'date')}
                      placeholder={item?.placeholder}
                      className="w-full !rounded-0 h-32"
                      styles={{bc: '#e5e7eb', wd: '100%'}}
                      suffixIcon="cal"
                    />
                  )}
                  {item.type === "custom" && (
                    <>{item.customhtml}</>
                  )}
                </div>
                { item.value ?
                  // 이메일 형식 체크
                  item.name.toLowerCase().includes("email") && !isValidEmail(item?.value?.toString()) ?
                  <div className="h-center gap-3 text-[red]">
                    <p className="w-15 h-15"><Hint/></p>
                    올바르지 않은 이메일입니다.
                  </div> :
                  // 전화번호 형식 체크
                  (item.name.toLowerCase().includes("tel")
                  || item.name.toLowerCase().includes("mobile"))
                  && !isValidTel(item?.value?.toString()) ? 
                    <div className="h-center gap-3 text-[red]">
                      <p className="w-15 h-15"><Hint/></p>
                      올바르지 않은 전화번호입니다.
                    </div> :
                  <></>
                  :<></>
                }
              </div>
            ))}
          </div>
        )}
      </section>
      {!!btnLabel && (
        <>{btnLabel}</>
      )}
    </StyledCardInputList>
  );
};

const StyledCardInputList = styled.div<{
  $bg: string;
  $pd: string;
}>`
  & > section {
    background: ${({ $bg }) => $bg};
    padding: ${({ $pd }) => $pd};
  }
  
`

export default CardInputList;
