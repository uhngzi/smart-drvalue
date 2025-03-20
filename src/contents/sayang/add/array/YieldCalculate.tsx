import Image from 'next/image';
import { Button, Checkbox, Dropdown, Space, Spin } from 'antd';
import React, { SetStateAction, useEffect, useState } from 'react';
import { baseURL } from '@/api/lib/config';
import { ColumnsType } from 'antd/es/table';
import { AnyObject } from 'antd/es/_util/type';
import { postAPI } from '@/api/post';

import Calculate from "@/assets/svg/icons/calculate.svg";
import Edit from "@/assets/svg/icons/edit.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import Plus from "@/assets/svg/icons/s_plus.svg";
import Check from "@/assets/svg/icons/s_check.svg";
import Down from "@/assets/svg/icons/s_drop_down.svg";
import Right from "@/assets/svg/icons/s_drop_right.svg";
import Hint from "@/assets/svg/icons/s_excalm.svg";

import AntdInput from '@/components/Input/AntdInput';
import AntdTable from '@/components/List/AntdTable';
import AntdAlertModal from '@/components/Modal/AntdAlertModal';
import { IconButton } from '@/components/Button/IconButton';

import { arrayCalType, specType, yieldInputType } from '@/data/type/sayang/sample';
import { boardType } from '@/data/type/base/board';

import useToast from '@/utils/useToast';
import { get } from 'lodash';

interface Props {
  board: boardType[];
  yielddata: yieldInputType | null;
  setYielddata: React.Dispatch<SetStateAction<yieldInputType | null>>;
  disk: {
    id:string;
    diskWidth:number;
    diskHeight:number;
  }[];
  setDisk: React.Dispatch<SetStateAction<{
    id:string;
    diskWidth:number;
    diskHeight:number;
  }[]>>;
  kit: {id:string, x:number, y:number, minX:number, minY:number, cnt:number}[];
  setKit: React.Dispatch<SetStateAction<{id:string, x:number, y:number, minX:number, minY:number, cnt:number}[]>>;
  resultData: arrayCalType[];
  setResultData: React.Dispatch<SetStateAction<arrayCalType[]>>;
  detailData: specType;
  selectData?: arrayCalType;
  setSelectData?: React.Dispatch<SetStateAction<arrayCalType | undefined>>;
}


