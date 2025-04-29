import React, { JSX, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Input, Select } from "antd";

import Calendar from "@/assets/svg/icons/newcalendar.svg";
import Search from "@/assets/svg/icons/s_search.svg";
import Hint from "@/assets/svg/icons/hint.svg";

import dayjs from "dayjs";
import styled from "styled-components";
import AntdEditModal from "./AntdEditModal";
import AntdAlertModal from "./AntdAlertModal";
import { inputTel, isValidTel } from "@/utils/formatPhoneNumber";
import { isValidEmail } from "@/utils/formatEmail";
import { inputFax } from "@/utils/formatFax";
import { isValidEnglish, formatEnglish } from "@/utils/formatEnglish";
import { useQuery } from "@tanstack/react-query";
import { getPrtCsAPI } from "@/api/cache/client";
import { partnerRType } from "@/data/type/base/partner";
import useToast from "@/utils/useToast";
import { set } from "lodash";

interface Option {
  value: string | number | boolean ;
  label: string;
  children?: Option[];
}

interface Item {
  name: string; // data를 처리할때 사용될 key값
  label?: string; // input 위에 표시될 label
  type: string; // input, date, address, custom
  inputType?: string; // input의 type
  option?: Option[]; // select의 option
  child?: string; // select의 child key값
  isChild?: boolean; // select의 child 여부
  widthType: string; // full: 한 줄 차지, half: 2개씩 나열 third: 3개씩 나열
  placeholder?: string; // input의 placeholder
  customhtml?: React.ReactNode;
  key?: string,
  disabled?: boolean;
}

interface CardInputListProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  popWidth?: number;
  title: {name: string, icon: React.ReactNode};
  items: Item[];
  data?: { [key: string]: any };
  onSubmit: (newData: any) => void;
  onDelete: (id: string) => void;
  styles?: {
    gap?: string;
    bg?: string;
    pd?: string;
  }
  addCustom?: JSX.Element;
  handleDataChange?:(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: "input" | "select" | "date" | "other",
    key?: string
  ) => void
}

/**
 * BaseInfoCUDModal 컴포넌트는 전체 페이지에서 팝업으로 진행되는 생성(Create), 업데이트(Update), 삭제(Delete) 작업을 처리합니다.
 * 
 * @param {CardInputListProps} props - 컴포넌트의 props.
 * @param {boolean} props.open - 모달이 열려 있는지 여부.
 * @param {function} props.setOpen - open 상태를 설정하는 함수.
 * @param {function} props.onClose - 모달을 닫는 함수.
 * @param {number} props.popWidth - 모달의 너비.
 * @param {string} props.title - 모달의 제목.
 * @param {Array} props.items - 모달 내에 표시되거나 처리될 항목 배열.
 * @param {Object} [props.data={}] - 모달의 초기 데이터, 기본값은 빈 객체이며 data의 키값과 items의 name이 일치해야 함.
 * @param {function} props.onSubmit - 모달의 폼 또는 데이터를 제출하는 함수.
 * @param {function} props.onDelete - 모달 안에 데이터를 삭제할때 사용하는 함수
 * @param {Object} props.styles - 모달의 커스텀 스타일.
 * @param {JSX.Element} props.addCustom - 모달에 추가적인 커스텀 컴포넌트.
 * 
 * @returns {JSX.Element} 렌더링된 BaseInfoCUDModal 컴포넌트.
 */

