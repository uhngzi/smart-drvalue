import MessageOn from "@/assets/svg/icons/message_on.svg";
import TitleIcon from "@/components/Text/TitleIcon";

interface Props {

}

const MessageContents: React.FC<Props> = ({

}) => {
  return (
    <div className="flex flex-col gap-30">
      <div className="w-full flex flex-col gap-20">
        <TitleIcon
          title="제조 전달사항"
          icon={<MessageOn />}
        />
        <ul 
          className="w-full min-h-50 rounded-14 bg-back border-1 border-line text-12 p-20 flex flex-col gap-10"
          style={{listStyle:"outside"}}
        >
          <li className="ml-20">PSR 색상주의 : 녹색(무광)</li>
          <li className="ml-20">M/K 색상주의 : 검정</li>
          <li className="ml-20">마스크 편심 주의</li>
          <li className="ml-20">승인원(필름1부) 제출</li>
        </ul>
      </div>
      
      <div className="w-full flex flex-col gap-20">
        <TitleIcon
          title="CAM 전달사항"
          icon={<MessageOn />}
        />
        <ul 
          className="w-full min-h-50 rounded-14 bg-back border-1 border-line text-12 p-20 flex flex-col gap-10"
          style={{listStyle:"outside"}}
        >
          <li className="ml-20">VIA LAND 0.65 작업하되, 간격 안 나오는 부분 0.63 작업</li>
          <li className="ml-20">TOP IC 마스크 없는 부분 만들어서 작업</li>
          <li className="ml-20">승인원(필름1부) 제출</li>
        </ul>

      </div>
    </div>
  )
}

export default MessageContents;