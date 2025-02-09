import Link from "next/link";
import { SetStateAction } from "react";

interface Props {
  items: Array<{
    key: any;
    text: string;
  }>;
  selectKey: any;
  setSelectKey: React.Dispatch<SetStateAction<any>>;
}

export const TabSmall: React.FC<Props> = ({
  items,
  selectKey,
  setSelectKey,
}) => {
  return (
    <div className="border-b-1 border-line w-full flex">
      {
        items.map((i, idx) => (
          <div 
            key={idx}
            className="min-w-67 min-h-46 px-10 py-12 mr-10 text-14 text-center cursor-pointer"
            style={i.key===selectKey?{color:'#1814F3',borderBottom:'3px solid #1814F3'}:{}}
            onClick={()=>setSelectKey(i.key)}
          >
            {i.text}
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