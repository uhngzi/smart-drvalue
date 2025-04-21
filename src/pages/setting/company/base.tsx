import CardInputList from "@/components/List/CardInputList";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { MOCK } from "@/utils/Mock";
import { Button, Spin } from "antd";
import { postAPI } from "@/api/post";

import TrArrow from "@/assets/svg/icons/t-r-arrow.svg";
import Sign from "@/assets/png/signImage.png";
import PlaceHolderImg from "@/assets/png/placeholderImg.png";
import Search from "@/assets/svg/icons/s_search.svg";

import Image from "next/image";
import { companyType, newDataCompanyType, setDataCompanyType } from "@/data/type/base/company";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import { patchAPI } from "@/api/patch";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdModal from "@/components/Modal/AntdModal";
import AntdDragger from "@/components/Upload/AntdDragger";

const CompanyBaseListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {

  const [postalCode, setPostalCode] = useState<string>('');
  const [ dataLoading, setDataLoading ] = useState<boolean>(false);
  const [ data, setData ] = useState<companyType>(newDataCompanyType);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['setting', 'company', 'base'],
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'company-default/jsxcrud/one'
      });

      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? {});
        // 회사 직인 정보가 있을 경우 파일 정보 가져오기
        if (result.data?.data?.signFileId) {
          await fetchSignFileInfo(result.data?.data?.signFileId);
        }
      } else {
        console.log('error:', result.response);
      }

      setDataLoading(false);
      console.log(result.data);
      return result;
    },
  });

  // 우편 번호 검색 버튼 클릭 이벤트
  const handleSearchAddress = () => {
    const w: any = window;
    const d: any = w.daum;
    new d.Postcode({
      oncomplete: function (map: any) {
        handleDataChange(map.address, 'address', 'select');
        setPostalCode(map.zonecode);
        // setData({...data, postalCode: map.zonecode});
      },
    }).open();
  };

  const companyInfo = [
    {value: data?.companyName, name:'companyName', label:'회사명', type:'input', widthType:'full'},
    {value: data?.companyKorAlias, name:'companyKorAlias', label:'회사명 약칭', type:'input', widthType:'half'},
    {value: data?.companyEngName, name:'companyEngName', label:'영문 회사명', type:'input', widthType:'half'},
    {value: data?.businessRegNo, name:'businessRegNo', label:'사업자등록번호', type:'input', widthType:'half'},
    {value: data?.corpRegNo, name:'corpRegNo', label:'법인등록번호', type:'input', widthType:'half'},
    {value: data?.bizCondition, name:'bizCondition', label:'업태', type:'input', widthType:'half'},
    {value: data?.bizType, name:'bizType', label:'업종', type:'input', widthType:'half'},
    {value: data?.ceoName, name:'ceoName', label:'대표자명', type:'input', widthType:'half'},
    {value: data?.ceoPhone, name:'ceoPhone', label:'대표 전화번호', type:'input', widthType:'half'},
    {value: data?.ceoFax, name:'ceoFax', label:'대표 팩스번호', type:'input', widthType:'half'},
    {value: data?.ceoEmail, name:'ceoEmail', label:'대표 이메일', type:'input', widthType:'half'},
    {value: data?.address, name:'address', label:'주소', type:'input', widthType:'full',
      fbtn:
        <Button type="primary" size="large" onClick={handleSearchAddress} 
          className="flex h-center gap-8 text-white !text-14 !h-32"
          style={{background: "#038D07"}}>
          <p className="w-16 h-16"><Search /></p>
          <span>우편번호</span>
        </Button>
    },
    {value:data?.detailAddress, name:'detailAddress', type:'input', widthType:'full'},
  ]
  const companyTaxMng = [
      {value:data?.taxManagerName, name:'taxManagerName', label:'담당자명', type:'input', widthType:'third'},
      {value:data?.taxManagerEmail, name:'taxManagerEmail', label:'이메일', type:'input', widthType:'third'},
      {value:data?.taxManagerPhone, name:'taxManagerPhone', label:'전화번호', type:'input', widthType:'third'},
  ]

  //회사 직인 등록
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [signFileList, setSignFileList] = useState<any[]>([]);
  const [signFileIdList, setSignFileIdList] = useState<string[]>([]);
  const [signImagePreview, setSignImagePreview] = useState<string | null>(null);

  // 직인 이미지 정보 가져오기
  const fetchSignFileInfo = async (fileId: string) => {
    if (!fileId) return;
    
    try {
      const result = await getAPI({
        type: 'file-mng',
        url: `every/file-manager/default/info/${fileId}`,
        header: true,
      });
      
      if (result.resultCode === "OK_0000") {
        const entity = result?.data?.fileEntity;
        const fileInfo = {
          ...entity,
          name: entity?.originalName,
          originFileObj: {
            name: entity?.originalName,
            size: entity?.size,
            type: entity?.type,
          }
        };
        
        setSignFileList([fileInfo]);
        setSignFileIdList([fileId]);
        
        // 이미지 URL 설정 (실제 구현에서는 이미지 URL 생성 방식에 맞게 조정 필요)
        if (entity?.objectName) {
          setSignImagePreview(`/api/file-mng/download/${entity.objectName}`);
        }
      }
    } catch (error) {
      console.error("직인 이미지 정보 조회 실패:", error);
    }
  };

  // 직인 파일 ID가 변경될 때마다 데이터 업데이트
  useEffect(() => {
    if (signFileIdList.length > 0) {
      setData(prev => ({...prev, signFileId: signFileIdList[0]}));
    }
  }, [signFileIdList]);

  // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<AlertType>('info');
  const [ resultTitle, setResultTitle ] = useState<string>('');
  const [ resultText, setResultText ] = useState<string>('');
  function setResultFunc(type: AlertType, title: string, text: string) {
    setResultOpen(true);
    setResultType(type);
    setResultTitle(title);
    setResultText(text);
  }

  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string,
  ) => {
    if(type === "input" && typeof e !== "string") {
      const { value } = e.target;
      setData({...data, [name]: value});
    } else if(type === "select") {
      if(key) {
        setData({...data, [name]: { 
          ...((data as any)[name] || {}), // 기존 객체 값 유지
          [key]: e?.toString(), // 새로운 key 값 업데이트
        }});
      } else {
        setData({...data, [name]: e});
      }
    }
  }

  const handleSubmitNewData = async () => {
    try {
      const newData = setDataCompanyType({
        ...data, 
        postalCode, 
        signFileId: signFileIdList[0] ?? null,
      });
      
      const result = await patchAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'company-default/jsxcrud/update',
        jsx: 'jsxcrud',
        etc: true,
      },'', newData);
      console.log(result);

      if(result.resultCode === 'OK_0000') {
        setResultFunc('success', '회사 정보 수정 성공', '회사 정보 수정이 완료되었습니다.');
      } else {
        setResultFunc('error', '회사 정보 수정 실패', '회사 정보 수정을 실패하였습니다.');
      }
    } catch(e) {
      setResultFunc('error', '회사 정보 등록 실패', '회사 정보 등록을 실패하였습니다.');
    }
  }

  // 파일 업로드 핸들러
  const handleFileUpload = async () => {
    if (signFileList.length === 0) {
      setResultFunc('warning', '파일 없음', '직인 이미지를 등록해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      signFileList.forEach(file => {
        formData.append("files", file.originFileObj); // ✅ 여기서 "files"로 key 맞춰야 Swagger랑 호환됨
      });
       // 드래그 컴포넌트에서의 실제 파일
      formData.append("type", "SIGN_IMAGE"); // 파일 타입 설정

      const result = await postAPI({
        type: "file-mng",
        utype: "tenant/",
        url: "file-manager/upload/multiple",
        etc: true,
        jsx: "jsxcrud"
      }, formData);

      if (result.resultCode === "OK_0000") {
        const uploadedIds = result.data?.map((file: any) => file?.fileId) ?? [];
        setSignFileIdList(uploadedIds); // 서버에서 받은 ID 저장
        
        // 업로드된 파일 정보로 미리보기 URL 설정
        if (result.data && result.data.length > 0 && result.data[0].objectName) {
          setSignImagePreview(`/api/file-mng/download/${result.data[0].objectName}`);
        }
        
        setResultFunc("success", "업로드 완료", "직인 이미지가 성공적으로 등록되었습니다.");
        setUploadModalOpen(false);
      } else {
        setResultFunc("error", "업로드 실패", "직인 이미지 등록 중 문제가 발생했습니다.");
        console.log(signFileList[0]);
      }
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      setResultFunc("error", "업로드 실패", "직인 이미지 등록 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      {dataLoading && 
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..."/>
        </div>
      }
      {!dataLoading && (
        <section className="flex flex-col gap-40">
          <div>
            <p className="text-18 font-bold pb-10 pl-10">회사 정보</p>
            <CardInputList title="" styles={{gap:"gap-20"}} items={companyInfo} handleDataChange={handleDataChange}/>
          </div>
          <div>
            <p className="text-18 font-bold pb-10 pl-10">세금계산서 담당자</p>
            <CardInputList title="" styles={{gap:"gap-20"}} items={companyTaxMng} handleDataChange={handleDataChange}/>
          </div>
          <div>
            <p className="text-18 font-bold pb-10 px-10 v-between-h-center">
              <span>회사직인</span>
              <Button icon={<Image src={Sign} width={16} height={16} alt="sign"/>} onClick={() => setUploadModalOpen(true)}>직인 등록</Button>
            </p>
            <div className="rounded-8 h-[300px] bg-[#F2F1ED]" style={{border:'1px solid #d9d9d9'}}>
              <div className="w-[730px] h-[240px] bg-white rounded-tl-[8px] relative" style={{boxShadow:'0px 4px 4px 0px #00000040'}}>
                <span className="text-24 font-bold absolute" style={{color:'#d9d9d9', top:'100px', right:'275px'}}>서명 (인)</span>
                <div className="absolute" style={{top:60, right:60}}>
                  {signImagePreview ? (
                    <Image src={signImagePreview} width={120} height={120} alt="company signature" />
                  ) : (
                    <Image src={PlaceHolderImg} width={120} height={120} alt="placeholder" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="h-[50px]">
            <Button type="primary" size="large" onClick={handleSubmitNewData} 
              className="w-full flex h-center gap-8 !h-full" 
              style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
              <TrArrow/>
              <span>저장</span>
            </Button>
          </div>
        </section>
      )}
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
        }}
        hideCancel={true}
        theme="base"
      />

      <AntdModal
        open={uploadModalOpen}
        setOpen={setUploadModalOpen}
        width={600}
        title="직인 이미지 등록"
        contents={
          <div className="flex flex-col gap-20 p-20">
            <AntdDragger
              fileList={signFileList}
              setFileList={setSignFileList}
              fileIdList={signFileIdList}
              setFileIdList={setSignFileIdList}
              mult={false} // 단일 이미지만 업로드
              beforeUpload={(file) => {
                // 파일 객체를 저장하여 이후 업로드 시 사용할 수 있도록 합니다.
                (file as any).originFileObj = file;
                return false;
              }}
            />
            <Button
              type="primary"
              onClick={handleFileUpload}
            >
              등록
            </Button>
          </div>
        }
      />
    </>
  )
}

CompanyBaseListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}>{page}</SettingPageLayout>
)

export default CompanyBaseListPage;