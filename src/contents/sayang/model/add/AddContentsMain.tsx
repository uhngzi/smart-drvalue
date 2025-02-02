import React, { useState, useCallback } from "react";

import ModelContents from "./ModelContents";

import FullOkButtonSmall from "@/components/Button/FullOkButtonSmall";

import Hint from "@/assets/svg/icons/hint.svg";
import Back from "@/assets/svg/icons/back.svg";
import { modelSampleDataType, newModelSampleData } from "./AddModal";

interface Props {
  model: modelSampleDataType[];
  setModel: (updatedModel: modelSampleDataType[]) => void;
  modelNew: modelSampleDataType;
  setModelNew: (updatedModelNew: modelSampleDataType) => void;
}

const AddContentsMain: React.FC<Props> = React.memo(({ model, setModel, modelNew, setModelNew }) => {
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    name: string,
    type: 'one' | 'mult',
  ) => {
    const { value } = e.target;
    if(type === 'one') {
      setModelNew({ ...modelNew, [name]: value });
    }
  }, [modelNew, setModelNew]);

  const [selectTab, setSelectTab] = useState<number>(0);
  
  return (
    <div className="w-full h-[calc(100vh-200px)] flex flex-col">
      <div className="h-80 flex-none">
        <div className="w-full min-h-32 h-center justify-between">
          <p className="text-16 font-semibold">모델등록</p>
          <div className="w-96 h-32 px-15 h-center justify-between text-14 border-1 border-bdDefault rounded-6 mr-20">
            <p className="min-w-16 min-h-16 text-[#FE5C73]"><Back stroke={'#FE5C73'} /></p>
            초기화
          </div>
        </div>
        <div className="min-h-46 h-center gap-5 text-point1 border-b-1 border-line">
          <p className="w-20 h-20"><Hint /></p>
          <p>기존 사양 모델 등록에 매칭됩니다.</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="flex min-w-[982px]">
          <ModelContents item={modelNew} handleInputChange={handleInputChange} type={'one'}/>
        </div>
      </div>
      <div className="h-50 flex-none">
        <FullOkButtonSmall
          click={() => {
            setModel([...model, modelNew]);
            setModelNew(newModelSampleData(model.length + 1));
          }}
          label="저장"
        />
      </div>
    </div>
  )
});

export default AddContentsMain;