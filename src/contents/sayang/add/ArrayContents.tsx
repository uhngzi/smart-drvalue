import ArrayIcon from "@/assets/svg/icons/array.svg";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSelect from "@/components/Select/AntdSelect";
import TitleIcon from "@/components/Text/TitleIcon";
import YieldCalculate from "@/contents/base/yield/YieldCalculate";
import { boardType } from "@/data/type/base/board";
import { yieldInputType } from "@/data/type/sayang/sample";
import { Button } from "antd";
import { useState } from "react";

interface Props {
  board: boardType[];
}

const ArrayContents: React.FC<Props> = ({
  board,
}) => {
  // 원판 수율 팝업
  const [yieldPopOpen, setYieldPopOpen] = useState<boolean>(false);

  const [yielddata, setYielddata] = useState<yieldInputType | null>(null);
  const [disk, setDisk] = useState<{id:string; diskWidth:number; diskHeight:number;}[]>([]);

  return (
    <div className="w-full flex flex-col gap-20">
      <div className="v-between-h-center">
        <TitleIcon
          title="배열 도면"
          icon={<ArrayIcon />}
        />
        <Button
          className="h-32 rounded-6"
          style={{color:"#444444E0"}}
          onClick={() => {
            setYieldPopOpen(true);
          }}
        >
          수율 계산
        </Button>
      </div>

      <div className="w-full h-[310px] flex flex-col gap-30 items-center">
        <div className="h-[111px] border-1 border-line flex w-full">
          <div className="flex-grow-[1] h-[110px] border-r-1 border-line">
            <div className="h-55 flex">
              <div className="w-60 text-12 bg-back v-h-center p-5">{'① 배열'}</div>
              <div className="w-70 text-12 h-center p-5">{'2 x 3'}</div>
            </div>
            <div className="h-55 border-t-1 border-b-1 border-line flex">
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
            <div className="h-36 border-t-1 border-b-1 border-line flex">
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

      <AntdModal
        open={yieldPopOpen}
        setOpen={setYieldPopOpen}
        width={1540}
        title="원판수율계산"
        contents={
        <YieldCalculate
          board={board}
          yielddata={yielddata}
          setYielddata={setYielddata}
          disk={disk}
          setDisk={setDisk}
        />}
        onClose={()=>{
          setYieldPopOpen(false);
          setYielddata(null);
          setDisk([]);
        }}
      />
    </div>
  )
}

export default ArrayContents;