import { SetStateAction, useEffect, useState } from "react";
import { Button } from "antd";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";

import AntdDrawer from "@/components/Drawer/AntdDrawer";
import CardList from "@/components/List/CardList";
import AntdEditModal from "@/components/Modal/AntdEditModal";
import CardInputList from "@/components/List/CardInputList";

import { inputTel, isValidTel } from "@/utils/formatPhoneNumber";
import { inputFax } from "@/utils/formatFax";

import Close from "@/assets/svg/icons/s_close.svg";
import Edit from "@/assets/svg/icons/memo.svg";
import Plus from "@/assets/svg/icons/s_plus.svg";
import TrArrow from "@/assets/svg/icons/t-r-arrow.svg";
import Bag from "@/assets/svg/icons/bag.svg";
import Search from "@/assets/svg/icons/s_search.svg";

import { partnerCUType, partnerMngCUType, partnerMngRType, partnerRType } from "@/data/type/base/partner";
import useToast from "@/utils/useToast";
import PrtMngAddModal from "./PrtMngAddModal";
import { isValidEmail } from "@/utils/formatEmail";


interface Props {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  partnerId: string;
  partnerData: partnerRType | null;
  partnerMngData?: partnerMngRType | null;
  submitEndFn?: () => void;
  prtSuccessFn?: () => void;
  prtMngSuccessFn?: (entity:partnerMngRType) => void;
}

