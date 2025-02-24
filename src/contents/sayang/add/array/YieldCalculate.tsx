// 원판 수율 검사라는 팝업이 여기저기서 쓰인다고 하셔서 따로 만들었습니다.

// make typescript react component

import { Button, Checkbox, Dropdown, Radio, Space, Spin } from 'antd';
import React, { SetStateAction, useEffect, useState } from 'react';

import Calculate from "@/assets/svg/icons/calculate.svg";
import Print from "@/assets/svg/icons/print.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import Down from "@/assets/svg/icons/s_drop_down.svg";
import Right from "@/assets/svg/icons/s_drop_right.svg";
import AntdInput from '@/components/Input/AntdInput';
import AntdTable from '@/components/List/AntdTable';
import { yieldCalType, yieldInputReq, yieldInputType } from '@/data/type/sayang/sample';
import { postAPI } from '@/api/post';
import useToast from '@/utils/useToast';
import { validReq } from '@/utils/valid';
import { boardType } from '@/data/type/base/board';
import Image from 'next/image';
import { baseURL } from '@/api/lib/config';
import Edit from "@/assets/svg/icons/edit.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import Plus from "@/assets/svg/icons/s_plus.svg";
import Check from "@/assets/svg/icons/s_check.svg";


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
  kit: {id:string, x:number, y:number}[];
  setKit: React.Dispatch<SetStateAction<{id:string, x:number, y:number}[]>>;
}


