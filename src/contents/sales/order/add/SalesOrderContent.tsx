import { SetStateAction, useEffect, useRef, useState } from "react";

import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import { DividerH, DividerV } from "@/components/Divider/Divider";
import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";
import { LabelMedium, LabelThin } from "@/components/Text/Label";
import AntdDraggerSmall from "@/components/Upload/AntdDraggerSmall";

import { HotGrade } from "@/data/type/enum";
import { selectType } from "@/data/type/componentStyles";
import { salesOrderCUType, salesOrderProcuctCUType } from "@/data/type/sales/order";

import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { Popup } from "@/layouts/Body/Popup";

interface Props {
  csList: selectType[];
  formData: salesOrderCUType;
  setFormData: React.Dispatch<SetStateAction<salesOrderCUType>>;
  fileList: any[];
  setFileList: React.Dispatch<SetStateAction<any[]>>;
  fileIdList: string[];
  setFileIdList: React.Dispatch<SetStateAction<string[]>>;
  setViewKey: React.Dispatch<SetStateAction<number | null>>;
  setPriceFlag: React.Dispatch<SetStateAction<boolean>>;
  newProducts: salesOrderProcuctCUType[];
  setAddPartner: React.Dispatch<SetStateAction<boolean>>;
  detailChk: boolean;
  setDetailChk: React.Dispatch<SetStateAction<boolean>>;
}

const SalesOrderContent: React.FC<Props> = ({
  csList,
  formData,
  setFormData,
  fileList,
  setFileList,
  fileIdList,
  setFileIdList,
  setViewKey,
  setPriceFlag,
  newProducts,
  setAddPartner,
  detailChk,
  setDetailChk,
}) => {
  // 첨부파일 변경 시 FORM에 세팅
  useEffect(()=>{
    if(!detailChk) {
      setFormData({ ...formData, files:fileIdList });
    }
  }, [fileIdList]);

  // 첨부파일 목록의 유동적인 높이 조절을 위해 추가
  // 전체 div의 크기를 가져오기 위한 변수
  const ref = useRef<HTMLDivElement>(null);
  // 높이 변경을 감지하기 위한 변수
  const [changeHeight, setChangeHeight] = useState<{width: number; height: number;} | null>(null);

  return (
    <Popup
      title="고객발주 등록"
      className="min-h-[650px]"
    >
      <div
        className="w-full h-center gap-30 overflow-auto"
        ref={el => {if(el)  ref.current = el;}}
      >
        <div className="flex flex-col w-[222px] h-full gap-24">
          <div className="flex flex-col gap-8">
            <LabelThin label="고객"/>
            <CustomAutoComplete
              option={csList}
              value={formData.partnerId}
              onChange={(value) => {
                setFormData({...formData, partnerId: value});
              }}
              handleAddData={()=>setAddPartner(true)}
              addLabel="고객 추가하기"
            />
          </div>
          <div className="flex flex-col gap-8">
            <LabelThin label="발주일"/>
            <AntdDatePicker
              value={formData.orderDt ?? dayjs()}
              onChange={(value)=>setFormData((prev => ({ ...prev, orderDt:value })))}
              styles={{br:"2px",bc:"#D5D5D5"}}
              className="w-full h-36"
              suffixIcon={"cal"}
            />
          </div>
          <div className="flex flex-col gap-8">
            <LabelThin label="긴급상태"/>
            <AntdSelect 
              options={[
                {value:HotGrade.SUPER_URGENT,label:'초긴급'},
                {value:HotGrade.URGENT,label:'긴급'},
                {value:HotGrade.NORMAL,label:'일반'},
              ]}
              value={formData.hotGrade ?? HotGrade.NORMAL}
              onChange={(e)=>{
                const value = e+'' as HotGrade;
                setFormData({...formData, hotGrade:value});
              }}
              styles={{ht:'36px'}}
            />
          </div>
          <div className="flex flex-col gap-8 flex-1">
            <AntdDraggerSmall
              fileList={fileList}
              setFileList={setFileList}
              fileIdList={fileIdList}
              setFileIdList={setFileIdList}
              mult={true}
              divRef={ref}
              changeHeight={changeHeight}
              defaultHeight={348}
            />
          </div>
        </div>
        
        <DividerV />

        <div className="flex-1 h-full flex flex-col gap-24">
          <div className="flex flex-col gap-8">
            <LabelThin label="고객발주명"/>
            <AntdInput
              value={formData.orderName}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({...formData, orderName:value});
              }}
              styles={{ht:'36px'}}
            />
          </div>
          <div className="flex flex-col gap-8">
            <LabelThin label="고객발주 메일 내용"/>
            <TextArea
              value={formData.orderTxt}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({...formData, orderTxt:value});
              }}
              className="rounded-2"
              style={{height:400,minHeight:400}}
              onResize={(e)=>{setChangeHeight(e)}}
            />
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default SalesOrderContent;