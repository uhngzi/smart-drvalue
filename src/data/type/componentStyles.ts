import { JSX } from "react";

export type componentsStylesType = {
  wd?: string;
  ht?: string;
  pd?: string;
  pt?: string;
  pl?: string;
  pr?: string;
  pb?: string;
  mg?: string;
  mt?: string;
  ml?: string;
  mr?: string;
  mb?: string;
  bg?: string;
  fc?: string;
  fs?: string;
  fw?: string;
  bd?: string;
  bd_t?: string;
  bd_l?: string;
  bd_r?: string;
  bd_b?: string;
  bw?: string;
  bc?: string;
  br?: string;
}

export const componentsStyles = (styles:componentsStylesType | undefined) => {
  return {
    width:styles?.wd,
    height:styles?.ht,
    backgroundColor:styles?.bg,
    color:styles?.fc,
    padding:styles?.pd,
    paddingTop:styles?.pt,
    paddingLeft:styles?.pl,
    paddingRight:styles?.pr,
    paddingBottom:styles?.pb,
    margin:styles?.mg,
    marginTop:styles?.mt,
    marginLeft:styles?.ml,
    marginRight:styles?.mr,
    marginBottom:styles?.mb,
    border:styles?.bd,
    borderTop:styles?.bd_t,
    borderLeft:styles?.bd_l,
    borderRight:styles?.bd_r,
    borderBottom:styles?.bd_b,
    borderRadius:styles?.br,
  }
}

export type selectType = {
  value:any;
  label:string;
}

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
}

export type CUtreeType = {
  parentId?: string;
  id: string;
  label: string;
  ordNo?: number;
  useYn?: boolean;
  [key: string]: any;
}