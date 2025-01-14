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
        items.map(i => (
          <div 
            className="w-fit px-10 py-3 mr-10"
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
    <div className="border-b-1 border-line w-full flex">
      {
        items.map(i => (
          <div 
            className="w-fit px-30 py-10 mr-10 text-16"
            style={i.link===pathname?{color:'#1814F3',borderBottom:'3px solid #1814F3'}:{}}
          >
            <Link href={i.link} className="text-[#718EBF]">{i.text}</Link>
          </div>
        ))
      }
    </div>
  )
};