const BaseInfoCUDModal: React.FC<CardInputListProps> = (
  {open, setOpen, onClose, popWidth, title, items, data={}, onSubmit, onDelete, styles, addCustom, handleDataChange}: CardInputListProps
): JSX.Element => {
  const {showToast, ToastContainer} = useToast();

  const [ifChildList, setIfChildList] = useState<any>([]); // select의 child data

  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const dataRef = useRef<{ [key: string]: any }>({})
  const getData = () => ({...dataRef.current})

  function setData (field:string, value:any) {
    dataRef.current[field] = value
  }
  useEffect(() => {
    dataRef.current = data
    items.forEach((item) => {
      if (item.type === "select" && item?.child) {
        const childData = item.option?.find((f) => f.value === data[item.name])?.children;
        setIfChildList(childData)
      }
    })
  },[data]);

  const [formData, setFormData] = useState<{ [key: string]: any }>(data);

  useEffect(()=>{
    setFormData(data);
  }, [data])
  
  function handleInputChange(itemName: string, newValue: string) {
    let value = newValue;
    if(itemName.toLowerCase().includes("tel") || itemName.toLowerCase().includes("mobile")) {
      value = inputTel(value);
    } else if (itemName.toLowerCase().includes("fax")) {
      value = inputFax(value);
    }
    setFormData(prev => ({ ...prev, [itemName]: value }));
    setData(itemName, value);
  }

  const handleSearchAddress = (key: string) => {
    const w: any = window;
    const d: any = w.daum;
    new d.Postcode({
      oncomplete: function (data: any) {
      const inputElement = document.querySelector<HTMLInputElement>(`input[name="${key}"]`);
      if (inputElement) {
        inputElement.value = data.roadAddress;  // input의 value 속성을 변경해야 반영됨
      }
      setData(key, data.roadAddress);
      setFormData(prev => ({ ...prev, [key]: data.roadAddress }));

      setData("prtZip", data.zonecode);
      setFormData(prev => ({ ...prev, prtZip: data.zonecode }));
      },
    }).open();
  };

  const { data:cs } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });
  const [cdChk, setCdChk] = useState<boolean>(false);

  return (
    <>
    <AntdEditModal
      draggable={true}
      open={open}
      width={popWidth || 600}
      setOpen={setOpen}
      onClose={onClose}
      contents={
        <StyledCardInputList 
          $bg={styles?.bg ? styles.bg : "#F8F8FA"}
          $pd={styles?.pd ? styles.pd : "20px"}
          className="p-10 flex flex-col gap-10">

          <div className="w-full flex justify-between items-center h-[50px]">
            <div className="flex items-center gap-10">
                {title.icon}
              <p className="text-16 font-medium">{title.name}</p>
            </div>
          </div>
          {/* 정보 섹션 */}
          <section className="rounded-lg border border-[#D9D9D9]">
              {/* Grid 구조로 동적 배치 */}
              <div className={`grid grid-cols-1 md:grid-cols-6 ${styles?.gap ?? 'gap-10'}`}>
                {items.map((item, index) => (
                  <div
                    key={index} // index를 key로 사용
                    className={` ${
                      item.widthType === "full" ? "col-span-6" :
                      item.widthType === "half" ? "col-span-3" :
                      item.widthType === "third" ? "col-span-2" :
                      "col-span-1"
                    }`}
                  >
                    { item.label ? <p className="pb-8">{item.label}</p> : <p className="pt-5"></p>}
                    <div className="h-center gap-10" style={{marginTop: item.label ? 0 : -10}}>
                      {item.type === "address" && (
                        <>
                          <Button type="primary" size="large" onClick={() => handleSearchAddress(item.name)} 
                            className="flex h-center gap-8 text-white !text-14 !h-32"
                            style={{background: "#038D07"}}>
                            <p className="w-16 h-16"><Search /></p>
                            <span>우편번호</span>
                          </Button>
                          
                          <Input 
                            name={item.name}
                            key={item.name}
                            value={formData[item.name] || ''}                          
                            placeholder={item?.placeholder}
                            readOnly={true}
                          />
                        </>
                      )}
                      {item.type === "input" && (
                        <Input 
                          name={item.name}
                          value={formData[item.name] || ''}
                          onChange={(e) => {
                            // ....

                            handleDataChange?.(e, item.name, "input", item?.key);
                            handleInputChange(item.name, e.target.value);
                            if(item.name === "prtRegCd") {
                              const csData = (cs?.data?.data as partnerRType[]).find(f=> f.prtRegCd === Number(e.target.value))
                              
                              setCdChk(!!csData); // csData가 존재하면 true, 아니면 false

                              /*if(csData)  setCdChk(true);
                              else        setCdChk(false);*/
                            }/* else {
                              setCdChk(false);
                            }*/
                          }}
                          placeholder={item.placeholder} type={item.inputType ?? "string"}
                          disabled={item.disabled}
                        />
                      )}
                      {item.type === "password" && (
                        <Input.Password 
                          name={item.name}
                          value={formData[item.name] || ''}
                          onChange={(e) => {
                            setData(item.name, e.target.value);
                            setFormData(prev => ({ ...prev, [item.name]: e.target.value }));
                            handleDataChange?.(e, item.name, "input");
                          }}
                          placeholder={item.placeholder}
                          disabled={item.disabled}
                        />
                      )}
                      {item.type === "select" && (
                        <Select 
                          className="w-full"
                          options={item.isChild ? ifChildList : item.option}
                          key={item?.isChild ? ifChildList?.[0]?.value : item.name.includes(".") ? formData[item.name.split(".")[0]]?.id : (formData[item.name] || null)}
                          defaultValue={item.name.includes(".") ? formData[item.name.split(".")[0]]?.id : (item?.isChild ? ifChildList?.find((c:any) => c.value === formData[item.name])?.label : formData[item.name] !== undefined ? formData[item.name] : null)}
                          onChange={(value) => {
                            setData(item.name, value)
                            setFormData(prev => ({ ...prev, [item.name]: value }));
                            console.log("🔄 select changed:", item.name, value);
                            handleDataChange?.(value, item.name, "select");
                            if (item.name === 'material') {
                              setData('matNm', value);
                              setFormData(prev => ({ ...prev, matNm: value }));
                            }
                        
                            if (item.child) {
                              const childData = item.option?.find((f) => f.value === value)?.children;
                              setIfChildList(childData);
                            }
                          }}
                          disabled={item.disabled}
                        />
                      )}
                      {item.type === "mSelect" && (
                        <Select 
                          mode="multiple"
                          className="w-full"
                          options={item.option}
                          key={formData[item.name]}
                          defaultValue={formData[item.name]}
                          onChange={(value) => {
                            setData(item.name, value);
                            handleDataChange?.(value, item.name, "select");
                          }}
                          disabled={item.disabled}
                        />
                      )}
                      {}
                      {item.type === "date" && (
                        <DatePicker
                          key={formData[item.name]}
                          placeholder={item?.placeholder}
                          className="w-full !rounded-0 h-32"
                          onChange={(value) => {
                            setData(item.name, dayjs(value).format("YYYY-MM-DD"));
                            setFormData(prev => ({ ...prev, [item.name]: value }));
                            handleDataChange?.(value+"", item.name, "date");
                          }}
                          defaultValue={formData[item.name] ? dayjs(formData[item.name]) : null}
                          suffixIcon={<Calendar/>}
                          disabled={item.disabled}
                        />
                      )}
                      {item.type === "custom" && (
                        <>{item.customhtml}</>
                      )}
                    </div>
                    { // 이메일 형식 체크
                      formData[item?.name] && item.name.toLowerCase().includes("email") && !isValidEmail(formData[item?.name]?.toString()) ?
                      <div className="h-center gap-3 text-[red]">
                        <p className="w-15 h-15"><Hint/></p>
                        올바르지 않은 이메일입니다.
                      </div> :
                      // 전화번호 형식 체크
                      formData[item?.name] && (item.name.toLowerCase().includes("tel")
                      || item.name.toLowerCase().includes("mobile"))
                      && !isValidTel(formData[item?.name]?.toString()) ? 
                        <div className="h-center gap-3 text-[red]">
                          <p className="w-15 h-15"><Hint/></p>
                          올바르지 않은 전화번호입니다.
                        </div> :
                      // 식별코드 체크
                      item.name.toLowerCase().includes("prtregcd") && cdChk ?
                      <div className="h-center gap-3 text-[red]">
                        <p className="w-15 h-15"><Hint/></p>
                        이미 존재하는 식별코드입니다.
                      </div> :
                      // 영문 입력 체크
                      formData[item?.name] &&
                      (["mtEnm", "prtEngNm", "prtEngSnm"].includes(item.name)) &&
                      !isValidEnglish(formData[item?.name]?.toString())?
                      <div className="h-center gap-3 text-[red]">
                        <p className="w-15 h-15"><Hint/></p>
                        영문만 입력 가능합니다.
                      </div> :
                      <></>
                    }
                  </div>
                ))}
              </div>
          </section>
          {addCustom ? addCustom : <></>}
          {data?.id ? (
            <div className="flex gap-10">
              <Button type="primary" size="large"
                onClick={()=>{
                  if(cdChk) {
                    showToast("이미 존재하는 식별코드입니다.", "error");
                    return;
                  }
                  onSubmit(getData());
                }}
                className="w-full flex h-center gap-8 !h-[50px]" 
                style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
                <span>수정</span>
              </Button>
              <Button type="primary" size="large" onClick={()=> setDeleteConfirm(true)}
                className="w-full flex h-center gap-8 !h-[50px]" 
                style={{background: '#e76735'}}
              >
                <span>삭제</span>
              </Button>
            </div>
          ) : (
            <Button type="primary" size="large"
              onClick={()=>{
                if(cdChk) {
                  showToast("이미 존재하는 식별코드입니다.", "error");
                  return;
                }
                onSubmit(getData())
              }}
              className="w-full flex h-center gap-8 !h-[50px]" 
              style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
              <span>등록</span>
            </Button>
            
          )}
          <AntdAlertModal
            open={deleteConfirm}
            setOpen={setDeleteConfirm}
            type="warning"
            title="경고"
            contents="데이터를 삭제하시겠습니까?."
            okText="삭제"
            cancelText="취소"
            onOk={()=> {setDeleteConfirm(false); onDelete(getData()?.id)}}
          />
        </StyledCardInputList>
      }
      />
      <ToastContainer/>
      </>
  );
};

const StyledCardInputList = styled.div<{
  $bg: string;
  $pd: string;
}>`
  & > section {
    background: ${({ $bg }) => $bg};
    padding: ${({ $pd }) => $pd};
  }
  
`

export default BaseInfoCUDModal;