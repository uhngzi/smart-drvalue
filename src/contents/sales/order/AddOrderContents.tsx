import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdDragger from "@/components/Upload/AntdDragger";

import Edit from "@/assets/svg/icons/memo.svg"
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import MessageOn from "@/assets/svg/icons/s_inquiry.svg";
import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";
import Close from "@/assets/svg/icons/s_close.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";

import { SetStateAction, useState } from "react";
import { LabelIcon, LabelMedium, LabelThin } from "@/components/Text/Label";
import { newDataSalesOrderCUType, salesOrderCUType, salesOrderReq } from "@/data/type/sales/order";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import { HotGrade } from "@/data/type/enum";
import TextArea from "antd/lib/input/TextArea";
import { Button, Empty, Radio } from "antd";
import { partnerMngRType } from "@/data/type/base/partner";
import dayjs from "dayjs";
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import PrtMngAddModal from "@/contents/partner/PrtMngAddModal";
import { inputTel } from "@/utils/formatPhoneNumber";
import { inputFax } from "@/utils/formatFax";

interface Props {
  csList: Array<{value:any,label:string}>;
  formData: salesOrderCUType;
  setFormData: React.Dispatch<SetStateAction<salesOrderCUType>>;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  fileList: any[];
  setFileList: React.Dispatch<SetStateAction<any[]>>;
  fileIdList: string[];
  setFileIdList: React.Dispatch<SetStateAction<string[]>>;
  csMngList: partnerMngRType[];
  setCsMngList: React.Dispatch<SetStateAction<partnerMngRType[]>>;
  stepCurrent: number;
  setStepCurrent: React.Dispatch<SetStateAction<number>>;
  setEdit: React.Dispatch<SetStateAction<boolean>>;
  handleEditOrder: () => void;
}

const AddOrderContents: React.FC<Props> = ({
  csList,
  formData,
  setFormData,
  setOpen,
  fileList,
  setFileList,
  fileIdList,
  setFileIdList,
  csMngList,
  setCsMngList,
  stepCurrent,
  setStepCurrent,
  setEdit,
  handleEditOrder,
}) => {
  const { showToast, ToastContainer } = useToast();

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
    <>
      <div className={`w-[1240px] flex flex-col p-30 gap-20 border-bdDefault border-[0.3px] rounded-14 bg-white`}>
        <LabelMedium label="고객발주 등록"/>
        <div className="w-full h-1 border-t-1"/>
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
          <div className="w-1 h-full border-r-1"/>
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
      <div className="w-[1240px] min-h-[200px] bg-white flex flex-col rounded-14 border-[0.3px] border-bdDefult mt-10 px-30 py-20 gap-10">
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
        <div className="w-full h-1 border-t-1"/>
        { csMngList.length < 1 && <Empty /> }
        {
          csMngList.map((mng:partnerMngRType) => (
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
          ))
        }
      </div>
      <div className="flex w-[1240px] h-50 v-between-h-center">
        <Button 
          className="w-80 h-32 rounded-6"
          style={{color:"#444444E0"}}
          onClick={() => {
            setOpen(false);
            setFormData(newDataSalesOrderCUType)
            setEdit(false);
          }}
        >
          <Close/> 취소
        </Button>
        {stepCurrent < 1 ?
          <Button 
            className="w-109 h-32 bg-point1 text-white rounded-6"
            style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
            onClick={()=>{
              const orderVal = validReq(formData, salesOrderReq());
              if(!orderVal.isValid) {
                showToast(orderVal.missingLabels+'은(는) 필수 입력입니다.', "error");
              } else {
                setStepCurrent(1);
              }
            }}
          >
            <Arrow />다음 단계
          </Button> :
          <Button 
            className="w-109 h-32 bg-point1 text-white rounded-6"
            style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
            onClick={handleEditOrder}
          >
            <Arrow /> 수정
          </Button>
          }
      </div>

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
        }}
      />
      <ToastContainer />
    </>
  )
}

export default AddOrderContents;
