import MessageOn from "@/assets/svg/icons/message_on.svg";

interface Props {

}

const LaminationContents: React.FC<Props> = ({

}) => {
  return (
    <div className="flex flex-col gap-20">
      <div className="h-center gap-10">
        <div className="w-[50%] h-center gap-5">
          <p className="w-24 h-24"><MessageOn /></p>
          <p className="text-16 font-semibold">적층구조</p>
        </div>
        <div className="w-[50%] v-h-center h-24 rounded-6 border-[0.6px] borer-line bg-back text-14">
          코드 : 040000A
        </div>
      </div>

      <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
        <div className="bg-[#CEE4B3] h-20 v-h-center border-1 border-line">Hoz</div>
        <div className="bg-back h-20 v-h-center border-1 border-line">(BS) 7628HRC x 1</div>
        <div className="bg-[#7551E920] h-20 v-h-center border-1 border-line">(T/C) 1.00T 1/1oz</div>
        <div className="bg-back h-20 v-h-center border-1 border-line">(BS) 7628HRC x 1</div>
        <div className="bg-[#CEE4B3] h-20 v-h-center border-1 border-line">Hoz</div>
      </div>
    </div>
  )
}

export default LaminationContents;