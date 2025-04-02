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
  view: string | string[] | undefined;
}

const ArrayContents: React.FC<Props> = ({
  board,
  handleSumbitTemp,
  detailData,
  setDetailData,
  view,
}) => {
  // 원판 수율 팝업
  const [yieldPopOpen, setYieldPopOpen] = useState<boolean>(false);

  const [yielddata, setYielddata] = useState<yieldInputType | null>(null);
  const [disk, setDisk] = useState<{id:string; diskWidth:number; diskHeight:number;}[]>([]);

  const [kit, setKit] = useState<{id:string, x:number, y:number, cnt:number, impedanceLineCnt: number}[]>([{id:"new-0", x:0, y:0, cnt:1, impedanceLineCnt: 0}]);
  const [resultData, setResultData] = useState<arrayCalType[]>([]);
  const [selectData, setSelectData] = useState<arrayCalType>();

  const [specBoard, setSpecBoard] = useState<boardType>();

  useEffect(()=>{
    if(selectData?.board.boardId && selectData?.yieldBoard) {
      const bd = board.find(f=>f.id === selectData?.board.boardId);
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
        cnt: item.pcsValue ?? 1,
        impedanceLineCnt: item.impedanceLineCnt ?? 0,
      })));
      const layer = Number(detailData.specModels[0]?.layerEm?.replace("L", "") ?? 0);
      const side = layer <= 2 ? 20 : layer === 4 ? 30 : layer === 6 ? 35 : layer === 8 ? 40 : layer >= 10 ? 50 : 0
      setYielddata({kitGapX:5.0, kitGapY: 5.0, minWidth: 200, minHeight: 200, marginLongSide: side, marginShortSide: side});
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
        { !view &&
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
        </Button>}
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
                  <AntdSelect
                    value={detailData.couponYn}
                    onChange={(e)=>{
                      const value = e ? true : false;
                      setDetailData({
                        ...detailData,
                        couponYn: value,
                      })
                    }}
                    options={[{value:true,label:'유'},{value:false,label:'무'}]} styles={{bw:'0',pd:'0'}}
                  />
                </div>
              </div>
            </div>

            <div className="w-full !h-1/2">
              {!detailData.cutCnt && <Empty className="pt-5" />}
              {detailData.cutCnt && <>
                <div className="h-36 border-1 border-line flex border-b-0">
                  <p className="w-65 h-full bg-back v-h-center p-5">등분수</p>
                  <div className="h-center flex-1 text-left p-5">
                    {detailData.cutCnt && detailData.cutCnt}{detailData.jYn && "/J"}
                  </div>
                </div>
                <div className="flex">
                  <div className="h-36 border-1 border-line flex border-b-0 border-r-0 w-1/2">
                    <p className="w-65 h-full bg-back v-h-center p-5">간격(XY)</p>
                    <div className="h-center flex-1 text-left p-5">
                      {detailData.kitGapX && detailData.kitGapY && detailData.kitGapX+" | "+detailData.kitGapY}
                    </div>
                  </div>
                  <div className="h-36 border-1 border-line flex border-b-0 w-1/2">
                    <p className="w-65 h-full bg-back v-h-center p-5">규격</p>
                    <div className="h-center flex-1 text-left p-5">
                      {detailData.stdW && detailData.stdH && detailData.stdW+" X "+detailData.stdH}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="h-36 border-1 border-line flex border-r-0 w-1/2">
                    <p className="w-65 h-full bg-back v-h-center p-5">W/S</p>
                    <div className="h-center flex-1 text-left p-5">
                      {detailData.wksizeW && detailData.wksizeH && detailData.wksizeW+" X "+detailData.wksizeH}
                    </div>
                  </div>
                  <div className="h-36 border-1 border-line flex w-1/2">
                    <p className="w-65 h-full bg-back v-h-center p-5">T/S</p>
                    <div className="h-center flex-1 text-left p-5">
                      { detailData.wksizeW && detailData.wksizeH && (detailData.wksizeW - 4)+" X "+(detailData.wksizeH - 4)}
                    </div>
                  </div>
                </div>
              </>}
            </div>
          </div>
        </>}
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