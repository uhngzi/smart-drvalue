import InputList from "@/components/List/InputList";
import { cuCUType, newDataCuType } from "@/data/type/base/cu";

interface Props {
  handleDataChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
  ) => void;
  newData: any;
  handleSubmitNewData: () => void;
  setNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewData: React.Dispatch<React.SetStateAction<cuCUType>>;
}

const AddContents: React.FC<Props> = ({ 
  handleDataChange, 
  newData,
  handleSubmitNewData,
  setNewOpen,
  setNewData
}) => {
  return (
    <>
      <form className="p-30 rounded-14 bg-white">
        <InputList
          handleDataChange={handleDataChange}
          labelWidth={100}
          items={[
            {name:'prtNm',label:'거래처명',type:'input',value:newData.prtNm},
            {name:'prtRegCd',label:'식별코드',type:'input',value:newData.prtRegCd,inputType:'number'},
            {name:'prtSnm',label:'축약명',type:'input',value:newData.prtSnm},
            {name:'prtEngNm',label:'영문명',type:'input',value:newData.prtEngNm},
            {name:'prtEngSnm',label:'영문 축약명',type:'input',value:newData.prtEngSnm},
            {name:'prtRegNo',label:'사업자등록번호',type:'input',value:newData.prtRegNo},
            {name:'prtCorpRegNo',label:'법인등록번호',type:'input',value:newData.prtCorpRegNo},
            {name:'prtBizType',label:'업태',type:'input',value:newData.prtBizType},
            {name:'prtBizCate',label:'업종',type:'input',value:newData.prtBizCate},
            {name:'prtAddr',label:'주소',type:'input',value:newData.prtAddr},
            {name:'prtAddrDtl',label:'상세주소',type:'input',value:newData.prtAddrDtl},
            {name:'prtZip',label:'우편번호',type:'input',value:newData.prtZip},
            {name:'prtCeo',label:'대표자명',type:'input',value:newData.prtCeo},
            {name:'prtTel',label:'전화번호',type:'input',value:newData.prtTel},
            {name:'prtFax',label:'팩스번호',type:'input',value:newData.prtFax},
            {name:'prtEmail',label:'이메일',type:'input',value:newData.prtEmail},
            {name:'emp',label:'담당자',type:'select',option:[{value:"1",label:"담당자1"},{value:"2",label:"담당자2"},],value:newData.emp?.id},
          ]}
        />
      </form>
      <div className="w-full h-100 v-h-center gap-10">
        <div
          className="w-80 h-30 v-h-center rounded-6 border-1 border-line bg-white cursor-pointer"
          onClick={()=>{
            setNewData(newDataCuType);
            setNewOpen(false);
          }}
        >
          취소
        </div>
        <div
          className="w-80 h-30 v-h-center rounded-6 bg-[#03C75A] text-white cursor-pointer"
          onClick={handleSubmitNewData}
        >
          등록
        </div>
      </div>
    </>
  )
}

export default AddContents;