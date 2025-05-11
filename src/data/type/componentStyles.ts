import { JSX } from "react";

export type componentsStylesType = {
  wd?: string; // width
  ht?: string; // height
  pd?: string; // padding
  pt?: string; // padding top
  pl?: string; // padding left
  pr?: string; // padding right
  pb?: string; // padding bottom
  mg?: string; // margin
  mt?: string; // margin top
  ml?: string; // margin left
  mr?: string; // margin right
  mb?: string; // margin bottom
  bg?: string; // background
  ta?: string; // text align
  fc?: string; // font color
  fs?: string; // font size
  fw?: string; // font wieght
  bd?: string; // border
  bd_t?: string; // border top
  bd_l?: string; // border left
  bd_r?: string; // border rignt
  bd_b?: string; // border bottom
  bw?: string; // border width
  bc?: string; // border color
  br?: string; // border radius
  focus?: string; // focus 시 스타일, important 필수 입력 ex) border-color: #4096ff !important;
};

export const componentsStyles = (styles: componentsStylesType | undefined) => {
  return {
    width: styles?.wd,
    height: styles?.ht,
    backgroundColor: styles?.bg,
    color: styles?.fc,
    padding: styles?.pd,
    paddingTop: styles?.pt,
    paddingLeft: styles?.pl,
    paddingRight: styles?.pr,
    paddingBottom: styles?.pb,
    margin: styles?.mg,
    marginTop: styles?.mt,
    marginLeft: styles?.ml,
    marginRight: styles?.mr,
    marginBottom: styles?.mb,
    border: styles?.bd,
    borderTop: styles?.bd_t,
    borderLeft: styles?.bd_l,
    borderRight: styles?.bd_r,
    borderBottom: styles?.bd_b,
    borderRadius: styles?.br,
  };
};

export type selectType = {
  value: any;
  label: string | number;
};

export type treeType = {
  id: string;
  label: string;
  odNum?: number;
  useYn?: boolean;
  children?: Array<{
    id: string;
    label: string;
    odNum?: number;
    isInternal?: boolean;
    wipPrcNm?: string;
    useYn?: boolean;
  }>;
  open: boolean;
};

export type CUtreeType = {
  parentId?: string;
  id: string;
  label: string;
  ordNo?: number;
  useYn?: boolean;
  [key: string]: any;
};
