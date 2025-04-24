import Link from "next/link";
import { SetStateAction } from "react";
import Star from "@/assets/svg/icons/star.svg";

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
    <div
      className={
        bd_b === false ? "w-full flex" : "border-b-1 border-line w-full flex"
      }
    >
      {items.map((i, idx) => (
        <div
          key={idx}
          className="min-w-67 min-h-46 px-10 py-12 mr-10 text-14 text-center cursor-pointer flex h-center gap-5"
          style={
            i.key === selectKey
              ? { color: "#4880FF", borderBottom: "3px solid #4880FF" }
              : {}
          }
          onClick={() => setSelectKey(i.key)}
        >
          {i.index && (
            <div
              className="w-20 rounded-50 border-1"
              style={
                i.key === selectKey
                  ? { border: "1px solid #4880FF" }
                  : { border: "1px solid #00000060" }
              }
            >
              {i.index}
            </div>
          )}
          <span>{i.text}</span>
        </div>
      ))}
    </div>
  );
};

interface PropsLarge {
  items: Array<{
    text: string;
    link: string;
    parentsText?: string;
  }>;
  pathname: any;
  noLine?: boolean;
  bookmarks?: {
    index?: number;
    name?: string;
  }[];
  handleSubmitBookmark?: (label: string, url: string) => void;
}

export const TabLarge: React.FC<PropsLarge> = ({
  items,
  pathname,
  noLine,
  bookmarks,
  handleSubmitBookmark,
}) => {
  return (
    <div
      className="w-full flex h-50 z-10 relative"
      style={noLine ? {} : { borderBottom: "1px solid #D9D9D9" }}
    >
      {items.map((i, idx) => (
        <div
          key={idx}
          className="flex items-center w-fit px-20 py-10 mr-10 text-14 font-medium"
          style={
            i.link === pathname
              ? { borderBottom: "3px solid #4880FF" }
              : // noLine?
                //   {borderBottom:'1px solid #D9D9D9'} :
                {}
          }
        >
          <Link
            href={i.link}
            className={i.link === pathname ? "#4880FF" : "text-[#718EBF]"}
          >
            {i.text}
          </Link>
          {handleSubmitBookmark && (
            <p
              className="ml-5 w-16 h-16 cursor-pointer text-[#00000065]"
              style={
                bookmarks?.some((b) => b.name === i.link)
                  ? { color: "#FBE158" }
                  : {}
              }
              onClick={() => {
                handleSubmitBookmark(i.parentsText + " > " + i.text, i.link);
              }}
            >
              <Star
                fill={
                  bookmarks?.some((b) => b.name === i.link) ? "#FBE158" : "none"
                }
              />
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
