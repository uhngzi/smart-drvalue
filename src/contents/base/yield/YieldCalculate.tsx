// 원판 수율 검사라는 팝업이 여기저기서 쓰인다고 하셔서 따로 만들었습니다.

// make typescript react component

import { Button, Checkbox, Radio, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import Calculate from "@/assets/svg/icons/calculate.svg";
import Print from "@/assets/svg/icons/print.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import AntdInput from '@/components/Input/AntdInput';
import AntdTable from '@/components/List/AntdTable';
import { yieldCalType, yieldInputReq, yieldInputType } from '@/data/type/sayang/sample';
import { postAPI } from '@/api/post';
import useToast from '@/utils/useToast';
import { validReq } from '@/utils/valid';
import { boardType } from '@/data/type/base/board';

interface Props {
  board: boardType[];
  // minYield: number;
  // minLengthPanel: number;
  // longKitLength: number;
  // shortKitLength: number;
  // longKitInterval: number;
  // shortKitInterval: number;
  // longExtraPanel: number;
  // shortExtraPanel: number;
  // stencil: string;
}


const YieldCalculate: React.FC<Props> = ({
  board,
}) => {
  const stenTableData = [
    {
      stencil: '프리미엄',
      standard: '1.6T',
      vertical: '1,000',
      type: 'A',
      // select: <Checkbox value={yielddata?.minYield == 1} onChange={() => handleCheckboxChange("1")}/>,
    },
    {
      stencil: '프리미엄',
      standard: '1.6T',
      vertical: '1,000',
      type: 'A',
      // select: <Checkbox value={yielddata?.stencil == "2"} onChange={() => handleCheckboxChange("2")}/>,
    },
    {
      stencil: '프리미엄',
      standard: '1.6T',
      vertical: '1,000',
      type: 'A',
      // select: <Checkbox value={yielddata?.stencil == "3"} onChange={() => handleCheckboxChange("3")}/>,
    },
    {
      stencil: '프리미엄',
      standard: '1.6T',
      vertical: '1,000',
      type: 'A',
      // select: <Checkbox value={yielddata?.stencil == "4"} onChange={() => handleCheckboxChange("4")}/>,
    },
  ];

  const hideData = Array.from({ length: 16 }, (_, index) => ({
    stenHorizon: `${1000 + index * 100}`,
    stenVertical: `${1000 + index * 100}`,
    xlength: `${index + 1}`,
    ylength: `${index + 1}`,
    panelHorizon: `${100 + index * 10}`,
    panelVertical: `${100 + index * 10}`,
    amount: `${10 + index * 5}`,
    product: `${12 + index * 6}`,
    yield: `${(89.81 + index * 1.19).toFixed(2)}`,
  }));

  const { showToast, ToastContainer } = useToast();

  const [yielddata, setYielddata] = useState<yieldInputType | null>(null);

  const [yieldTableData, setYieldTableData] = useState<yieldCalType[]>([]);

  const [boardData, setBoardData] = useState<boardType[]>([]);
  useEffect(()=>{
    if(board.length > 0) {
      setBoardData(board);
    }
  }, [board]);

  const [calLoading, setCalLoading] = useState<boolean>(false);

  const items = [
    {value:yielddata?.minPanelLength, name:'minPanelLength', label:'판넬 최저 길이', type:'input', widthType:'full'},
    // {value:yielddata?.diskWidth, name:'diskWidth', label:'원판 너비', type:'input', widthType:'full'},
    // {value:yielddata?.diskHeight, name:'diskHeight', label:'원판 높이', type:'input', widthType:'full'},
    {value:yielddata?.minYield, name:'minYield', label:'최저 수율', type:'input', widthType:'full'},
    {value:yielddata?.kitWidth, name:'kitWidth', label:'Kit 너비', type:'input', widthType:'full'},
    {value:yielddata?.kitHeight, name:'kitHeight', label:'Kit 높이', type:'input', widthType:'full'},
    {value:yielddata?.kitGapX, name:'kitGapX', label:'Kit 간격 X', type:'input', widthType:'full'},
    {value:yielddata?.kitGapY, name:'kitGapY', label:'Kit 간격 Y', type:'input', widthType:'full'},
    {value:yielddata?.kitArrangeX, name:'kitArrangeX', label:'Kit 배치 X', type:'input', widthType:'full'},
    {value:yielddata?.kitArrangeY, name:'kitArrangeY', label:'Kit 배치 Y', type:'input', widthType:'full'},
    {value:yielddata?.marginLongSide, name:'marginLongSide', label:'긴쪽 여분', type:'input', widthType:'full'},
    {value:yielddata?.marginShortSide, name:'marginShortSide', label:'짧은쪽 여분', type:'input', widthType:'full'},
  ]

  const handleCheckboxChange = (w: number, h: number) => {
    // setYielddata((prev) => {
    //   if (prev) {
    //     return { ...prev, diskWidth: w, diskHeight: h };
    //   }
    //   return null;
    // });
    setYielddata({...yielddata, diskWidth:w, diskHeight:h});
  };

  const handleCalculdate = async () => {
    try {
      const val = validReq(yielddata, yieldInputReq());
      if(!val.isValid) {
        showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
        return;
      } 

      console.log(JSON.stringify(yielddata));

      setCalLoading(true);
      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        jsx: 'default',
        url:'board-yield-calc-default/default/calculate/auto',
        etc: true,
      }, yielddata);
  
      if(result.resultCode === "OK_0000") {
        const rdata = (result.data ?? []) as yieldCalType[];
        console.log(rdata, result.data);
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
  }
  useEffect(()=>{console.log(yielddata)}, [yielddata]);

  return (
    <section className='flex gap-10 w-full'>
      <div className='w-[300px] bg-white flex flex-col gap-20 rounded-14 p-30 border border-[#D9D9D9] justify-between'>
        <div className='flex flex-col gap-20 h-[850px] overflow-y-auto'>
          {items.map((item, idx) => (
            <div key={idx}>
              <p className='pb-8'>{item.label}</p>
              <div className="h-center gap-10" >
                <AntdInput 
                  value={item.value ?? undefined}
                  onChange={(e)=>{
                    setYielddata({
                      ...yielddata,
                      [item.name]: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-col gap-10'>
          <Button type="primary" className="w-full flex h-center" onClick={calculdate}>
            <span className='w-16 h-16'><Calculate/></span>
            <span>계산</span>
          </Button>
          <Button className="w-full flex h-center">
            <span className='w-16 h-16'><Print/></span>
            <span>인쇄</span>
          </Button>
          <Button type="text" className="w-full flex h-center">
            <span className='w-16 h-16'><Close/></span>
            <span>종료</span>
          </Button>
        </div>
      </div>
      <section className='flex flex-col gap-10 w-full'>
        <div className='flex gap-10 w-full' style={{flex:1.1, maxHeight:'530px'}}>

          <div className='flex-1 p-30 bg-white rounded-14 border border-[#D9D9D9]'>
          <Radio.Group>
            <AntdTable
              className='h-full'
              columns={[
              {
                title: '원판',
                dataIndex: 'board',
                key: 'board',
                align: 'center',
                children: [
                  { 
                    title: '규격',
                    dataIndex: 'brdW',
                    key: 'brdW',
                    width: 80,
                    align: 'center',
                  },
                  {
                    title: '세로',
                    dataIndex: 'brdH',
                    key: 'brdH',
                    width: 80,
                    align: 'center',
                  },
                  {
                    title: 'TYPE',
                    dataIndex: 'brdType',
                    key: 'brdType',
                    width: 127,
                    align: 'center',
                  },
                  {
                    title: '선택',
                    dataIndex: 'id',
                    key: 'id',
                    width: 98,
                    align: 'center',
                    render: (value, record) => (
                      <Radio
                        value={value}
                        name="board"
                        onChange={(e) => {
                          handleCheckboxChange(record.brdW, record.brdH)
                        }}
                      />
                    )
                  },
                ],
              }]}
              data={boardData}
              styles={{ th_bg: '#EEEEEE', td_bg: '#FFF', td_ht: '40px', th_ht: '40px', round: '0px', th_pd: '0' }}
            />
          </Radio.Group>
          </div>
          <div className='p-30 bg-white rounded-14 border border-[#D9D9D9]'>
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
                    title: '가로',
                    dataIndex: 'stenHorizon',
                    key: 'stenHorizon',
                    width: 80,
                    align: 'center',
                    render: (_) => {
                      return yielddata?.diskWidth;
                    }
                  },
                  {
                    title: '세로',
                    dataIndex: 'stenVertical',
                    key: 'stenVertical',
                    width: 80,
                    align: 'center',
                    render: (_) => {
                      return yielddata?.diskHeight;
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
                  { title: 'X',
                    dataIndex: 'panel.arrangeX',
                    key: 'panel.arrangeX',
                    width: 50,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return record.panel?.arrangeX;
                    }
                  },
                  { title: 'Y',
                    dataIndex: 'panel.arrangeY',
                    key: 'panel.arrangeY',
                    width: 50,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return record.panel?.arrangeY;
                    }
                  },
                  { title: '가로',
                    dataIndex: 'panel.width',
                    key: 'panel.width',
                    width: 80,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return record.panel?.width;
                    }
                  },
                  { title: '세로',
                    dataIndex: 'panel.height',
                    key: 'panel.height',
                    width: 80,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return record.panel?.height;
                    }
                  },
                  { title: '개수',
                    dataIndex: 'panelCount',
                    key: 'panelCount',
                    width: 80,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return record.panelCount;
                    }
                  },
                ],
              },
              {
                title: '비고',
                dataIndex: 'remark',
                key: 'remark',
                align: 'center',
                children: [
                  {
                    title: '제품',
                    dataIndex: 'product',
                    key: 'product',
                    width: 80,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return record.kitCount;
                    }
                  },
                  {
                    title: '수율',
                    dataIndex: 'layout.yieldRatio',
                    key: 'layout.yieldRatio',
                    width: 80,
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
        </div>
        <div className='flex gap-30 w-full p-30 bg-white rounded-14 border border-[#D9D9D9]' style={{flex:1}}>
          <section className='bg-[#FCF779C2]' style={{flex:1.5}}></section>
          <section className='bg-[#0F884FC4]' style={{flex:1}}></section>
        </div>
      </section>
      <ToastContainer/>
    </section>
  );
};

export default YieldCalculate;