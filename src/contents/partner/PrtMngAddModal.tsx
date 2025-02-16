import { SetStateAction } from "react";

import CardInputList from "@/components/List/CardInputList";
import AntdEditModal from "@/components/Modal/AntdEditModal";

import TrArrow from "@/assets/svg/icons/t-r-arrow.svg";
import Bag from "@/assets/svg/icons/bag.svg";
import { Button } from "antd";
import { postAPI } from "@/api/post";
import { partnerMngCUType, partnerMngRType } from "@/data/type/base/partner";
import useToast from "@/utils/useToast";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  handlePrtDataChange: (
    dataType: 'prt' | 'mng',
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string
  )=> void;
  newPartnerMngData: partnerMngRType | null;
  partnerId: string;
  submitEndFn?: () => void;
  prtMngSuccessFn?: (entity:partnerMngRType) => void;
}

const PrtMngAddModal:React.FC<Props> = ({
  open,
  setOpen,
  handlePrtDataChange,
  newPartnerMngData,
  partnerId,
  submitEndFn,
  prtMngSuccessFn,
}) => {
  const { showToast, ToastContainer } = useToast();

  // 담당자 추가 시 실행 함수
  const handleSubmitPrtMngData = async () => {
    try {
      const result = await postAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner-mng',
        jsx: 'jsxcrud'},
        { 
          partner: { id: partnerId },
          prtMngNm: newPartnerMngData?.prtMngNm,
          prtMngDeptNm: newPartnerMngData?.prtMngDeptNm,
          prtMngTeamNm: newPartnerMngData?.prtMngTeamNm,
          prtMngTel: newPartnerMngData?.prtMngTel,
          prtMngMobile: newPartnerMngData?.prtMngMobile,
          prtMngFax: newPartnerMngData?.prtMngFax,
          prtMngEmail: newPartnerMngData?.prtMngEmail, } as partnerMngCUType
      );
      
      submitEndFn?.();
      if(result.resultCode === "OK_0000") {
        const csMng = result.data?.entity as partnerMngRType;
        prtMngSuccessFn?.(csMng);

        showToast("담당자가 성공적으로 추가되었습니다.", "success");
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
      }
    } catch(e) {
      console.log('catch error : ', e);
    }
  }

  return (
    <>
      <AntdEditModal
        open={open}
        setOpen={setOpen}
        width={760}
        contents={<>
          <CardInputList title="담당자 추가" 
            titleIcon={<Bag/>}
            btnLabel={
              <Button type="primary" size="large" onClick={handleSubmitPrtMngData}
                className="w-full flex h-center gap-8 !h-[50px]" 
                style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
                <TrArrow/>
                <span>저장</span>
              </Button>
            }
            items={[
              {value:newPartnerMngData?.prtMngNm, name:'prtMngNm',label:'담당자명', type:'input', widthType:'full'},
              {value:newPartnerMngData?.prtMngDeptNm, name:'prtMngDeptNm',label:'부서명', type:'input', widthType:'half'},
              {value:newPartnerMngData?.prtMngTeamNm, name:'prtMngTeamNm',label:'팀명', type:'input', widthType:'half'},
              {value:newPartnerMngData?.prtMngTel, name:'prtMngTel',label:'전화번호', type:'input', widthType:'half'},
              {value:newPartnerMngData?.prtMngMobile, name:'prtMngMobile',label:'휴대번호', type:'input', widthType:'half'},
              {value:newPartnerMngData?.prtMngFax, name:'prtMngFax',label:'팩스번호', type:'input', widthType:'half'},
              {value:newPartnerMngData?.prtMngEmail, name:'prtMngEmail',label:'이메일', type:'input', widthType:'half'},
            ]}
            handleDataChange={(e, name, type)=>handlePrtDataChange('mng', e, name, type)}
          />
        </>}
      />
      <ToastContainer/>
    </>
  )
}

export default PrtMngAddModal;