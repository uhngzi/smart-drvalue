import ArrayIcon from "@/assets/svg/icons/array.svg";
import AntdSelect from "@/components/Select/AntdSelect";
import TitleIcon from "@/components/Text/TitleIcon";

interface Props {

}

const ArrayContents: React.FC<Props> = ({

}) => {
  return (
    <div className="w-full flex flex-col gap-20">
      <TitleIcon
        title="배열 도면"
        icon={<ArrayIcon />}
      />

      <div className="w-full h-[310px] flex flex-col gap-30 items-center">
        <div className="h-[111px] border-1 border-line flex">
          <div className="flex-grow-[1] h-[110px] border-r-1 border-line">
            <div className="h-55 flex">
              <div className="w-60 text-12 bg-back v-h-center p-5">{'① 배열'}</div>
              <div className="w-70 text-12 h-center p-5">{'2 x 3'}</div>
            </div>
            <div className="h-55 border-t-1 border-line flex">
              <div className="w-60 text-12 bg-back v-h-center p-5">{'② 배열'}</div>
              <div className="w-70 text-12 h-center p-5">{'2 x 3'}</div>
            </div>
          </div>
          <div className="flex-grow-[2] h-[110px]">
            <div className="h-74 h-center flex">
              <p className="w-65 h-full bg-back v-h-center p-5">원판</p>
              <div className="flex-grow-[35] h-full">
                <div className="h-37 v-between-h-center p-5">
                  <p>{'NY-2140 (난야)'}</p>
                  <p>FR-1</p>
                </div>
                <div className="w-full h-[50%] v-between-h-center border-t-1 border-line p-5">
                  <p>{'1040 x 1240'}</p>
                </div>
              </div>
            </div>
            <div className="h-36 border-t-1 border-line flex">
              <p className="w-65 bg-back v-h-center p-5">임피던스</p>
              <div className="flex-grow-[12] h-full v-h-center">
                <AntdSelect options={[{value:1,label:'유'},{value:2,label:'무'}]} styles={{bw:'0',pd:'0'}} />
              </div>
              <p className="w-65 bg-back v-h-center p-5">쿠폰</p>
              <div className="flex-grow-[12] h-full v-h-center">
                <AntdSelect options={[{value:1,label:'유'},{value:2,label:'무'}]} styles={{bw:'0',pd:'0'}} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[350px] h-[170px] mx-25 py-6 flex flex-col gap-3">
          <div className="v-h-center gap-3">
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-back border-1 border-line">
              {`① 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-back border-1 border-line">
              {`① 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-[#E9EDF5] border-1 border-line">
              {`② 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-[#E9EDF5] border-1 border-line">
              {`② 2x3`}
            </div>
          </div>
          <div className="v-h-center gap-3">
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-back border-1 border-line">
              {`① 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-back border-1 border-line">
              {`① 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-[#E9EDF5] border-1 border-line">
              {`② 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-[#E9EDF5] border-1 border-line">
              {`② 2x3`}
            </div>
          </div>
          <div className="v-h-center gap-3">
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-back border-1 border-line">
              {`① 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-back border-1 border-line">
              {`① 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-[#E9EDF5] border-1 border-line">
              {`② 2x3`}
            </div>
            <div className="w-85 h-50 v-h-center text-[#979797] text-12 bg-[#E9EDF5] border-1 border-line">
              {`② 2x3`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArrayContents;