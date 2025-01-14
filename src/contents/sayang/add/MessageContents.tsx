import MessageOn from "@/assets/svg/icons/message_on.svg";

interface Props {

}

const MessageContents: React.FC<Props> = ({

}) => {
  return (
    <div className="flex flex-col gap-30">
      <div className="w-full flex flex-col gap-20">
        <div className="h-center gap-5">
          <p className="w-24 h-24"><MessageOn /></p>
          <p className="text-16 font-semibold">제조 전달사항</p>
        </div>
        <div className="w-full min-h-50 rounded-14 bg-back border-1 border-line">

        </div>
      </div>
      
      <div className="w-full flex flex-col gap-20">
        <div className="h-center gap-5">
          <p className="w-24 h-24"><MessageOn /></p>
          <p className="text-16 font-semibold">CAM 전달사항</p>
        </div>
        <div className="w-full min-h-50 rounded-14 bg-back border-1 border-line">

        </div>
      </div>
    </div>
  )
}

export default MessageContents;