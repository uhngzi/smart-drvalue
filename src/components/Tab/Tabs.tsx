import Link from "next/link";
import { SetStateAction } from "react";

interface Props {
  items: Array<{
    key: any;
    text: string;
    index?: number;
  }>;
  selectKey: any;
  setSelectKey: React.Dispatch<SetStateAction<any>>;
  bd_b?: boolean;
}

export const TabSmall: React.FC<Props> = ({
  items,
  selectKey,
  setSelectKey,
  bd_b,
}) => {
  return (
    <div className={bd_b === false ? "w-full flex" : "border-b-1 border-line w-full flex"}>
      {
        items.map((i, idx) => (
          <div 
            key={idx}
            className="min-w-67 min-h-46 px-10 py-12 mr-10 text-14 text-center cursor-pointer flex h-center gap-5"
            style={i.key===selectKey?{color:'#4880FF',borderBottom:'3px solid #4880FF'}:{}}
            onClick={()=>setSelectKey(i.key)}
          >
            {i.index &&
            <div
              className="w-20 rounded-50 border-1"
              style={i.key===selectKey?{border:'1px solid #4880FF'}:{border:'1px solid #00000060'}}
            >{i.index}</div>}
            <span>{i.text}</span>
          </div>
        ))
      }
    </div>
  )
};

interface PropsLarge {
  items: Array<{
    text: string;
    link: string;
  }>;
  pathname: any;
}

export const TabLarge: React.FC<PropsLarge> = ({
  items,
  pathname,
}) => {
  return (
    <div className="w-full flex h-50 z-10 relative" style={{borderBottom:'1px solid #D9D9D9'}}>
      {
        items.map((i, idx) => (
          <div 
            key={idx}
            className="flex items-center w-fit px-20 py-10 mr-10 text-14 font-medium"
            style={i.link===pathname?{borderBottom:'3px solid #4880FF'}:{}}
          >
            <Link href={i.link} className={i.link===pathname?"#4880FF":"text-[#718EBF]"}>{i.text}</Link>
          </div>
        ))
      }
    </div>
  )
};