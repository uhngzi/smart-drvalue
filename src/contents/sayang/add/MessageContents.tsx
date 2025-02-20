import MessageOn from "@/assets/svg/icons/message_on.svg";
import TitleIcon from "@/components/Text/TitleIcon";
import { Button } from "antd";
import { SetStateAction } from "react";

interface Props {
  prcNotice: string;
  setPrcNotice: React.Dispatch<SetStateAction<string>>;
  camNotice: string;
  setCamNotice: React.Dispatch<SetStateAction<string>>;
}

const MessageContents: React.FC<Props> = ({
  prcNotice,
  setPrcNotice,
  camNotice,
  setCamNotice,
}) => {
  return (
    <div className="flex flex-col gap-30">
      <div className="w-full flex flex-col gap-20">
        <TitleIcon
          title="제조 전달사항"
          icon={<MessageOn />}
        />
        <textarea
          className="w-full min-h-[120px] rounded-14 bg-back border-1 border-line text-12 p-20 flex flex-col gap-10"
          value={prcNotice}
          onChange={(e)=>{setPrcNotice(e.target.value)}}
        />
      </div>
      
      <div className="w-full flex flex-col gap-20">
        <TitleIcon
          title="CAM 전달사항"
          icon={<MessageOn />}
        />
        <textarea
          className="w-full min-h-[120px] rounded-14 bg-back border-1 border-line text-12 p-20 flex flex-col gap-10"
          value={camNotice}
          onChange={(e)=>{setCamNotice(e.target.value)}}
        />
      </div>
    </div>
  )
}

export default MessageContents;