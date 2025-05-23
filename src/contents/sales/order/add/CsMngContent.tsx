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
import Bag from "@/assets/svg/icons/bag.svg";

import { inputTel } from "@/utils/formatPhoneNumber";
import { inputFax } from "@/utils/formatFax";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import { MOCK } from "@/utils/Mock";
import { Popup } from "@/layouts/Body/Popup";

interface Props {
  csMngList: partnerMngRType[];
  setCsMngList: React.Dispatch<SetStateAction<partnerMngRType[]>>;
  handleFormChange: (id:string) => void;
  formPrtId?: string;
  formPrtMngId?: string;
  showToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
}

const CsMngContent:React.FC<Props> = ({
  csMngList,
  setCsMngList,
  handleFormChange,
  formPrtId,
  formPrtMngId,
  showToast,
}) => {
  // 담당자 추가 클릭 시 거래처 담당자 설정
  const [ edit, setEdit ] = useState<boolean>(false);
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
      value = inputTel(value?.toString());
    } else if (name.toLowerCase().includes("fax")) {
      value = inputFax(value?.toString());
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
    <Popup
      title="담당자 정보"
      titleEtc={
      <Button className="v-h-center !p-4 !rounded-50 !border-1 !border-[#008A1E] !w-23 !h-23"
        onClick={()=>{
          if(!formPrtId) {
            showToast("거래처를 선택해주세요.", "error");
            return;
          }
          setNewPrtMngOpen(true);
        }}
      >
        <p className="w-16 h-16"><SplusIcon/></p>
      </Button>}
      className="min-h-auto"
    >
    { csMngList.length < 1 && <Empty imageStyle={{ height: 50 }} /> }
    { csMngList.length > 0 && csMngList.map((mng:partnerMngRType) => (
      <div className="w-full h-40 h-center gap-10" key={mng.id}>
        <p className="w-[300px] h-center gap-8">
          <Radio
            name="csMng"
            checked={formPrtMngId === mng.id}
            onChange={() => {
              handleFormChange(mng.id);
            }}
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
          <LabelIcon label={mng.prtMngEmail} icon={<Mail />}/>
        </div>
        <Button className="v-h-center !p-[3.5px] !rounded-50 !borer-1 !border-[#008A1E] !w-23 !h-23">
          <p
            className="!w-16 !h-16 cursor-pointer"
            onClick={()=>{
              setEdit(true);
              setNewPartnerMngData({...mng});
              setNewPrtMngOpen(true);
            }}
          >
            <Edit />
          </p>
        </Button>
      </div>
    ))}

    <PrtMngAddModal
      open={newPrtMngOpen}
      setOpen={setNewPrtMngOpen}
      partnerId={formPrtId ?? ''}
      newPartnerMngData={newPartnerMngData}
      handlePrtDataChange={handlePrtDataChange}
      submitEndFn={()=>{
        setNewPrtMngOpen(false);
        setNewPartnerMngData(null);
      }}
      prtMngSuccessFn={(entity)=>{
        if(!edit) {
          setCsMngList([...csMngList, {...entity} ]);
          handleFormChange(entity.id);
        } else {
          const updateData = csMngList;
          const index = updateData.findIndex(f=> f.id === newPartnerMngData?.id);
          if(index > -1) {
            updateData[index] = { ...updateData[index], ...newPartnerMngData };
    
            const newArray = [
              ...updateData.slice(0, index),
              updateData[index],
              ...updateData.slice(index + 1)
            ];
            setCsMngList(newArray);
          }
        }
        setEdit(false);
      }}
      edit={edit}
    />
    </Popup>
  )
}

export default CsMngContent;