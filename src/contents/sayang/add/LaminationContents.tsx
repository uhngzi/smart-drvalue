import MessageOn from "@/assets/svg/icons/message_on.svg";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSelectRound from "@/components/Select/AntdSelectRound";
import TitleIcon from "@/components/Text/TitleIcon";
import { useEffect, useState } from "react";

import Edit from "@/assets/svg/icons/edit.svg";
import Check from "@/assets/svg/icons/s_check.svg";
import Back from "@/assets/svg/icons/back.svg";
import { Dropdown, DropdownProps, message } from "antd";
import { MenuProps } from "antd/lib";
import { laminationRType } from "@/data/type/base/lamination";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";

interface Props {
}

const items: MenuProps['items'] = [
  {
    label: <>편집</>,
    key: 0,
  },
  {
    label: <>맨 위에 추가</>,
    key: 1,
  },
  {
    label: <>중간에 추가</>,
    key: 2,
  },
  {
    label: <>맨 아래에 추가</>,
    key: 3,
  },
]

const LaminationContents: React.FC<Props> = ({

}) => {
  const [open, setOpen] = useState<boolean>(false);
  const numbers = Array.from({ length: 30 }, (_, index) => index + 1);
  const [select, setSelect] = useState<number>();

  const [lamination, setLamination] = useState<Array<laminationRType>>([
    {
      id: 'sample1',
      lamDtlTypeEm: 'bs',
      matCd: 'HRC',
      matThk: 7628,
      copOut: '1',
      copIn: '1oz',
      lamDtlThk: 1,
      lamDtlRealThk: 1,
      useYn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    },
    {
      id: 'sample2',
      lamDtlTypeEm: 'tc',
      matCd: 'HRC',
      matThk: 7628,
      copOut: '1',
      copIn: '1oz',
      lamDtlThk: 1,
      lamDtlRealThk: 1,
      useYn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    },
    {
      id: 'sample3',
      lamDtlTypeEm: 'bs',
      matCd: 'HRC',
      matThk: 7628,
      copOut: '1',
      copIn: '1oz',
      lamDtlThk: 1,
      lamDtlRealThk: 1,
      useYn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    },
  ]);
  const handleMenuClick = (e:any, item:laminationRType) => {
    let index = 0;
    if(e.key === '1')       index = 0;
    else if(e.key === '2')  index = Math.trunc(lamination.length / 2);
    else if(e.key === '3')  index = lamination.length + 1;

    setLamination((prevItems) => [
      ...prevItems.slice(0, index), // 기존 배열의 앞 부분
      item, // 추가할 아이템
      ...prevItems.slice(index), // 기존 배열의 뒷 부분
    ]);
  };
  const color = ['#E3F9F2','#C6EBF5','#E6D7F5','#F5D9B1','#F5B1A1'];

  const [selectLamiEm, setSeletLamiEm] = useState<'cf' | 'pp' | 'ccl'>('cf');
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [ data, setData ] = useState<Array<laminationRType>>([]);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'wk', 'lamination'],
    queryFn: async () => {
      setDataLoading(true);
      setData([]);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'lamination-source/jsxcrud/many'
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data.data ?? []);
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });

  return (
    <div className="flex flex-col gap-20">
      <div className="h-center justify-between">
        <div
          className="cursor-pointer"
          onClick={()=>setOpen(true)}
        >
          <TitleIcon 
            title="적층구조"
            icon={<MessageOn />}
          />
        </div>
        <div className="w-[50%] v-h-center h-24 rounded-6 border-[0.6px] borer-line bg-back text-14">
          코드 : 040000A
        </div>
      </div>

      <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
        <div className="bg-[#CEE4B3] h-20 v-h-center border-1 border-line">Hoz</div>
        <div className="bg-back h-20 v-h-center border-1 border-line">(BS) 7628HRC x 1</div>
        <div className="bg-[#7551E920] h-20 v-h-center border-1 border-line">(T/C) 1.00T 1/1oz</div>
        <div className="bg-back h-20 v-h-center border-1 border-line">(BS) 7628HRC x 1</div>
        <div className="bg-[#CEE4B3] h-20 v-h-center border-1 border-line">Hoz</div>
      </div>

      <AntdModal
        open={open}
        setOpen={setOpen}
        title={"적층구조 라이브러리 선택 및 편집 구성"}
        contents={
          <div className="v-h-center gap-20 px-10">
            <div className="min-w-[319px] h-[612px] bg-white rounded-14 border-[1.3px] border-[#B9B9B9] p-30 flex flex-col gap-20">
              <div className="h-center justify-between h-40">
                <p className="text-16 font-medium">적층구조 라이브러리</p>
                <div className="w-96 h-24 flex v-h-center">
                  <div className="w-42 border-[1.6px] border-point1 v-h-center text-point1">
                      확정
                  </div>
                  <div className="w-55 border-1 border-line v-h-center">
                    미확정
                  </div>
                </div>
              </div>
              <div className="h-32 h-center justify-between">
                <AntdSelectRound
                  options={[{value:1,label:'1'}]}
                  placeholder={"층선택"}
                  styles={{bc:'#D9D9D9'}}
                  className="w-82"
                />
                <AntdSelectRound
                  options={[{value:1,label:'1'}]}
                  placeholder={"OZ선택"}
                  styles={{bc:'#D9D9D9'}}
                  className="w-88"
                />
                <AntdSelectRound
                  options={[{value:1,label:'1'}]}
                  placeholder={"두께"}
                  styles={{bc:'#D9D9D9'}}
                  className="w-69"
                />
              </div>
              <div className="h-[440px] overflow-y-auto">
                {numbers.map((number) => (
                  <div 
                    key={number} className="w-full h-40 h-center border-b-1 border-[#0000006]"
                    style={select===number?{border:"1px solid #4880FF", background:"#DFE9FF", color:"#4880FF", fontWeight:500}:{}}
                  >
                    <div className="w-40 h-40 v-h-center">
                      <div className="w-24 h-24 bg-[#E9EDF5] rounded-4 v-h-center" style={select===number?{border:"0.3px solid #4880FF"}:{}}>{number}</div>
                    </div>
                    <div className="w-[112px] px-8 py-8">
                      040001A
                    </div>
                    <div className="w-45 v-h-center">
                      1.6T
                    </div>
                    <div className="w-34 v-h-center cursor-pointer" onClick={()=>setSelect(number)}>
                      <p className="w-16 h-16" style={{color:select===number?"#4880FF":"#00000080"}}>
                        {select===number?<Check />:<Edit />}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-[665px] h-[612px] v-h-center gap-5">
              <div className="min-w-[298px] h-full bg-white rounded-14 border-[1.3px] border-[#B9B9B9] p-30">
                <div className="h-center justify-between h-40 w-full mb-20">
                    <p className="text-16 font-medium">적층구조 라이브러리 구성/편집</p>
                  <div
                    className="w-24 h-24 flex v-h-center border-1 border-line rounded-4 cursor-pointer"
                    onClick={()=>{setLamination([]);}}
                  >
                    <p className="w-16 h-16 text-[#FE5C73]"><Back /></p>
                  </div>
                </div>
                <div className="h-[440px]">
                  <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
                    {
                      lamination.map((item:laminationRType, index:number) => (
                        <div
                          key={item.id}
                          className="h-26 h-center border-1 border-line justify-between rounded-4"
                          style={{background:color[index  % 5]}}
                        >
                          <div className="w-40 v-h-center">
                            <div className="w-18 h-18 bg-[#E9EDF5] rounded-4 v-h-center">{index}</div>
                          </div>
                          <p className="w-full v-h-center">
                            {
                              item.id.includes('sample') && item.lamDtlTypeEm === 'bs' ? '(BS) 7628HRC x 1' :
                              item.id.includes('sample') && item.lamDtlTypeEm === 'tc' ? '(T/C) 1.00T 1/1oz' :
                              '('+item.lamDtlTypeEm.toUpperCase()+') '+item.lamDtlThk+'T '+item.copOut+'/'+item.copIn
                            }
                          </p>
                          <div className="w-34 v-h-center">
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  {/* <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
                    <div className="bg-[#CEE4B3] h-26 h-center border-1 border-line justify-between rounded-4">
                      <div className="w-40 v-h-center">
                        <div className="w-18 h-18 bg-[#E9EDF5] rounded-4 v-h-center">1</div>
                      </div>
                      <p className="w-full v-h-center">Hoz</p>
                      <div className="w-34 v-h-center">
                      </div>
                    </div>
                    <div className="bg-back h-26 h-center border-1 border-line justify-between rounded-4">
                      <div className="w-40 v-h-center">
                        <div className="w-18 h-18 bg-[#E9EDF5] rounded-4 v-h-center">2</div>
                      </div>
                      <p className="w-full v-h-center">(BS) 7628HRC x 1</p>
                      <div className="w-34 v-h-center">
                      </div>
                    </div>
                    <div className="bg-[#7551E920] h-26 h-center border-1 border-line justify-between rounded-4">
                      <div className="w-40 v-h-center">
                        <div className="w-18 h-18 bg-[#E9EDF5] rounded-4 v-h-center">3</div>
                      </div>
                      <p className="w-full v-h-center">(T/C) 1.00T 1/1oz</p>
                      <div className="w-34 v-h-center">
                      </div>
                    </div>
                    <div className="bg-back h-26 h-center border-1 border-line justify-between rounded-4">
                      <div className="w-40 v-h-center">
                        <div className="w-18 h-18 bg-[#E9EDF5] rounded-4 v-h-center">4</div>
                      </div>
                      <p className="w-full v-h-center">(BS) 7628HRC x 1</p>
                      <div className="w-34 v-h-center">
                      </div>
                    </div>
                    <div className="bg-[#CEE4B3] h-26 h-center border-1 border-line justify-between rounded-4">
                      <div className="w-40 v-h-center">
                        <div className="w-18 h-18 bg-[#E9EDF5] rounded-4 v-h-center">5</div>
                      </div>
                      <p className="w-full v-h-center">Hoz</p>
                      <div className="w-34 v-h-center">
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="w-24 h-center flex-col gap-5">
                <div 
                  className="w-24 h-24 rounded-4 v-h-center cursor-pointer bg-point3 text-white"
                  onClick={()=>{}}
                >
                  {'<'}
                </div>
                <div 
                  className="w-24 h-24 rounded-4 v-h-center cursor-pointer border-1 border-line bg-white"
                  onClick={()=>{}}
                >
                  {'>'}
                </div>
              </div>
              <div className="min-w-[333px] h-full bg-white rounded-14 border-[1.3px] border-[#B9B9B9] p-30">
                <div className="h-center justify-between h-40 w-full mb-20">
                  <p className="text-16 font-medium">적층구조 구성요소</p>
                  <div className="w-[128px] h-24 flex v-h-center">
                    <div
                      className="w-43 v-h-center cursor-pointer"
                      onClick={()=>{setSeletLamiEm('cf')}}
                      style={selectLamiEm==='cf'?
                        {border:'1.6px solid #4880FF',color:'#4880FF'}
                        :
                        {border:'1px solid #D5D5D5',color:'#22222285'}
                      }
                    >
                      C/F
                    </div>
                    <div 
                      className="w-42 v-h-center cursor-pointer"
                      onClick={()=>{setSeletLamiEm('pp')}}
                      style={selectLamiEm==='pp'?
                        {border:'1.6px solid #4880FF',color:'#4880FF'}
                        :
                        {border:'1px solid #D5D5D5',color:'#22222285'}
                      }
                    >
                      P/P
                    </div>
                    <div
                      className="w-45 v-h-center cursor-pointer"
                      onClick={()=>{setSeletLamiEm('ccl')}}
                      style={selectLamiEm==='ccl'?
                        {border:'1.6px solid #4880FF',color:'#4880FF'}
                        :
                        {border:'1px solid #D5D5D5',color:'#22222285'}
                      }
                    >
                      CCL
                    </div>
                  </div>
                </div>
                <div className="h-[480px] overflow-y-auto text-12">
                  <div className="h-40 bg-back h-center justify-between">
                    <p className="w-70 v-h-center">재질</p>
                    <p className="w-56 v-h-center">동박</p>
                    <p className="w-56 v-h-center">두께</p>
                    <p className="w-56 v-h-center">실두께</p>
                    <div className="w-34 v-h-center"><p className="w-16 h-16"><Edit/></p></div>
                  </div>
                  {
                    !dataLoading && data
                      .filter((f:laminationRType) => f.lamDtlTypeEm === selectLamiEm)
                      .map((item:laminationRType) => 
                    (
                      <div
                        key={item.id}
                        className="w-full h-40 h-center border-b-1 border-[#0000006] text-center"
                      >
                        <div className="w-70 h-40 v-h-center">
                          {'('+item.lamDtlTypeEm.toUpperCase()+')'+item.matCd}
                        </div>
                        <div className="w-56 px-8 py-8">
                          {item.copOut}
                        </div>
                        <div className="w-56 px-8 py-8">
                          {item.lamDtlThk}
                        </div>
                        <div className="w-56 px-8 py-8">
                          {item.lamDtlRealThk}
                        </div>
                        <div className="w-34 v-h-center cursor-pointer">
                          <Dropdown trigger={['click']} menu={{ items, onClick:(e)=>handleMenuClick(e, item) }}>
                            <p className="w-16 h-16">
                              <Edit />
                            </p>
                          </Dropdown>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        }
        width={1044}
      />
    </div>
  )
}

export default LaminationContents;