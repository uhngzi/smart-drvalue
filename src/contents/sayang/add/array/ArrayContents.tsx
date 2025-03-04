import ArrayIcon from "@/assets/svg/icons/array.svg";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSelect from "@/components/Select/AntdSelect";
import TitleIcon from "@/components/Text/TitleIcon";
import { boardType } from "@/data/type/base/board";
import { arrayCalType, specType, yieldInputType } from "@/data/type/sayang/sample";
import { Button } from "antd";
import { SetStateAction, useEffect, useState } from "react";
import SayangYieldCalculate from "./YieldCalculate";
import { changeSayangTemp } from "@/data/type/sayang/changeData";

interface Props {
  board: boardType[];
  handleSumbitTemp: () => void;
  refetch: () => void;
  detailData: specType;
  setDetailData: React.Dispatch<SetStateAction<specType>>;
}

const ArrayContents: React.FC<Props> = ({
  board,
  handleSumbitTemp,
  refetch,
  detailData,
  setDetailData,
}) => {
  // 원판 수율 팝업
  const [yieldPopOpen, setYieldPopOpen] = useState<boolean>(false);

  const [yielddata, setYielddata] = useState<yieldInputType | null>(null);
  const [disk, setDisk] = useState<{id:string; diskWidth:number; diskHeight:number;}[]>([]);

  const [kit, setKit] = useState<{id:string, x:number, y:number, cnt:number}[]>([{id:"new-0", x:0, y:0, cnt:1}]);
  const [resultData, setResultData] = useState<arrayCalType[]>([]);
  const [selectData, setSelectData] = useState<arrayCalType>();

  const [specBoard, setSpecBoard] = useState<boardType>();

  useEffect(()=>{
    if(selectData?.board.boardId && selectData?.yieldBoard) {
      const bd = board.find(f=>f.id === selectData?.board.boardId);
      console.log(bd, selectData.yieldBoard);
      setDetailData({
        ...detailData,
        board: { id: selectData?.board.boardId },
        brdArrYldRate: Math.floor(Number(selectData?.yieldBoard) * 100) / 100,
        wksizeW: selectData?.finalWidth,
        wksizeH: selectData?.finalHeight,
        stdW: selectData?.stdInfo?.x,
        stdH: selectData?.stdInfo?.y,
        brdArrStorageKey: selectData?.boardImageStorageName,
        cutCnt: selectData?.panelsPerBoard,
        jYn: bd?.brdType === "J" || bd?.brdType === "AJ",
      })
    }
  }, [selectData])

  useEffect(()=>{
    if(detailData?.board?.id && detailData?.brdArrYldRate) {
      handleSumbitTemp();
      const bd = board.find(f=>f.id === detailData.board?.id);
      setSpecBoard(bd);
    }
  }, [detailData.board])

  useEffect(()=>{
    if(!yieldPopOpen) {
      setKit([{id:"new-0", x:0, y:0, cnt: 1}]);
      setResultData([]);
    }
  }, [yieldPopOpen])

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
          배열도면선택
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
                  <p>{specBoard?.brdDesc}</p>
                  <p>{specBoard?.brdType}</p>
                </div>
                <div className="w-full h-[50%] v-between-h-center border-t-1 border-line p-5">
                  <p>{specBoard?.brdH && specBoard?.brdW && specBoard?.brdW+' x '+specBoard?.brdH}</p>
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
        width={960}
        title="원판수율계산"
        contents={
        <SayangYieldCalculate
          board={board}
          yielddata={yielddata}
          setYielddata={setYielddata}
          disk={disk}
          setDisk={setDisk}
          kit={kit}
          setKit={setKit}
          resultData={resultData}
          setResultData={setResultData}
          selectData={selectData}
          setSelectData={setSelectData}
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