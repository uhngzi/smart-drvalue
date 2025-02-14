// 원판 수율 검사라는 팝업이 여기저기서 쓰인다고 하셔서 따로 만들었습니다.

// make typescript react component

import CardInputList from '@/components/List/CardInputList';
import { Button, Checkbox } from 'antd';
import React, { useState } from 'react';

import Calculate from "@/assets/svg/icons/calculate.svg";
import Print from "@/assets/svg/icons/print.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import AntdInput from '@/components/Input/AntdInput';
import AntdTable from '@/components/List/AntdTable';

interface yieldType {
  minYield: number;
  minLengthPanel: number;
  longKitLength: number;
  shortKitLength: number;
  longKitInterval: number;
  shortKitInterval: number;
  longExtraPanel: number;
  shortExtraPanel: number;
  stencil: string;
}


const YieldCalculate: React.FC = () => {
  const [yielddata, setYielddata] = useState<yieldType | null>(null);
  const [yieldTableData, setYieldTableData] = useState<any[]>([]);

  const items = [
    {value:yielddata?.minYield, name:'minYield', label:'최저수율', type:'input', widthType:'full'},
    {value:yielddata?.minLengthPanel, name:'minLengthPanel', label:'판넬최저길이', type:'input', widthType:'full'},
    {value:yielddata?.longKitLength, name:'longKitLength', label:'Kit긴쪽길이', type:'input', widthType:'full'},
    {value:yielddata?.shortKitLength, name:'shortKitLength', label:'Kit짧은쪽길이', type:'input', widthType:'full'},
    {value:yielddata?.longKitInterval, name:'longKitInterval', label:'Kit긴쪽간격', type:'input', widthType:'full'},
    {value:yielddata?.shortKitInterval, name:'shortKitInterval', label:'Kit짧은쪽간격', type:'input', widthType:'full'},
    {value:yielddata?.longExtraPanel, name:'longExtraPanel', label:'판넬긴쪽여분', type:'input', widthType:'full'},
    {value:yielddata?.shortExtraPanel, name:'shortExtraPanel', label:'판넬짧은쪽여분', type:'input', widthType:'full'},
  ]
  const handleCheckboxChange = (value: string) => {
    setYielddata((prev) => {
      if (prev) {
        return { ...prev, stencil: value };
      }
      return null;
    });
  };

  const stenTableData = [
    {
      stencil: '프리미엄',
      standard: '1.6T',
      vertical: '1,000',
      type: 'A',
      select: <Checkbox value={yielddata?.stencil == "1"} onChange={() => handleCheckboxChange("1")}/>,
    },
    {
      stencil: '프리미엄',
      standard: '1.6T',
      vertical: '1,000',
      type: 'A',
      select: <Checkbox value={yielddata?.stencil == "2"} onChange={() => handleCheckboxChange("2")}/>,
    },
    {
      stencil: '프리미엄',
      standard: '1.6T',
      vertical: '1,000',
      type: 'A',
      select: <Checkbox value={yielddata?.stencil == "3"} onChange={() => handleCheckboxChange("3")}/>,
    },
    {
      stencil: '프리미엄',
      standard: '1.6T',
      vertical: '1,000',
      type: 'A',
      select: <Checkbox value={yielddata?.stencil == "4"} onChange={() => handleCheckboxChange("4")}/>,
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

  function calculdate(){
    setYieldTableData(hideData);
  }
  return (
    <section className='flex gap-10 w-full'>
    <div className='w-[300px] bg-white flex flex-col rounded-14 p-30 border border-[#D9D9D9] justify-between'>
      <div className='flex flex-col gap-20 h-[850px]'>
        {items.map((item, idx) => (
          <div key={idx}>
            <p className='pb-8'>{item.label}</p>
            <div className="h-center gap-10" >
              <AntdInput 
                value={item.value ?? undefined}
                onChange={()=>{}}
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
          <AntdTable
            className='h-full'
            columns={[
            {
              title: '원판',
              dataIndex: 'prdNm',
              key: 'prdNm',
              align: 'center',
              children: [
                { title: '규격', dataIndex: 'standard', key: 'standard', width: 80, align: 'center' },
                { title: '세로', dataIndex: 'vertical', key: 'vertical', width: 80, align: 'center' },
                { title: 'TYPE', dataIndex: 'type', key: 'type', width: 127, align: 'center' },
                { title: '선택', dataIndex: 'select', key: 'select', width: 98, align: 'center' },
              ],
            }]}
            data={stenTableData}
            styles={{ th_bg: '#EEEEEE', td_bg: '#FFF', td_ht: '40px', th_ht: '40px', round: '0px', th_pd: '0' }}
          />
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
                  { title: '가로', dataIndex: 'stenHorizon', key: 'stenHorizon', width: 80, align: 'center' },
                  { title: '세로', dataIndex: 'stenVertical', key: 'stenVertical', width: 80, align: 'center' },
                ],
              },
              {
                title: '판넬',
                dataIndex: 'panel',
                key: 'panel',
                align: 'center',
                children: [
                  { title: 'X', dataIndex: 'xlength', key: 'xlength', width: 50, align: 'center' },
                  { title: 'Y', dataIndex: 'ylength', key: 'ylength', width: 50, align: 'center' },
                  { title: '가로', dataIndex: 'panelHorizon', key: 'panelHorizon', width: 80, align: 'center' },
                  { title: '세로', dataIndex: 'panelVertical', key: 'panelVertical', width: 80, align: 'center' },
                  { title: '개수', dataIndex: 'amount', key: 'amount', width: 80, align: 'center' },
                ],
              },
              {
                title: '비고',
                dataIndex: 'remark',
                key: 'remark',
                align: 'center',
                children: [
                  { title: '제품', dataIndex: 'product', key: 'product', width: 80, align: 'center' },
                  { title: '수율', dataIndex: 'yield', key: 'yield', width: 80, align: 'center' },
                ],
              },
            ]}
            data={yieldTableData}
            styles={{ th_bg: '#EEEEEE', td_bg: '#FFF', td_ht: '40px', th_ht: '40px', round: '0px', th_pd: '0' }}
          />
        </div>
      </div>
      <div className='flex gap-30 w-full p-30 bg-white rounded-14 border border-[#D9D9D9]' style={{flex:1}}>
        <section className='bg-[#FCF779C2]' style={{flex:1.5}}></section>
        <section className='bg-[#0F884FC4]' style={{flex:1}}></section>
      </div>
      
    </section>
    
    </section>
  );
};

export default YieldCalculate;