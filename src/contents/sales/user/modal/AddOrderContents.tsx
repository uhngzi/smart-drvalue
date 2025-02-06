import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdDragger from "@/components/Upload/AntdDragger";
import TitleSmall from "@/components/Text/TitleSmall";

import Submit from "@/assets/svg/icons/submit.svg";
import Edit from "@/assets/svg/icons/memo.svg"

import { SetStateAction, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Divider } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getClientCsAPI } from "@/api/cache/client";
import { cuRType } from "@/data/type/base/cu";
import { newDatasalesOrderCUType, salesOrderCUType } from "@/data/type/sales/order";

const QuillTextArea = dynamic(
  () => import('@/components/TextArea/QuillTextArea'),
  {
    ssr: false,
  },
);

interface Props {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const AddOrderContents: React.FC<Props> = ({
  setOpen,
}) => {
  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const { data:cs } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getClientCsAPI(),
  });
  
  useEffect(()=>{
    if(cs?.data.data?.length) {
      setCsList(cs.data.data.map((cs:cuRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data.data]);

  const [ formData, setFormData ] = useState<salesOrderCUType>(newDatasalesOrderCUType);
  useEffect(()=>{console.log(formData)},[formData]);

  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);
  useEffect(()=>{
    if(fileIdList.length > 0) {
      setFormData({ ...formData, files:fileIdList });
    }
  }, [fileIdList]);

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="w-full h-center bg-white border-[0.5px] border-[#B9B9B91] rounded-14 p-30">
        <div className="w-[800px] h-[414px]">
          <div className="mb-24">
            <TitleSmall title="고객"/>
            <AntdSelect 
              options={csList}
              value={formData.partnerId}
              onChange={(e)=>{
                const value = e+'';
                setFormData({...formData, partnerId:value});
              }}
              styles={{ht:'40px'}}
            />
          </div>
          <div className="mb-24">
            <TitleSmall title="발주제목"/>
            <AntdInput 
              value={formData.orderName}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({...formData, orderName:value});
              }}
              styles={{ht:'40px'}}
            />
          </div>
          <div className="mb-24">
            <QuillTextArea
                value={formData.orderTxt}
                setValue={(value)=>{
                  setFormData({...formData, orderTxt:value});
                }}
                height="182px"
                styles={{br:'0px'}}
              />
          </div>
        </div>
        <Divider type="vertical" style={{height:414,borderLeft:'1px solid #D9D9D9',marginLeft:20,marginRight:20,width:1}} />
        <div className="w-[347px] h-[414px]">
          <TitleSmall title="발주 첨부파일"/>
          <div className="w-full h-[172px]">
            <AntdDragger
              fileList={fileList}
              setFileList={setFileList}
              fileIdList={fileIdList}
              setFileIdList={setFileIdList}
              mult={true}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[150px] bg-white border-[0.3px] border-[#B9B9B91] rounded-14 px-30 py-20">
        <TitleSmall title="담당자 정보"/>
        <div className="flex flex-col gap-4">
          <div className="w-full h-32 h-center gap-10">
            <p className="w-[210px]">
              <AntdSelect
                options={[{value:1,label:'홍길동'},{value:2,label:'김길동'}]}
              />
            </p>
            <p className="w-[216px] px-12 py-5 text-14 text-[#000000]">
              031-123-1234
            </p>
            <p className="w-[216px] px-12 py-5 text-14 text-[#000000]">
              88abcdabcd@gmail.com
            </p>
            <p className="w-[216px] px-12 py-5 text-14 text-[#000000]">
              010-1234-5678
            </p>
            <p className="w-[216px] px-12 py-5 text-14 text-[#000000]">
              사업관리
            </p>
            <p className="w-64 h-32 rounded-6 v-between-h-center text-14 px-7 py-4 cursor-pointer bg-white text-[#444444] border-1 border-line">
              <p className="w-16 h-16"><Edit /></p>
              편집
            </p>
          </div>
          <div className="w-full h-32 h-center gap-10">
            <p className="w-[210px]">
              <AntdSelect
                options={[{value:1,label:'홍길동'},{value:2,label:'김길동'}]}
              />
            </p>
            <p className="w-[216px] text-14 text-[#000000]">
              <AntdInput />
            </p>
            <p className="w-[216px] text-14 text-[#000000]">
              <AntdInput />
            </p>
            <p className="w-[216px] text-14 text-[#000000]">
              <AntdInput />
            </p>
            <p className="w-[216px] text-14 text-[#000000]">
              <AntdInput />
            </p>
            <p className="w-64 h-32 rounded-6 v-between-h-center text-14 px-7 py-4 cursor-pointer bg-point1 text-white">
              <p className="w-16 h-16"><Submit stroke={'#fff'} /></p>
              저장
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full v-h-center gap-10 mt-10">
        <p 
          className="w-80 h-32 rounded-6 v-between-h-center text-14 px-15 cursor-pointer bg-white text-[#444444] border-1 border-line"
          onClick={()=>setOpen(false)}
        >
          <p className="w-16 h-16"><Edit /></p>
          편집
        </p>
        <p 
          className="w-80 h-32 rounded-6 v-between-h-center text-14 px-15 cursor-pointer bg-point1 text-white"
          onClick={()=>setOpen(false)}
        >
          <p className="w-16 h-16"><Submit stroke={'#fff'} /></p>
          등록
        </p>
      </div>
    </div>
  )
}

export default AddOrderContents;