const PrtDrawer: React.FC<Props> = ({
  open,
  setOpen,
  onClose,
  partnerId,
  partnerData,
  partnerMngData,
  submitEndFn,
  prtSuccessFn,
  prtMngSuccessFn,
}) => {
  const { showToast, ToastContainer } = useToast();

  const [ drawerPrtItems, setDrawerPrtItems ] = useState<Array<any>>([]);
  const [ drawerMngItems, setDrawerMngItems ] = useState<Array<any>>([]);

  // 거래처 클릭 시 값이 변하고 Drawer 오픈
  useEffect(()=>{
    if(partnerData !== null) {
      setDrawerPrtItems([
        { label: '거래처명', value: partnerData?.prtNm ?? '-', widthType: 'full' },
        { label: '거래처 식별코드', value: partnerData?.prtRegCd ?? '-', widthType: 'half' },
        { label: '거래처 축약명', value: partnerData?.prtSnm ?? '-', widthType: 'half' },
        { label: '거래처 영문명', value: partnerData?.prtEngNm ?? '-', widthType: 'half' },
        { label: '거래처 영문 축약명', value: partnerData?.prtEngSnm ?? '-', widthType: 'half' },
        { label: '사업자등록번호', value: partnerData?.prtRegNo ?? '-', widthType: 'half' },
        { label: '법인등록번호', value: partnerData?.prtCorpRegNo ?? '-', widthType: 'half' },
        { label: '업태', value: partnerData?.prtBizType ?? '-', widthType: 'half' },
        { label: '업종', value: partnerData?.prtBizCate ?? '-', widthType: 'half' },
        { label: '주소', value: `${partnerData?.prtAddr ?? '-'} ${partnerData?.prtAddrDtl ?? '-'}`, widthType: 'full' },
        { label: '대표자명', value: partnerData?.prtCeo ?? '-', widthType: 'half' },
        { label: '전화번호', value: partnerData?.prtTel ?? '-', widthType: 'half' },
        { label: '팩스번호', value: partnerData?.prtFax ?? '-', widthType: 'half' },
        { label: '이메일', value: partnerData?.prtEmail ?? '-', widthType: 'half' },
      ]);
    } else {
      setDrawerPrtItems([]);
    }

    if(partnerMngData !== null) {
      setDrawerMngItems([
        { label: '담당자명', value: partnerMngData?.prtMngNm ?? '-', widthType: 'full' },
        { label: '부서명', value: partnerMngData?.prtMngDeptNm ?? '-', widthType: 'half' },
        { label: '팀명', value: partnerMngData?.prtMngTeamNm ?? '-', widthType: 'half' },
        { label: '전화번호', value: partnerMngData?.prtMngTel ?? '-', widthType: 'half' },
        { label: '휴대번호', value: partnerMngData?.prtMngMobile ?? '-', widthType: 'half' },
        { label: '팩스번호', value: partnerMngData?.prtMngFax ?? '-', widthType: 'half' },
        { label: '이메일', value: partnerMngData?.prtMngEmail ?? '-', widthType: 'half' },
      ]);
    } else {
      setDrawerMngItems([]);
    }

    if(partnerData !== null || (partnerMngData && partnerMngData !== null)) {
      setNewPartnerData(partnerData);
      setOpen(true);
    }
  }, [partnerData, partnerMngData]);

  // Drawer 내 수정 클릭 시 거래처 설정
  const [ newPrtOpen, setNewPrtOpen ] = useState<boolean>(false);
  const [ newPartnerData, setNewPartnerData ] = useState<partnerRType | null>(null);

  // Drawer 내 수정 클릭 시 거래처 담당자 설정
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
      if(dataType === "prt")
        setNewPartnerData(prev => ({
          ...prev,
          [name]: {
            [key]: value,
          },
        } as partnerRType));
      else
        setNewPartnerMngData(prev => ({
          ...prev,
          [name]: {
            [key]: value,
          },
        } as partnerMngRType));
    } else {
      if(dataType === "prt")
        setNewPartnerData(prev => ({
          ...prev,
          [name]: value,
        } as partnerRType));
      else
        setNewPartnerMngData(prev => ({
          ...prev,
          [name]: value,
        } as partnerMngRType));
    }
  }
  
  // 거래처 설정 저장 시 실행 함수
  const handleSubmitPrtData = async () => {
    try {
      if((newPartnerData?.prtTel && !isValidTel(newPartnerData?.prtTel)) ||
        (newPartnerData?.prtEmail && !isValidEmail(newPartnerData.prtEmail))
      ) {
        showToast("올바른 형식을 입력해주세요.", "error");
        return;
      }
      const result = await patchAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner',
        jsx: 'jsxcrud'},
        partnerData?.id ?? '0',
        { prtTypeEm: 'cs',
          prtNm: newPartnerData?.prtNm,
          prtRegCd: newPartnerData?.prtRegCd,
          prtSnm: newPartnerData?.prtSnm,
          prtEngNm: newPartnerData?.prtEngNm,
          prtEngSnm: newPartnerData?.prtEngSnm,
          prtRegNo: newPartnerData?.prtRegNo,
          prtCorpRegNo: newPartnerData?.prtCorpRegNo,
          prtBizType: newPartnerData?.prtBizType,
          prtBizCate: newPartnerData?.prtBizCate,
          prtAddr: newPartnerData?.prtAddr,
          prtAddrDtl: newPartnerData?.prtAddrDtl,
          prtCeo: newPartnerData?.prtCeo,
          prtTel: newPartnerData?.prtTel,
          prtFax: newPartnerData?.prtFax,
          prtEmail: newPartnerData?.prtEmail } as partnerCUType
      );
      
      setOpen(false);
      setNewPrtOpen(false);
      submitEndFn?.();
      if(result.resultCode === "OK_0000") {
        prtSuccessFn?.();

        showToast("고객 정보가 성공적으로 수정되었습니다.", "success");
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
      }
    } catch(e) {
      console.log('catch error : ', e);
    }
  }

  // 드로워 닫힐 때 값 초기화
  useEffect(()=>{
    if(!open)           setNewPartnerData(null);
    if(!newPrtMngOpen)  setNewPartnerMngData(null);
  }, [open, newPrtMngOpen]);

  // 우편 번호 검색 버튼 클릭 이벤트
  const handleSearchAddress = () => {
    const w: any = window;
    const d: any = w.daum;
    new d.Postcode({
      oncomplete: function (data: any) {
        handlePrtDataChange('prt', data.roadAddress, 'prtAddr', 'other');
      },
    }).open();
  };

  return (
    <>
      <AntdDrawer
        open={open}
        close={onClose ? onClose : ()=>setOpen(false)}
        width={600}
      >
        <div className="flex flex-col gap-15 p-20 !pr-5">
          <div className="flex w-full justify-end cursor-pointer" onClick={() => setOpen(false)}><Close/></div>
          <CardList title="고객정보" 
            btnLabel={<div className="flex h-center gap-8"><span className="w-16 h-16"><Edit/></span> 고객 정보 수정</div>} 
            items={drawerPrtItems} btnClick={() => setNewPrtOpen(true)}/>
          {partnerMngData && <CardList title="담당자정보" 
            btnLabel={<div className="flex h-center gap-8"><span className="w-16 h-16"><Plus/></span> 담당자 추가</div>} 
            items={drawerMngItems} btnClick={() => setNewPrtMngOpen(true)}/>}
        </div>
      </AntdDrawer>

      <AntdEditModal
        open={newPrtOpen}
        setOpen={setNewPrtOpen}
        width={760}
        contents={<>
          <CardInputList title="고객정보 수정" 
            titleIcon={<Bag/>}
            btnLabel={
              <Button type="primary" size="large" onClick={handleSubmitPrtData}
                className="w-full flex h-center gap-8 !h-[50px]" 
                style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
                <TrArrow/>
                <span>저장</span>
              </Button>
              // <Button type="primary" size="large" onClick={handleSubmitPrtData} 
              //   className="w-full flex h-center gap-8 !h-full" 
              //   style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
              //   <TrArrow/>
              //   <span>저장</span>
              // </Button>
            }
            items={[
            { value:newPartnerData?.prtNm,
              name:'prtNm', label:'거래처명', type:'input', widthType:'full'},
            { value:newPartnerData?.prtRegCd,
              name:'prtRegCd', label:'식별코드', type:'input', widthType:'half' },
            { value:newPartnerData?.prtSnm,
              name:'prtSnm', label:'축약명', type:'input', widthType:'half' },
            { value:newPartnerData?.prtEngNm,
              name:'prtEngNm', label:'영문명', type:'input', widthType:'half' },
            { value:newPartnerData?.prtEngSnm,
              name:'prtEngSnm', label:'영문축약', type:'input', widthType:'half' },
            { value:newPartnerData?.prtRegNo,
              name:'prtRegNo', label:'사업자', type:'input', widthType:'half' },
            { value:newPartnerData?.prtCorpRegNo,
              name:'prtCorpRegNo', label:'법인', type:'input', widthType:'half' },
            { value:newPartnerData?.prtBizType,
              name:'prtBizType', label:'업태', type:'input', widthType:'half' },
            { value:newPartnerData?.prtBizCate,
              name:'prtBizCate',label:'업종', type:'input',widthType:'half' },
            { value:newPartnerData?.prtAddr,
              name:'prtAddr', label:'주소', type:'input', widthType:'full',
              fbtn:
              <Button type="primary" size="large" onClick={handleSearchAddress} 
                className="flex h-center gap-8 text-white !text-14 !h-32"
                style={{background: "#038D07"}}>
                <p className="w-16 h-16"><Search /></p>
                <span>우편번호</span>
              </Button> },
            { value:newPartnerData?.prtAddrDtl, placeholder: "세부 주소",
              name:'prtAddrDtl', type:'input', widthType:'full' },
            { value:newPartnerData?.prtCeo,
              name:'prtCeo', label:'대표자명', type:'input', widthType:'half' },
            { value:newPartnerData?.prtTel,
              name:'prtTel', label:'전화번호', type:'input', widthType:'half' },
            { value:newPartnerData?.prtFax,
              name:'prtFax', label:'팩스번호', type:'input', widthType:'half' },
            { value:newPartnerData?.prtEmail,
              name:'prtEmail', label:'이메일', type:'input', widthType:'half' },
            ]}
            handleDataChange={(e, name, type)=>handlePrtDataChange('prt', e, name, type)}
          />
        </>}
      />
      
      <PrtMngAddModal
        open={newPrtMngOpen}
        setOpen={setNewPrtMngOpen}
        handlePrtDataChange={handlePrtDataChange}
        partnerId={partnerId}
        newPartnerMngData={newPartnerMngData}
        submitEndFn={()=>{
          setOpen(false);
          setNewPrtMngOpen(false);
        }}
        prtMngSuccessFn={prtMngSuccessFn}
      />
      <ToastContainer />
    </>
  )
}

export default PrtDrawer;