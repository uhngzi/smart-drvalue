import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import { DividerH, DividerV } from "@/components/Divider/Divider";
import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";
import { LabelMedium, LabelThin } from "@/components/Text/Label";
import AntdDragger from "@/components/Upload/AntdDragger";
import { partnerRType } from "@/data/type/base/partner";
import { selectType } from "@/data/type/componentStyles";
import { HotGrade } from "@/data/type/enum";
import { salesOrderCUType } from "@/data/type/sales/order";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { SetStateAction, useEffect } from "react";

interface Props {
  csList: selectType[];
  formData: salesOrderCUType;
  setFormData: React.Dispatch<SetStateAction<salesOrderCUType>>;
  fileList: any[];
  setFileList: React.Dispatch<SetStateAction<any[]>>;
  fileIdList: string[];
  setFileIdList: React.Dispatch<SetStateAction<string[]>>;
}

const SalesOrderContent: React.FC<Props> = ({
  csList,
  formData,
  setFormData,
  fileList,
  setFileList,
  fileIdList,
  setFileIdList,
}) => {
  // 첨부파일 변경 시 FORM에 세팅
  useEffect(()=>{
    setFormData({ ...formData, files:fileIdList });
  }, [fileIdList]);

  return (
    <div className="w-full flex flex-col p-30 gap-20 border-bdDefault border-[0.3px] rounded-14 bg-white">
      <LabelMedium label="고객발주 등록" />
      <DividerH />
      <div className="w-full h-[421px] h-center gap-30 overflow-auto">
        <div className="flex flex-col w-[222px] h-full gap-24">
          <div className="flex flex-col gap-8">
            <LabelThin label="고객"/>
            <AntdSelect 
              options={csList}
              value={formData.partnerId}
              onChange={(e)=>{
                const value = e+'';
                setFormData({...formData, partnerId:value});
              }}
              styles={{ht:'36px'}}
            />
          </div>
          <div className="flex flex-col gap-8">
            <LabelThin label="총 수주 금액"/>
            <AntdInput
              value={formData.totalOrderPrice}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({...formData, totalOrderPrice: Number(value)});
              }}
              styles={{ht:'36px'}}
              type="number"
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
            />
          </div>
          <div className="flex flex-col gap-8">
            <LabelThin label="첨부파일"/>
            <div className="w-full h-[150px]">
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
      </div>
    </div>
  )
}

export default SalesOrderContent;