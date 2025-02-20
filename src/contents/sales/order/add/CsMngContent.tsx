import { Button, Empty, Radio } from "antd";
import { SetStateAction, useState } from "react";

import { LabelIcon, LabelMedium } from "@/components/Text/Label";
import { DividerH } from "@/components/Divider/Divider";
import PrtMngAddModal from "@/contents/partner/PrtMngAddModal";

import { partnerMngRType } from "@/data/type/base/partner";
import { salesOrderCUType } from "@/data/type/sales/order";

import Edit from "@/assets/svg/icons/memo.svg"
import MessageOn from "@/assets/svg/icons/s_inquiry.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";

import { inputTel } from "@/utils/formatPhoneNumber";
import { inputFax } from "@/utils/formatFax";

interface Props {
  csMngList: partnerMngRType[];
  setCsMngList: React.Dispatch<SetStateAction<partnerMngRType[]>>;
  formData: salesOrderCUType;
  setFormData: React.Dispatch<SetStateAction<salesOrderCUType>>;
  showToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
}

const CsMngContent:React.FC<Props> = ({
  csMngList,
  setCsMngList,
  formData,
  setFormData,
  showToast,
}) => {
  // 담당자 추가 클릭 시 거래처 담당자 설정
  const [ newPrtMngOpen, setNewPrtMngOpen ] = useState<boolean>(false);
  const [ newPartnerMngData, setNewPartnerMngData ] = useState<partnerMngRType | null>(null);

  // 거래처 설정 값 변경 시 실행 함수
  const handlePrtDataChange = (
    dataType: 'prt' | 'mng',
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => {
    let value = e;
    if(type === "input" && typeof e !== "string") {
      value = e.target.value;
    }

    // 전화번호 형식인 필드들은 자동 하이픈 처리
    if(name.toLowerCase().includes("tel") || name.toLowerCase().includes("mobile")) {
      value = inputTel(value.toString());
    } else if (name.toLowerCase().includes("fax")) {
      value = inputFax(value.toString());
    }

    if(key) {
      setNewPartnerMngData(prev => ({
        ...prev,
        [name]: {
          [key]: value,
        },
      } as partnerMngRType));
    } else {
      setNewPartnerMngData(prev => ({
        ...prev,
        [name]: value,
      } as partnerMngRType));
    }
  }

  return (
    <div className="w-full min-h-[200px] bg-white flex flex-col rounded-14 border-[0.3px] border-bdDefult mt-10 px-30 py-20 gap-10">
      <div className="flex gap-10 h-center">
        <LabelMedium label="담당자 정보"/>
        <Button className="w-30 !h-24 v-h-center !p-0"
          onClick={()=>{
            if(!formData.partnerId) {
              showToast("거래처를 선택해주세요.", "error");
              return;
            }
            setNewPrtMngOpen(true);
          }}
        ><SplusIcon/></Button>
      </div>
      <DividerH />
    { csMngList.length < 1 && <Empty /> }
    { csMngList.length > 0 && csMngList.map((mng:partnerMngRType) => (
      <div className="w-full h-40 h-center gap-10" key={mng.id}>
        <p className="w-100 h-center gap-8">
          <Radio
            name="csMng"
            checked={formData.partnerManagerId === mng.id}
            onChange={() => setFormData({...formData, partnerManagerId:mng.id})}
          /> {mng.prtMngNm}
        </p>
        <div className="w-[200px] px-12">
          <LabelIcon label={mng.prtMngDeptNm} icon={<MessageOn />}/>
        </div>
        <div className="w-[200px] px-12">
          <LabelIcon label={mng.prtMngTel} icon={<Call />}/>
        </div>
        <div className="w-[200px] px-12">
          <LabelIcon label={mng.prtMngMobile} icon={<Mobile />}/>
        </div>
        <div className="flex-1 px-12">
          <LabelIcon label={mng.prtMngMobile} icon={<Mail />}/>
        </div>
        <div className="w-40 h-40 v-h-center">
          <p className="w-24 h-24"><Edit /></p>
        </div>
      </div>
    ))}

    <PrtMngAddModal
      open={newPrtMngOpen}
      setOpen={setNewPrtMngOpen}
      partnerId={formData.partnerId ?? ''}
      newPartnerMngData={newPartnerMngData}
      handlePrtDataChange={handlePrtDataChange}
      submitEndFn={()=>{
        setNewPrtMngOpen(false);
        setNewPartnerMngData(null);
      }}
      prtMngSuccessFn={(entity)=>{
        setCsMngList([...csMngList, {...entity} ]);
        setFormData({ ...formData, partnerManagerId: entity.id });
      }}
    />
    </div>
  )
}

export default CsMngContent;