const SayangYieldCalculate: React.FC<Props> = ({
  board,
  yielddata,
  setYielddata,
  disk,
  setDisk,
  kit,
  setKit,
}) => {
  const { showToast, ToastContainer } = useToast();

  const [yieldTableData, setYieldTableData] = useState<yieldCalType[]>([]);

  const [boardData, setBoardData] = useState<boardType[]>([]);

  const [calChk, setCalChk] = useState<boolean>(false);

  useEffect(()=>{
    if(board.length > 0) {
      setBoardData(board);
    }
  }, [board]);

  useEffect(()=>{
    if(yielddata === null) {
      setYieldTableData([]);
      setCalChk(false);
    }
  }, [yielddata]);

  const [calLoading, setCalLoading] = useState<boolean>(false);

  const items = [
    {value:yielddata?.minPanelLength, name:'minPanelLength', label:'판넬 최저 길이', type:'input', widthType:'full'},
    {value:yielddata?.minYield, name:'minYield', label:'최저 수율', type:'input', widthType:'full'},
    {value:yielddata?.kitGapX, name:'kitGapX', label:'Kit긴쪽간격', type:'input', widthType:'full'},
    {value:yielddata?.kitGapY, name:'kitGapY', label:'Kit짧은쪽간격', type:'input', widthType:'full'},
    {value:yielddata?.marginLongSide, name:'marginLongSide', label:'판넬긴쪽여분', type:'input', widthType:'full'},
    {value:yielddata?.marginShortSide, name:'marginShortSide', label:'판넬짧은쪽여분', type:'input', widthType:'full'},
    // {value:yielddata?.kitWidth, name:'kitWidth', label:'Kit긴쪽길이', type:'input', widthType:'full'},
    // {value:yielddata?.kitHeight, name:'kitHeight', label:'Kit짧은쪽길이', type:'input', widthType:'full'},
    {value:yielddata?.kitArrangeX, name:'kitArrangeX', label:'Kit 배치 X', type:'input', widthType:'full'},
    {value:yielddata?.kitArrangeY, name:'kitArrangeY', label:'Kit 배치 Y', type:'input', widthType:'full'},
  ]

  const handleCheckboxChange = (id:string, w: number, h: number) => {
    setDisk([ ...disk.filter(f=>f.id !== id), {id:id, diskWidth:w, diskHeight:h} ]);
  };

  const handleCalculdate = async () => {
    try {
      if(disk.length < 1) {
        showToast("원판을 선택해주세요.", "error");
        return;
      }

      const val = validReq(yielddata, yieldInputReq());
      if(!val.isValid) {
        showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
        return;
      } 

      const jsonData = { ...yielddata, disks:disk.map(d=>({diskWidth:d.diskWidth,diskHeight:d.diskHeight})) };
      console.log(JSON.stringify(jsonData));

      setCalLoading(true);
      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        jsx: 'default',
        url:'board-yield-calc/default/calculate/auto/multi-board',
        etc: true,
      }, jsonData);
  
      if(result.resultCode === "OK_0000") {
        const rdata = (result.data ?? []) as yieldCalType[];
        setYieldTableData(rdata);
        setCalLoading(false);
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
        setCalLoading(false);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  function calculdate(){
    handleCalculdate();
    setCalChk(true);
  }

  return (
    <section className='flex gap-10 w-full flex-col'>
      <div className="w-full flex flex-col">
        <div className={`w-full h-46 bg-[#FAFAFA] py-12 px-16 border-1 border-line h-center gap-12 ${!calChk ? 'rounded-t-14' : 'rounded-8'}`}>
          <p
            className="w-16 h-16 cursor-pointer"
            onClick={()=>setCalChk(!calChk)}
          >
            { calChk ? <Right /> : <Down />}
          </p>
          배열 도면 계산하기
        </div>
        { !calChk &&
        <div className="w-full h-[550px] bg-white p-20 rounded-b-14 border-1 border-line border-t-0 flex flex-col gap-10">
          <div className="w-full h-[465px] h-center gap-30">
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
                        if(item.name === "minYield" && Number(value ?? 0) > 100) {
                          setYielddata({
                            ...yielddata,
                            [item.name]: 100,
                          });
                          return;
                        }

                        setYielddata({
                          ...yielddata,
                          [item.name]: value,
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 h-full overflow-y-auto flex flex-col gap-15">
              {
                kit.map((item, index) => (
                  <div
                    key={item.id}
                    className="w-full h-[145px] px-10 pt-10 flex flex-col gap-10 bg-[#FAFAFA] bg-opacity-65 rounded-14"
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
                            setKit([ ...kit, {id:"new-"+(kit.length+1), x:0, y:0} ])
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
                            <div className="w-24 h-24 cursor-pointer v-h-center bg-[#E9EDF5]">
                              <p className="w-16 h-16"><Edit/></p>
                            </div>
                          </Space>
                        </a>
                      </Dropdown>
                    </div>
                    <div className="v-h-center gap-15">
                      <div>
                        <p className='pb-8'>Kit긴쪽길이</p>
                        <div className="h-center gap-10 w-[145px]">
                          <AntdInput 
                            // value={item.x}
                            type="number"
                            onChange={(e)=>{
                              let { value } = e.target;
                              setYielddata({
                                ...yielddata,
                                kitWidth: Number(value),
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className='pb-8'>Kit짧은쪽길이</p>
                        <div className="h-center gap-10 w-[145px]">
                          <AntdInput 
                            // value={item.x}
                            type="number"
                            onChange={(e)=>{
                              let { value } = e.target;
                              setYielddata({
                                ...yielddata,
                                kitHeight: Number(value),
                              });
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
          columns={[
            {
              title: '원판',
              dataIndex: 'stencil',
              key: 'stencil',
              align: 'center',
              children: [
                {
                  title: '가로 x 세로',
                  dataIndex: 'diskWidth',
                  key: 'diskWidth',
                  width: 120,
                  align: 'center',
                  render: (_, record:yieldCalType) => {
                    return (record.disk?.diskWidth ?? "") + ' x ' + (record.disk?.diskHeight ?? "");
                  }
                },
              ],
            },
            {
              title: '판넬',
              dataIndex: 'panel',
              key: 'panel',
              align: 'center',
              children: [
                { title: 'X . Y',
                  dataIndex: 'panel.arrangeX',
                  key: 'panel.arrangeX',
                  width: 50,
                  align: 'center',
                  render: (_, record:yieldCalType) => {
                    return Math.floor(Number(record.panel?.arrangeX ?? 0)) + ' . ' + Math.floor(Number(record.panel?.arrangeY ?? 0));
                  }
                },
                { title: '가로 x 세로',
                  dataIndex: 'panel.width',
                  key: 'panel.width',
                  width: 120,
                  align: 'center',
                  render: (_, record:yieldCalType) => {
                    return Math.floor(Number(record.panel?.width ?? 0)) + ' x ' +  Math.floor(Number(record.panel?.height ?? 0));
                  }
                },
                { title: '개수',
                  dataIndex: 'panelCount',
                  key: 'panelCount',
                  width: 50,
                  align: 'center',
                  render: (_, record:yieldCalType) => {
                    return Math.floor(Number(record.panelCount ?? 0));
                  }
                },
                {
                  title: '수량',
                  dataIndex: 'kitCount',
                  key: 'kitCount',
                  width: 80,
                  align: 'center',
                  render: (_, record:yieldCalType) => {
                    return Math.floor(Number(record.kitCount ?? 0));
                  }
                },
              ],
            },
            {
              title: '계산결과',
              dataIndex: 'remark',
              key: 'remark',
              align: 'center',
              children: [
                {
                  title: '수율',
                  dataIndex: 'layout.yieldRatio',
                  key: 'layout.yieldRatio',
                  width: 100,
                  align: 'center',
                  render: (_, record:yieldCalType) => {
                    return Math.floor(Number(record.layout?.yieldRatio ?? 0) * 100) / 100;
                  }
                },
              ],
            },
          ]}
          data={yieldTableData}
          loading={calLoading}
          styles={{ th_bg: '#EEEEEE', td_bg: '#FFF', td_ht: '40px', th_ht: '40px', round: '0px', th_pd: '0' }}
        />
      </div>
        
      <section className='flex flex-col gap-10 w-full min-h-[300px]'>
        <div className="relative flex flex-wrap gap-30 w-full p-30 bg-white rounded-14 border border-[#D9D9D9]" style={{ flex: 1 }}>
          {yieldTableData.length > 0 && yieldTableData
            .map((data, rowIndex) => (
              <div key={rowIndex} className="w-full flex flex-col gap-20">
                <div className="flex w-full min-h-100 gap-30">
                  <section className="relative" style={{ flex: 1.5 }}>
                    <Image
                      src={`${baseURL}file-mng/v1/every/file-manager/download/${data.images?.layout}`}
                      alt=""
                      layout="fill" // 🔹 부모 크기에 맞춤
                      objectFit="contain" // 🔹 이미지 비율 유지하면서 부모 영역에 맞춤
                    />
                  </section>
                  <section className="relative" style={{ flex: 1 }}>
                    <Image
                      src={`${baseURL}file-mng/v1/every/file-manager/download/${data.images?.panel}`}
                      alt=""
                      layout="fill" // 🔹 부모 크기에 맞춤
                      objectFit="contain" // 🔹 이미지 비율 유지하면서 부모 영역에 맞춤
                    />
                  </section>
                </div>
                <div className="w-full h-center justify-end">
                  <Button type="primary" className="flex h-center" onClick={calculdate}>
                    <span className='w-16 h-16'><Check/></span>
                    <span>선택</span>
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </section>
      <ToastContainer/>
    </section>
  );
};

export default SayangYieldCalculate;