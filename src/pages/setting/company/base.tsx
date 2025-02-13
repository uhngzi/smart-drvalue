import CardInputList from "@/components/List/CardInputList";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { MOCK } from "@/utils/Mock";
import { Button } from "antd";


import TrArrow from "@/assets/svg/icons/t-r-arrow.svg";
import Sign from "@/assets/png/signImage.png";
import PlaceHolderImg from "@/assets/png/placeholderImg.png";
import Search from "@/assets/svg/icons/s_search.svg";

import Image from "next/image";
const CompanyBaseListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {

  // 우편 번호 검색 버튼 클릭 이벤트
  const handleSearchAddress = () => {
    const w: any = window;
    const d: any = w.daum;
    new d.Postcode({
      oncomplete: function (data: any) {
        onInputChange();
      },
    }).open();
  };

  const companyInfo = [
    {value:'', name:'companyName', label:'회사명', type:'input', widthType:'full'},
    {value:'', name:'companyInitial', label:'회사명 약칭', type:'input', widthType:'half'},
    {value:'', name:'companyEnName', label:'영문 회사명', type:'input', widthType:'half'},
    {value:'', name:'companyBizNumq', label:'사업자등록번호', type:'input', widthType:'half'},
    {value:'', name:'companyRegNum', label:'법인등록번호', type:'input', widthType:'half'},
    {value:'', name:'companyType', label:'업태', type:'input', widthType:'half'},
    {value:'', name:'companyBiz', label:'업종', type:'input', widthType:'half'},
    {value:'', name:'companyCeo', label:'대표자명', type:'input', widthType:'half'},
    {value:'', name:'companyMainTel', label:'대표 전화번호', type:'input', widthType:'half'},
    {value:'', name:'companyMainFax', label:'대표 팩스번호', type:'btnInput', widthType:'half'},
    {value:'', name:'companyMainMail', label:'대표 이메일', type:'input', widthType:'half'},
    {value:'', name:'companyAddr', label:'주소', type:'input', widthType:'full',
      fbtn:
        <Button type="primary" size="large" onClick={handleSearchAddress} 
          className="flex h-center gap-8 text-white !text-14 !h-32"
          style={{background: "#038D07"}}>
          <p className="w-16 h-16"><Search /></p>
          <span>우편번호</span>
        </Button>
    },
    {value:'', name:'companyAddrDtl', type:'input', widthType:'full'},
  ]
  const companyTaxMng = [
      {value:'', name:'taxMngName', label:'담당자명', type:'btnInput', widthType:'third'},
      {value:'', name:'taxMngMail', label:'이메일', type:'input', widthType:'third'},
      {value:'', name:'taxMngTel', label:'전화번호', type:'input', widthType:'third'},
  ]

  

  function onInputChange(){

  }

  return (
    <section className="flex flex-col gap-40">
      <div>
        <p className="text-18 font-bold pb-10 pl-10">회사 정보</p>
        <CardInputList title="" styles={{gap:"gap-20"}} items={companyInfo} handleDataChange={onInputChange}/>
      </div>
      <div>
        <p className="text-18 font-bold pb-10 pl-10">세금계산서 담당자</p>
        <CardInputList title="" styles={{gap:"gap-20"}} items={companyTaxMng} handleDataChange={onInputChange}/>
      </div>
      <div>
        <p className="text-18 font-bold pb-10 px-10 v-between-h-center">
          <span>회사직인</span>
          <Button icon={<Image src={Sign} width={16} height={16} alt="sign"/>}>직인 등록</Button>
        </p>
        <div className="rounded-8 h-[300px] bg-[#F2F1ED]" style={{border:'1px solid #d9d9d9'}}>
          <div className="w-[730px] h-[240px] bg-white rounded-tl-[8px] relative" style={{boxShadow:'0px 4px 4px 0px #00000040'}}>
            <span className="text-24 font-bold absolute" style={{color:'#d9d9d9', top:'100px', right:'275px'}}>서명 (인)</span>
            <div className="absolute" style={{top:60, right:60}}>
              <Image src={PlaceHolderImg} width={120} height={120} alt="placeholder"/>
            </div>
          </div>

        </div>
      </div>
      <div className="h-[50px]">
        <Button type="primary" size="large" onClick={()=>{}} 
          className="w-full flex h-center gap-8 !h-full" 
          style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
          <TrArrow/>
          <span>저장</span>
        </Button>
      </div>
    </section>
  )
}

CompanyBaseListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default CompanyBaseListPage;