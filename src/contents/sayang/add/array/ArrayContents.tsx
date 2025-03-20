import ArrayIcon from "@/assets/svg/icons/array.svg";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSelect from "@/components/Select/AntdSelect";
import TitleIcon from "@/components/Text/TitleIcon";
import { boardType } from "@/data/type/base/board";
import { arrayCalType, specType, yieldInputType } from "@/data/type/sayang/sample";
import { Button, Empty } from "antd";
import { SetStateAction, useEffect, useState } from "react";
import SayangYieldCalculate from "./YieldCalculate";
import Memo from '@/assets/svg/icons/memo.svg';
import Image from "next/image";
import { baseURL } from "@/api/lib/config";
import { Popup } from "@/layouts/Body/Popup";
import { ZoomInOutlined } from "@ant-design/icons";

interface Props {
  board: boardType[];
  handleSumbitTemp: () => void;
  detailData: specType;
  setDetailData: React.Dispatch<SetStateAction<specType>>;
}

const ArrayContents: React.FC<Props> = ({
  board,
  handleSumbitTemp,
  detailData,
  setDetailData,
}) => {
  // 원판 수율 팝업
  const [yieldPopOpen, setYieldPopOpen] = useState<boolean>(false);

  const [yielddata, setYielddata] = useState<yieldInputType | null>(null);
  const [disk, setDisk] = useState<{id:string; diskWidth:number; diskHeight:number;}[]>([]);

  const [kit, setKit] = useState<{id:string, x:number, y:number, minX: number, minY:number, cnt:number}[]>([{id:"new-0", x:0, y:0, minX:0, minY:0, cnt:1}]);
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
        brdArrStorageKey: selectData?.panelImageStorageName,
        cutCnt: selectData?.panelsPerBoard,
        jYn: bd?.brdType === "J" || bd?.brdType === "AJ",
        kitGapX: Number(yielddata?.kitGapX ?? 0),
        kitGapY: Number(yielddata?.kitGapY ?? 0),
        specModels: detailData.specModels?.map((item) => ({
          ...item,
          prdCnt: selectData.requiredPanels
        }))
      });
      
      setTimeout(()=>handleSumbitTemp(), 30);
    }
  }, [selectData])

  useEffect(()=>{
    if(detailData?.board?.id) {
      const bd = board.find(f=>f.id === detailData.board?.id);
      setSpecBoard(bd);
    }
  }, [detailData.board])

  useEffect(()=>{
    if(!yieldPopOpen && detailData.specModels && detailData.specModels?.length > 0) {
      setKit(detailData.specModels?.map((item, index) => ({
        id: "kit-"+index,
        x: item.kitW ?? 0,
        y: item.kitL ?? 0,
        minX: 0,
        minY: 0,
        cnt: item.pcsCnt ?? 1,
      })));
      const layer = Number(detailData.specModels[0]?.layerEm?.replace("L", "") ?? 0);
      const side = layer <= 2 ? 20 : layer === 4 ? 30 : layer === 6 ? 35 : layer === 8 ? 40 : layer >= 10 ? 50 : 0
      setYielddata({kitGapX:5.0, kitGapY: 5.0, marginLongSide: side, marginShortSide: side});
      setResultData([]);
    }
  }, [yieldPopOpen, detailData])

  const [lgOpen, setLgOpen] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col gap-20">
      <div className="v-between-h-center">
        <TitleIcon
          title="배열 도면"
          icon={<ArrayIcon />}
        />
        <Button
          className="h-32 rounded-6"
          onClick={() => {
            setYieldPopOpen(true);
          }}
        >
          <p className="w-16 h-16">
            <Memo/>
          </p>
          선택
        </Button>
      </div>

      <div className="w-full h-[310px] flex gap-20">
        { !detailData?.brdArrStorageKey && <div className="w-full h-full v-h-center"><Empty /></div>}
        { detailData?.brdArrStorageKey && <>
          <div className="!w-1/2 !min-w-[200px] h-full">
            <section
              className="relative group !min-w-[200px] !w-full h-[300px] cursor-zoom-in"
              onClick={()=>setLgOpen(true)}
            >
              <Image
                src={`${baseURL}file-mng/v1/every/file-manager/download/${detailData.brdArrStorageKey}`}
                alt="배열 도면 이미지"
                layout="fill"
                objectFit="contain"
              />
              {/* 오버레이: 기본 투명, hover 시 어둡게 */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              {/* 돋보기 아이콘: 기본 숨김, hover 시 중앙에 나타남 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomInOutlined style={{fontSize:'30px'}}/>
              </div>
            </section>
          </div>
          <div className="!w-1/2 flex flex-col">
            <div className="!h-1/2">
              <div className="h-74 h-center border-1 border-line border-b-0 flex">
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

              <div className="h-36 border-1 border-line flex">
                <p className="w-65 bg-back v-h-center p-5">쿠폰</p>
                <div className="flex-grow-[12] h-full v-h-center">
                  <AntdSelect options={[{value:1,label:'유'},{value:2,label:'무'}]} styles={{bw:'0',pd:'0'}} />
                </div>
              </div>
            </div>

            <div className="w-full !h-1/2 border-1 border-line bg-back rounded-14">
              {!detailData.cutCnt && <Empty className="pt-5" />}
              {detailData.cutCnt && <>
                <p className="text-16 font-medium h-40 v-h-center">{detailData.cutCnt && detailData.cutCnt+"등분"}{detailData.jYn && "/J"}</p>
                <div className="h-100 flex flex-col text-12 font-medium gap-5 h-center">
                  <p className="h-center h-20 w-[160px]">간격(XY) :{detailData.kitGapX && detailData.kitGapY && detailData.kitGapX+" | "+detailData.kitGapY}</p>
                  <p className="h-center h-20 w-[160px]">규격 : {detailData.stdW && detailData.stdH && detailData.stdW+" X "+detailData.stdH}</p>
                  <p className="h-center h-20 w-[160px]">W/S : {detailData.wksizeW && detailData.wksizeH && detailData.wksizeW+" X "+detailData.wksizeH}</p>
                  <p className="h-center h-20 w-[160px]">Trimmimg size : {detailData.wksizeW && detailData.wksizeH && (detailData.wksizeW - 4)+" X "+(detailData.wksizeH - 4)}</p>
                </div>
              </>}
            </div>
          </div>
        </>}
        {/* <div className="h-[111px] border-1 border-line border-b-0 flex w-full">
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
        </div> */}
        {/* <div className="w-[350px] h-[170px] mx-25 py-6 flex flex-col gap-3">
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
        </div> */}
      </div>

      <AntdModal
        open={yieldPopOpen}
        setOpen={setYieldPopOpen}
        width={960}
        title="배열 도면 계산 및 선택"
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
          detailData={detailData}
          selectData={selectData}
          setSelectData={setSelectData}
        />}
        onClose={()=>{
          setYieldPopOpen(false);
          setYielddata(null);
          setDisk([]);
        }}
      />

      <AntdModal
        open={lgOpen}
        setOpen={setLgOpen}
        title={"확대 이미지"}
        width={1000}
        contents={
          <Popup className="w-full">
            <section className="relative w-[900px] min-h-[70vh]">
              <Image
                src={`${baseURL}file-mng/v1/every/file-manager/download/${detailData.brdArrStorageKey}`}
                alt="배열 도면 이미지"
                layout="fill"
                objectFit="contain" // 🔹 이미지 비율 유지하면서 부모 영역에 맞춤
              />
            </section>
          </Popup>
        }
      />
    </div>
  )
}

export default ArrayContents;