const SayangYieldCalculate: React.FC<Props> = ({
  board,
  yielddata,
  setYielddata,
  disk,
  setDisk,
  kit,
  setKit,
  resultData,
  setResultData,
  detailData,
  setSelectData,
}) => {
  const { showToast, ToastContainer } = useToast();

  const [boardData, setBoardData] = useState<boardType[]>([]);

  const [calChk, setCalChk] = useState<boolean>(false);
  const [calLoading, setCalLoading] = useState<boolean>(false);

  const [selectCalRowId, setSelectCalRowId] = useState<string | null>(null);

  useEffect(()=>{
    if(board.length > 0) {
      setBoardData(board);
    }
  }, [board]);

  useEffect(()=>{
    if(resultData.length < 1) {
      setCalLoading(false);
      setCalChk(false);
      setSelectCalRowId(null);
    }
  }, [resultData]);


  const items = [
    {value:yielddata?.kitGapX, name:'kitGapX', label:'Kit긴쪽간격', type:'input', widthType:'full'},
    {value:yielddata?.kitGapY, name:'kitGapY', label:'Kit짧은쪽간격', type:'input', widthType:'full'},
    {value:yielddata?.marginLongSide, name:'marginLongSide', label:'판넬긴쪽여분', type:'input', widthType:'full'},
    {value:yielddata?.marginShortSide, name:'marginShortSide', label:'판넬짧은쪽여분', type:'input', widthType:'full'},
  ]

  const handleCheckboxChange = (id:string, w: number, h: number) => {
    setDisk([ ...disk.filter(f=>f.id !== id), {id:id, diskWidth:w, diskHeight:h} ]);
  };

  const handleCalculdate = async () => {
    try {
      setCalLoading(true);

      const jsonData = { 
        extraMargin: 0,
        boards:disk.map(board=>({boardId:board.id,width:board.diskWidth,height:board.diskHeight})),
        kits: kit.map((kit, index)=>({kitId:kit.id, width:kit.x, height:kit.y,
          // minWidth:kit.minX, minHeight:kit.minY,
          targetCount: kit.cnt})),
        panelSpacing: {
          horizontalPadding: yielddata?.marginLongSide,
          verticalPadding: yielddata?.marginShortSide,
        },
        kitSpacing: {
          horizontalSpacing: yielddata?.kitGapX,
          verticalSpacing: yielddata?.kitGapY,
          sharingLineSpacing: yielddata?.kitGapY,
        },
     };
      console.log(JSON.stringify(jsonData));

      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        jsx: 'default',
        url:'spec/board-array-calc/default/calculate',
        etc: true,
      }, jsonData);
      
      if(result.resultCode === "OK_0000") {
        const rdata = (result.data ?? []) as arrayCalType[];
        setResultData(rdata.map(((r, index) => ({
          id: index+"",
          ...r,
        }))));
        setCalLoading(false);
        setCalChk(true);
      } else {
        const msg = result?.response?.data?.message;
        setErrMsg(msg);
        setAlertType("error");
        setAlertOpen(true);
        setCalLoading(false);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  function calculdate(){
    if(disk.length < 1) {
      showToast("원판을 선택해주세요.", "error");
      return;
    }

    handleCalculdate();
  }

  const handleDataChange = (
    id: string,
    name: string,
    value: any
  ) => {
    // 데이터를 복사
    const updatedData = kit.map((item) => {
      if (item.id === id) {
        const keys = name.split(".");
        const updatedItem = { ...item };
  
        // 마지막 키를 제외한 객체 탐색
        const lastKey = keys.pop()!;
        let targetObject: any = updatedItem;
  
        keys.forEach((key) => {
          // 중간 키가 없거나 null인 경우 초기화
          if (!targetObject[key] || typeof targetObject[key] !== "object") {
            targetObject[key] = {};
          }
          targetObject = targetObject[key];
        });
  
        // 최종 키에 새 값 할당
        targetObject[lastKey] = value;
  
        return updatedItem;
      }
      return item; // 다른 데이터는 그대로 유지
    });

    setKit(updatedData); // 상태 업데이트
  }; 

  // 1) 최대 kit 개수 계산
  const maxKitCount = Math.max(...resultData.map((row) => row.kitsInfo.length), 0);

  const kitColumns = Array.from({ length: maxKitCount }, (_, i) => ({
    title: `Kit${i + 1}`,
    children: [
      {
        title: 'X.Y',
        dataIndex: ['kitsInfo', i], 
        key: `xy-${i}`,
        width: 30,
        align: 'center' as const,
        render: (val: any) => {
          if (!val) return null; 
          return `${val.rows} . ${val.cols}`;
        }
      },
      {
        title: '가로 x 세로',
        dataIndex: ['kitsInfo', i],
        key: `size-${i}`,
        width: 50,
        align: 'center' as const,
        render: (val: any) => {
          if (!val) return null;
          return `${val.kitArrayXSize} x ${val.kitArrayYSize}`;
        }
      },
      {
        title: '개수',
        dataIndex: ['kitsInfo', i],
        key: `count-${i}`,
        width: 30,
        align: 'center' as const,
        render: (val: any) => {
          if (!val) return null;
          return val.totalCount;
        }
      }
    ]
  }));

  // 3) 최종 columns
  const columns: ColumnsType<AnyObject> = [
    {
      title: '등분',
      width: 20,
      dataIndex: 'panelsPerBoard',
      key: 'panelsPerBoard',
      render: (value) => (
        <div className="w-full v-h-center">
          {value}
        </div>
      )
    },
    {
      title: '원판',
      children: [
        {
          title: '가로 x 세로',
          dataIndex: 'board',
          key: 'boardSize',
          width: 50,
          align: 'center',
          render: (board) => {
            if (!board) return null;
            return `${board.width} x ${board.height}`;
          },
        },
      ],
    },
    {
      title: '판넬',
      children: [
        ...kitColumns,
        {
          title: '수량',
          dataIndex: 'requiredPanels',
          key: 'requiredPanels',
          width: 50,
          align: 'center',
        },
      ],
    },
  ];

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"error" | "">("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [hint, setHint] = useState<{flag:boolean, name: string, msg:string}>({flag: false, name: "", msg: ""});

  return (
    <section className='flex gap-10 w-full flex-col'>
      <div className="w-full flex flex-col">
        <div 
          className={`w-full h-46 bg-[#FAFAFA] py-12 px-16 border-1 border-line h-center gap-12 cursor-pointer ${!calChk ? 'rounded-t-14' : 'rounded-8'}`}
          onClick={()=>setCalChk(!calChk)}
        >
          <p
            className="w-16 h-16 cursor-pointer"
          >
            { calChk ? <Right /> : <Down />}
          </p>
          배열 도면 계산하기
        </div>
        { !calChk &&
        <div className="w-full h-[500px] bg-white p-20 rounded-b-14 border-1 border-line border-t-0 flex flex-col gap-30">
          <div className="w-full h-[390px] h-center gap-30">
            <div className="w-[300px] h-full flex flex-col gap-10">
              <p className="pl-10">원판 선택</p>
              <div className="flex-1 overflow-y-auto">
                { boardData.map((item:boardType) => (
                  <div
                    key={item.id}
                    className="w-full h-40 border-b-1 border-bdDefault h-center text-black text-opacity-65"
                  >
                    <p className="w-50 h-full v-h-center">
                      <Checkbox
                        name="board"
                        onChange={(e) => {
                          if(e.target.checked)
                            handleCheckboxChange(item.id ?? "", item.brdW, item.brdH);
                          else 
                            setDisk(disk.filter(f=>f.id !== item.id));
                        }}
                      />
                    </p>
                    <p className="w-[105px] h-full h-center">
                      {item.brdW}
                      {' '} x {' '}
                      {item.brdH}
                    </p>
                    <p className="h-full h-center">
                      {item.brdType}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[210px] px-10 h-full flex flex-col gap-20 overflow-y-auto">
              {items.map((item, idx) => (
                <div key={idx}>
                  <p className='pb-8'>{item.label}</p>
                  <div className="h-center gap-10" >
                    <AntdInput 
                      value={item.value ?? undefined}
                      type="number"
                      onChange={(e)=>{
                        let { value } = e.target;
                        if(item.name.includes("Side") && detailData.specModels && detailData.specModels?.length > 0) {
                          const layer = Number(detailData.specModels[0]?.layerEm?.replace("L", "") ?? 0);
                          const min = Number(layer <= 2 ? 16 : layer === 4 ? 26 : (layer === 6 || layer === 8 || layer >= 10) ? 30 : 0);
                          const other = item.name === "marginLongSide" ? yielddata?.marginShortSide : yielddata?.marginLongSide;
                          console.log(other);
                          
                          if((layer === 6 || layer === 8 || layer >= 10)) {
                            if(Number(other) < 30 && Number(value) < 30)
                              setHint({flag: true, name: item.name, msg: layer+"층은 여분 중 적어도 하나는 30 이상이어야 합니다."})
                            else
                              setHint({flag: false, name: item.name, msg: ""})
                          } else {
                            if(Number(value) < min)
                              setHint({flag: true, name: item.name, msg: layer+"층은 여분이 "+min+" 이상이어야 합니다."});
                            else
                              setHint({flag: false, name: item.name, msg: ""})
                          }
                        } else  setHint({flag: false, name: item.name, msg: ""})

                        setYielddata({
                          ...yielddata,
                          [item.name]: value,
                        });
                      }}
                    />
                  </div>
                  { hint.flag && item.name === hint.name && 
                    <div className="text-[red] flex h-center gap-5">
                      <p className="w-16 h-16"><Hint /></p>
                      {hint.msg}
                    </div>
                  }
                </div>
              ))}
            </div>
            <div className="flex-1 h-full overflow-y-auto flex flex-col gap-15">
              {
                kit.map((item, index) => (
                  <div
                    key={item.id}
                    className="w-full h-[200px] px-10 pt-10 flex flex-col gap-10 bg-[#FAFAFA] bg-opacity-65 rounded-14"
                  >
                    <div className="w-full v-between-h-center">
                      <div className="h-center gap-3">
                        KIT
                        <p className="w-15 h-15 border-1 border-black rounded-50 text-11 v-h-center">
                          {index + 1}
                        </p>
                      </div>
                      <Dropdown trigger={['click']} menu={{ items:[
                        {
                          label: <div className="h-center gap-5">
                            <p className="w-16 h-16"><Plus /></p>
                            추가
                          </div>,
                          key: 0,
                          onClick: () => {
                            setKit([ ...kit, {id:"new-"+(kit.length+1), x:0, y:0, minX:0, minY:0, cnt: 1} ])
                          }
                        },
                        {
                          label: <div className="text-[red] h-center gap-5">
                            <p className="w-16 h-16"><Trash /></p>
                            삭제
                          </div>,
                          key: 1,
                          onClick: () => {
                            if(kit.length > 1) {
                              setKit(kit.filter(f=> f.id !== item.id));
                            } 
                          }
                        }
                      ]}}>
                        <a onClick={(e) => e.preventDefault()}>
                          <Space>
                            <IconButton icon={<Edit />} />
                            {/* <div className="w-24 h-24 cursor-pointer v-h-center bg-[#E9EDF5]">
                              <p className="w-16 h-16"><Edit/></p>
                            </div> */}
                          </Space>
                        </a>
                      </Dropdown>
                    </div>
                    <div className="h-center gap-15">
                      <div>
                        <p className='pb-8'>Kit긴쪽길이</p>
                        <div className="h-center gap-10 w-80">
                          <AntdInput 
                            value={item.x}
                            type="number"
                            onChange={(e)=>{
                              let { value } = e.target;
                              handleDataChange(item.id, "x", value);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className='pb-8'>Kit짧은쪽길이</p>
                        <div className="h-center gap-10 w-80">
                          <AntdInput 
                            value={item.y}
                            type="number"
                            onChange={(e)=>{
                              let { value } = e.target;
                              handleDataChange(item.id, "y", value);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className='pb-8'>Kit목표개수</p>
                        <div className="h-center gap-10 w-80">
                          <AntdInput 
                            value={item.cnt}
                            type="number"
                            onChange={(e)=>{
                              let { value } = e.target;
                              handleDataChange(item.id, "cnt", value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="h-center gap-15">
                      <div>
                        <p className='pb-8'>Kit긴쪽최소</p>
                        <div className="h-center gap-10 w-80">
                          <AntdInput 
                            value={item.minX}
                            type="number"
                            onChange={(e)=>{
                              let { value } = e.target;
                              handleDataChange(item.id, "minX", value);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className='pb-8'>Kit짧은쪽최소</p>
                        <div className="h-center gap-10 w-80">
                          <AntdInput 
                            value={item.minY}
                            type="number"
                            onChange={(e)=>{
                              let { value } = e.target;
                              handleDataChange(item.id, "minY", value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="w-full h-32 h-center justify-end">
            <Button type="primary" className="flex h-center" onClick={calculdate}>
              <span className='w-16 h-16'><Calculate/></span>
              <span>계산</span>
            </Button>
          </div>
        </div>}
      </div>

      <div className='w-full p-30 bg-white rounded-14 border border-[#D9D9D9]'>
        <AntdTable
          className='h-full overflow-y-auto'
          columns={columns}
          data={resultData}
          loading={calLoading}
          styles={{ th_bg: '#EEEEEE', td_bg: '#FFF', td_ht: '40px', th_ht: '40px', round: '0px', th_pd: '0' }}
          selectedRowId={selectCalRowId}
          setSelectedRowId={setSelectCalRowId}
        />
      </div>
        
      <section className='flex flex-col gap-10 w-full min-h-[400px]'>
        <div className="relative flex flex-wrap gap-30 w-full p-30 bg-white rounded-14 border border-[#D9D9D9]" style={{ flex: 1 }}>
          { calLoading && <div className="w-full min-h-[400px] h-full v-h-center"><Spin tip="계산중..." /></div>}
          { !calLoading && resultData.length > 0 && !selectCalRowId && selectCalRowId !== "" && 
            <div className="w-full min-h-[400px] h-full v-h-center">계산 결과를 선택하여 이미지를 확인할 수 있습니다.</div>
          }
          { !calLoading && resultData.length > 0 && selectCalRowId && selectCalRowId !== "" &&
            resultData.map((data, rowIndex) => (
              data.id === selectCalRowId &&
              <div key={rowIndex} className="w-full flex flex-col gap-20">
                <div className="flex w-full min-h-[400px] gap-30">
                  <section className="relative" style={{ flex: 1.5 }}>
                    <Image
                      src={`${baseURL}file-mng/v1/every/file-manager/download/${data?.boardImageStorageName}`}
                      alt=""
                      layout="fill" // 🔹 부모 크기에 맞춤
                      objectFit="contain" // 🔹 이미지 비율 유지하면서 부모 영역에 맞춤
                    />
                  </section>
                  <section className="relative" style={{ flex: 1 }}>
                    <Image
                      src={`${baseURL}file-mng/v1/every/file-manager/download/${data?.panelImageStorageName}`}
                      alt=""
                      layout="fill" // 🔹 부모 크기에 맞춤
                      objectFit="contain" // 🔹 이미지 비율 유지하면서 부모 영역에 맞춤
                    />
                  </section>
                </div>
                <div className="w-full h-center justify-end">
                  <Button type="primary" className="flex h-center" onClick={()=>{
                    setSelectData?.(data);
                  }}>
                    <span className='w-16 h-16'><Check/></span>
                    <span>선택</span>
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </section>

      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={
          alertType === "error" ? "오류 발생" :
          ""
        }
        contents={
          alertType === "error" ? <div>{errMsg}</div> :
          <></>
        }
        onOk={()=>{
          setAlertOpen(false);
        }}
        hideCancel={
          alertType === "error"
        }
        type={
          alertType === "error" ? "error" :
          "success"
        }
      />
      <ToastContainer/>
    </section>
  );
};

export default SayangYieldCalculate;