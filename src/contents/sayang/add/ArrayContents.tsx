import ArrayIcon from "@/assets/svg/icons/array.svg";
import AntdSelect from "@/components/Select/AntdSelect";

interface Props {

}

const ArrayContents: React.FC<Props> = ({

}) => {
  return (
    <div className="flex flex-col gap-20">
      <div className="h-center gap-5">
        <p className="w-24 h-24"><ArrayIcon /></p>
        <p className="text-16 font-semibold">배열 도면</p>
      </div>

      <div className="w-full h-[110px] border-1 border-line flex">
        <div className="w-[35%] h-full border-r-1 border-line">
          <div className="h-[50%] flex">
            <p className="w-[50%] h-full bg-back v-h-center p-5">{'1) 배열'}</p>
            <p className="w-[50%] h-full h-center p-5">{'2 x 3'}</p>
          </div>
          <div className="h-[50%] border-t-1 border-line flex">
            <p className="w-[50%] h-full bg-back v-h-center p-5">{'2) 배열'}</p>
            <p className="w-[50%] h-full h-center p-5">{'2 x 3'}</p>
          </div>
        </div>
        <div className="w-full h-full">
          <div className="h-[65%] h-center">
            <p className="w-[20%] h-full bg-back v-h-center p-5">원판</p>
            <div className="w-[80%] h-full">
              <div className="w-full h-[50%] h-center justify-between p-5">
                <p>{'NY-2140 (난야)'}</p>
                <p>FR-1</p>
              </div>
              <div className="w-full h-[50%] h-center justify-between border-t-1 border-line p-5">
                <p>{'1040 x 1240'}</p>
              </div>
            </div>
          </div>
          <div className="h-[35%] border-t-1 border-line flex">
            <p className="w-[20%] h-full bg-back v-h-center p-5">임피던스</p>
            <div className="w-[30%] h-full v-h-center">
              <AntdSelect options={[{value:1,label:'유'},{value:1,label:'무'}]} styles={{bw:'0'}} />
            </div>
            <p className="w-[20%] h-full bg-back v-h-center p-5">쿠폰</p>
            <div className="w-[30%] h-full v-h-center">
              <AntdSelect options={[{value:1,label:'유'},{value:1,label:'무'}]} styles={{bw:'0'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArrayContents;