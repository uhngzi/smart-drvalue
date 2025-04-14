import dayjs from "dayjs";
import { useRouter } from "next/router";
import { List, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { getPrtSupAPI } from "@/api/cache/client";

import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { DividerH } from "@/components/Divider/Divider";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";

import PrtMngAddModal from "@/contents/partner/PrtMngAddModal";

import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import { ListPagination } from "@/layouts/Body/Pagination";
import MainPageLayout from "@/layouts/Main/MainPageLayout";

import { useUser } from "@/data/context/UserContext";
import { companyType } from "@/data/type/base/company";
import { selectType } from "@/data/type/componentStyles";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { buyOrderDetailType, buyOrderType } from "@/data/type/buy/cost";
import { wkDetailType, wkPlanWaitType, wkProcsType } from "@/data/type/wk/plan";
import { BuyOrderClmn } from "@/data/columns/Buy";
import { materialGroupBadType, materialPriceType } from "@/data/type/base/material_back";
import { newDataPartnerType, partnerCUType, partnerMngRType, partnerRType } from "@/data/type/base/partner";

import { MOCK } from "@/utils/Mock";
import useToast from "@/utils/useToast";
import { inputFax } from "@/utils/formatFax";
import { isValidEmail } from "@/utils/formatEmail";
import { exportToExcelAndPrint } from "@/utils/exportToExcel";
import { inputTel, isValidTel } from "@/utils/formatPhoneNumber";
import { handleDirectPrint } from "@/utils/printOrderForm";

import Bag from "@/assets/svg/icons/bag.svg";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import { useMenu } from "@/data/context/MenuContext";
import cookie from "cookiejs";

const BuyOrderPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me, meLoading } = useUser();
  const { selectMenu } = useMenu();
  const { showToast, ToastContainer } = useToast();

  // 발주 상세 또는 등록 저장 값
  const [ order, setOrder ] = useState<buyOrderType | null>(null);
  
  // ------------- 페이지네이션 세팅 ------------ 시작
  const [searchs, setSearchs] = useState<string>("");
  const [sQueryJson, setSQueryJson] = useState<string>("");
  useEffect(()=>{
    if(searchs.length < 2)  setSQueryJson("");
  }, [searchs])
  const handleSearchs = () => {
    if(searchs.length < 2) {
      showToast("2글자 이상 입력해주세요.", "error");
      return;
    }
    // url를 통해 현재 메뉴를 가져옴
    const jsx = selectMenu?.children?.find(f=>router.pathname.includes(f.menuUrl ?? ""))?.menuSearchJsxcrud;
    if(jsx) {
      setSQueryJson(jsx.replaceAll("##REPLACE_TEXT##", searchs));
    } else {
      setSQueryJson("");
    }
  }

  const handlePageMenuClick = (key:number)=>{
    const clmn = BuyOrderClmn(totalData, pagination, setOrderDocumentFormOpen, setOrder, router)
    .map((item) => ({
      title: item.title?.toString() as string,
      dataIndex: item.dataIndex,
      width: Number(item.width ?? item.minWidth ?? 0),
      cellAlign: item.cellAlign,
    }));

    if(key === 1) { // 엑셀 다운로드
      exportToExcelAndPrint(clmn, data, totalData, pagination, "구매 및 발주", "excel", showToast, "request/material", "core-d2");
    } else {        // 프린트
      exportToExcelAndPrint(clmn, data, totalData, pagination, "구매 및 발주", "print", showToast);
    }
  }
  // ------------- 페이지네이션 세팅 ------------ 끝

  // ------------ 구매처 데이터 세팅 ------------ 시작
  const [csList, setCsList] = useState<Array<{value:any,label:string}>>([]);
  const [csMngList, setCsMngList] = useState<partnerMngRType[]>([]);
  const { data:cs, refetch:csRefetch } = useQuery({
    queryKey: ["getClientSup"],
    queryFn: () => getPrtSupAPI(),
  });
  useEffect(()=>{
    if(cs?.data?.data?.length) {
      setCsList(cs.data?.data.map((cs:partnerRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data?.data]);

  const [prtId, setPrtId] = useState<string>("");
  const [prtMngId, setPrtMngId] = useState<string>("");
  const [detailFlag, setDetailFlag] = useState<boolean>(false);

  useEffect(()=>{
    // 구매처 변경 시 담당자 세팅 및 초기화
    if(prtId && prtId !== "" && cs?.data?.data && cs?.data?.data?.length) {
      setCsMngList((cs?.data?.data as partnerRType[] ?? []).find(f=>f.id === prtId)?.managers ?? []);
      if(!detailFlag) setPrtMngId(""); 
      else            setDetailFlag(false);
    } else {
      setCsMngList([]);
      setPrtMngId("");
    }
  }, [prtId, cs?.data?.data])
  // ------------ 구매처 데이터 세팅 ------------ 끝
    
  // ------------ 구매처 데이터 등록 ------------ 시작
  const [addPartner, setAddPartner] = useState<boolean>(false);
  const [newPartner, setNewPartner] = useState<partnerCUType>(newDataPartnerType);
  const handleSubmitNewData = async (data: partnerCUType) => {
    try {
      if((data?.prtTel && !isValidTel(data?.prtTel)) ||
        (data?.prtEmail && !isValidEmail(data.prtEmail))
      ) {
        showToast("올바른 형식을 입력해주세요.", "error");
        return;
      }
      
      const result = await postAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'biz-partner',
        jsx: 'jsxcrud'},
        
        { ...data, prtTypeEm: 'sup'}
      );

      if(result.resultCode === 'OK_0000') {
        csRefetch();
        setAddPartner(false);
        showToast("구매처 등록 완료", "success");
        setNewPartner(newDataPartnerType);
      } else {
        console.log(result);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // ------------ 구매처 데이터 등록 ------------ 끝

  // ------------ 구매처 담당자 등록 ------------ 시작
  const [ newPrtMngOpen, setNewPrtMngOpen ] = useState<boolean>(false);
  const [ newPartnerMngData, setNewPartnerMngData ] = useState<partnerMngRType | null>(null);

  // 구매처 설정 값 변경 시 실행 함수
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
  // ------------ 구매처 담당자 등록 ------------ 끝

  // ------------- 필요 데이터 세팅 ------------ 시작
  // 회사 조회
  const [company, setCompany] = useState<companyType | null>(null);
  const { data: queryCompanyData } = useQuery<apiGetResponseType, Error>({
    queryKey: ["setting", "company", "base"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "company-default/jsxcrud/one",
      });
      if (result.resultCode === "OK_0000") {
        setCompany(result.data?.data ?? {});
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // -------------- 필요 데이터 세팅 ------------ 끝

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [ dataLoading, setDataLoading ] = useState<boolean>(true);
  const [ totalData, setTotalData ] = useState<number>(1);
  const [ pagination, setPagination ] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [ data, setData ] = useState<buyOrderType[]>([]);
  const { data:queryData, isLoading, refetch } = useQuery({
    queryKey: ['request/material/jsxcrud/many', pagination, sQueryJson],
    queryFn: async () => {
      return getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: 'request/material/jsxcrud/many'
      },{
        limit: pagination.size,
        page: pagination.current,
        s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
      });
    }
  });

  useEffect(()=>{
    setDataLoading(true);
    if(!isLoading) {
      const arr = (queryData?.data?.data ?? []).map((item:buyOrderType) => ({
        ...item,
      }))
      setData(arr);
      setTotalData(queryData?.data?.total ?? 0);
      setDataLoading(false);
    }
  }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  // ------------ 디테일 데이터 세팅 ------------ 시작
  const {data:queryDetailData} = useQuery({
    queryKey: ['request/material/detail/jsxcrud/one', order?.id],
    queryFn: async () => {
      const result = await getAPI({
        type: 'core-d2',
        utype: 'tenant/',
        url: `request/material/detail/jsxcrud/one/${order?.id}`
      });

      if(result.resultCode === "OK_0000") {
        const entity = result.data.data as buyOrderType;
        const mtList = (entity?.detailInfo?.details ?? []).map((item) => ({
          nm: item.mtNm ?? item.material?.mtNm ?? "",
          w: item.mtOrderSizeW ?? 0,
          h: item.mtOrderSizeH ?? 0,
          thk: item.mtOrderThk ?? 0,
          cnt: item.mtOrderQty ?? 0,
          unit: item.mtOrderUnit ?? "",
          wgt: item.mtOrderWeight ?? 0,
          price: item.mtOrderAmount ?? 0,
          priceUnit: item.mtOrderInputPrice ?? 0,
        }));
        handleDirectPrint(mtList, entity, company, setOrderDocumentFormOpen);
      }

      return result;
    },
    enabled: !!order?.id
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝

  // 결과 모달창을 위한 변수
  const [ resultOpen, setResultOpen ] = useState<boolean>(false);
  const [ resultType, setResultType ] = useState<"success" | "error" | "">("");
  const [ errMsg, setErrMsg ] = useState<string>("");

  // 발주서 모달
  const [ orderDocumentFormOpen, setOrderDocumentFormOpen ] = useState<boolean>(false);

  // 모달창 초기화
  useEffect(()=>{
    if(!orderDocumentFormOpen) {
      setOrder(null);
    }
  }, [orderDocumentFormOpen])

  if(meLoading) return <Spin />

  return (
    <>
      <div className="w-full h-50">
        <ListTitleBtn
          label="신규"
          onClick={()=>{
            router.push("/buy/order/new");
          }}
          icon={<SplusIcon stroke="#FFF"className="w-16 h-16"/>}
        />
      </div>

      <DividerH />

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
        searchs={searchs} setSearchs={setSearchs}
        handleSearchs={handleSearchs}
      />

      <List>
        <AntdTableEdit
          columns={
            cookie.get('company') === 'sy' ?
            BuyOrderClmn(totalData, pagination, setOrderDocumentFormOpen, setOrder, router).filter(f=>
              !f.key?.toString().includes("layerEm") && !f.key?.toString().includes("sm") && !f.key?.toString().includes("mk")
              && !f.key?.toString().includes("pnlL") && !f.key?.toString().includes("kit") && !f.key?.toString().includes("Kit")
              && !f.key?.toString().includes("board") && !f.key?.toString().includes("prdCnt") && !f.key?.toString().includes("sth")
              && !f.key?.toString().includes("rein") && !f.key?.toString().includes("m2")
            )
            :
            BuyOrderClmn(totalData, pagination, setOrderDocumentFormOpen, setOrder, router)
          }
          data={data}
          styles={{th_bg:'#F2F2F2',td_bg:'#FFFFFF',round:'0px',line:'n'}}
          loading={dataLoading}
        />
      </List>

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        handleMenuClick={handlePageMenuClick}
        searchs={searchs} setSearchs={setSearchs}
        handleSearchs={handleSearchs}
      />
      
      {/* 구매처 등록 */}
      <BaseInfoCUDModal
        title={{name: "거래처 등록", icon: <Bag/>}}
        open={addPartner} 
        setOpen={setAddPartner} 
        onClose={() => {
          setAddPartner(false);
          setNewPartner(newDataPartnerType);
        }}
        items={MOCK.clientItems.CUDPopItems} 
        data={newPartner}
        onSubmit={handleSubmitNewData}
        onDelete={()=>{}}
      />

      {/* 구매처 담당자 등록 */}
      <PrtMngAddModal
        open={newPrtMngOpen}
        setOpen={setNewPrtMngOpen}
        partnerId={prtId}
        newPartnerMngData={newPartnerMngData}
        handlePrtDataChange={handlePrtDataChange}
        submitEndFn={()=>{
          setNewPrtMngOpen(false);
          setNewPartnerMngData(null);
        }}
        prtMngSuccessFn={(entity)=>{
          setCsMngList([...csMngList, {...entity} ]);
          setPrtMngId(entity.id);
        }}
      />

      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === "error" ? "오류 발생" : 
          ""
        }
        contents={
          resultType === "error" ? <div>{errMsg}</div> :
          <></>
        }
        type={resultType === "success" ? "confirm" : "error"}
        onOk={()=>{
          setResultOpen(false);
        }}
        onCancel={()=>{
          setResultOpen(false);
        }}
        theme="main"
        hideCancel={resultType === "error" ? true : false}
        okText={
          resultType === "error" ? "확인" :
          ""
        }
      />
      
      <ToastContainer />
    </>
  )
};

BuyOrderPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="구매 및 발주"
  >{page}</MainPageLayout>
);

export default BuyOrderPage;