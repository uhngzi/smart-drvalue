import Description from "@/components/Description/Description";
import DescriptionItems from "@/components/Description/DescriptionItems";
import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdDragger from "@/components/Upload/AntdDragger";
import PopupOkButton from "@/components/Button/PopupOkButton";
import PopupCancleButton from "@/components/Button/PopupCancleButton";

import Edit from "@/assets/svg/icons/edit.svg"

import { SetStateAction, useState } from "react";
import dynamic from "next/dynamic";

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
  const [ value, setValue ] = useState<string>('');
  const [ textarea, setTextarea ] = useState<string>('');
  const [ length, setLength ] = useState<number>(0);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileIdList, setFileIdList] = useState<string[]>([]);

  return (
    <div className="w-full">
      <div className="w-full flex">
        <div className="w-[65%] h-[550px] flex flex-col">
          <div className="border-1 border-line h-[450px] px-20 py-10">
            <Description separatorColor="#e7e7ed">
              <DescriptionItems title="고객">
                <AntdSelect options={[{value:1, label:'고객1'}]} />
              </DescriptionItems>
              <DescriptionItems title="발주 제목">
                <AntdInput value={value} onChange={(e)=>{setValue(e.target.value)}} className="w-full" />
              </DescriptionItems>
            </Description>
            <div className="mt-30">
              <QuillTextArea
                value={textarea}
                setValue={(v)=>{setTextarea(v)}}
                length={length}
                setLength={setLength}
                height="200px"
              />
            </div>
          </div>
          <div className="px-10 py-20 flex flex-col gap-10">
            <p className="font-semibold text-16">담당자 정보</p>
            <div className="h-center justify-between">
              <AntdSelect options={[{value:1, label:'담당자1'}]} className="w-[120px!important]" defaultValue={1}/>
              <p className="font-semibold">010-0000-0000</p>
              <p className="font-semibold">dravinon@naver.com</p>
              <p className="font-semibold">010-0000-0000</p>
              <div className="h-center gap-2">
                사업관리
                <div className="w-20 h-24 bg-[#E9EDF5] rounded-4 v-h-center cursor-pointer">
                  <Edit />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[45%] pl-20 flex flex-col gap-10">
          <p className="text-16">발주 첨부파일</p>
          <div className="w-full h-[300px]">
            <AntdDragger
              fileList={fileList}
              setFileList={setFileList}
              fileIdList={fileIdList}
              setFileIdList={setFileIdList}
            />
          </div>
        </div>
      </div>
      <div className="w-full v-h-center gap-10">
        <PopupOkButton label="등록" click={()=>setOpen(false)} />
        <PopupCancleButton label="취소" click={()=>setOpen(false)} />
      </div>
    </div>
  )
}

export default AddOrderContents;