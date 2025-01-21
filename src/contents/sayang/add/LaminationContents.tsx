import MessageOn from "@/assets/svg/icons/message_on.svg";
import AntdModal from "@/components/Modal/AntdModal";
import AntdSelectRound from "@/components/Select/AntdSelectRound";
import TitleIcon from "@/components/Text/TitleIcon";
import { useState } from "react";

import Edit from "@/assets/svg/icons/edit.svg";
import Check from "@/assets/svg/icons/s_check.svg";
import Back from "@/assets/svg/icons/back.svg";
import { Dropdown } from "antd";
import { MenuProps } from "antd/lib";

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
    label: <>맨 아래에 추가</>,
    key: 2,
  },
  {
    label: <>1 아래에 추가</>,
    key: 3,
  },
  {
    label: <>2 아래에 추가</>,
    key: 4,
  },
  {
    label: <>3 아래에 추가</>,
    key: 5,
  },
  {
    label: <>4 아래에 추가</>,
    key: 6,
  },
]

const LaminationContents: React.FC<Props> = ({

}) => {
  const [open, setOpen] = useState<boolean>(false);
  const numbers = Array.from({ length: 30 }, (_, index) => index + 1);
  const numbers2 = Array.from({ length: 11 }, (_, index) => index + 1);
  const [select, setSelect] = useState<number>();

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
                  <div className="w-24 h-24 flex v-h-center border-1 border-line rounded-4">
                    <p className="w-16 h-16 text-[#FE5C73]"><Back /></p>
                  </div>
                </div>
                <div className="h-[440px]">
                  <div className="w-full text-12 text-[#292828] flex flex-col gap-3">
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
                  </div>
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
                    <div className="w-43 border-[1.6px] border-point1 v-h-center text-point1">
                      C/F
                    </div>
                    <div className="w-42 border-1 border-line v-h-center text-[#22222285]">
                      P/P
                    </div>
                    <div className="w-45 border-1 border-line v-h-center text-[#22222285]">
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
                  {numbers2.map((number) => (
                    <div 
                      key={number} className="w-full h-40 h-center border-b-1 border-[#0000006]"
                    >
                      <div className="w-70 h-40 v-h-center">
                        (CF)10z
                      </div>
                      <div className="w-56 px-8 py-8">
                        Base
                      </div>
                      <div className="w-56 px-8 py-8">
                        .04
                      </div>
                      <div className="w-56 px-8 py-8">
                        .04
                      </div>
                      <div className="w-34 v-h-center cursor-pointer">
                        <Dropdown trigger={['click']} menu={{ items }}>
                          <p className="w-16 h-16">
                            <Edit />
                          </p>
                        </Dropdown>
                      </div>
                    </div>
                  ))}
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