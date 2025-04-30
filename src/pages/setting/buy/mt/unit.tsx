// React 및 라이브러리 훅
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs"; // dayjs 추가

// API 모듈
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { patchAPI } from "@/api/patch";
import { deleteAPI } from "@/api/delete";

// 타입 정의
import { apiGetResponseType } from "@/data/type/apiResponse";
import {
  materialType,
  materialPriceCUType,
  materialPriceType,
  newMaterialPriceCUType,
  materialPriceReq,
  materialSupplierType,
  materialApplyType
} from "@/data/type/base/mt";
import { partnerRType } from "@/data/type/base/partner";

// 레이아웃
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

// 공통 컴포넌트
import AntdTable from "@/components/List/AntdTable";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";

// 유틸
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { MOCK } from "@/utils/Mock";
import { isValidNumber } from "@/utils/formatNumber"; 

// 아이콘
import Bag from "@/assets/svg/icons/bag.svg";
import { Spin } from "antd";

const BuyMtUnitListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [newData, setNewData] = useState<materialPriceCUType>(newMaterialPriceCUType());
  const [addModalInfoList, setAddModalInfoList] = useState<any[]>(MOCK.materialPriceItems.CUDPopItems);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(0);
  const [pagination, setPagination] = useState({ current: 1, size: 10 });
  const [newOpen, setNewOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultType, setResultType] = useState<AlertType>('info');
  const [errMsg, setErrMsg] = useState('');
  const { showToast, ToastContainer } = useToast();


  const [actionType, setActionType] = useState<'create' | 'update' | 'delete'>('create');
  const [dataMaterial, setDataMaterial] = useState<materialType[]>([]);
  const [data, setData] = useState<materialPriceType[]>([]);
  const [applyData, setApplyData] = useState<materialApplyType[]>([]);

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, current: page });
  };
  
  // --------- 필요 데이터 시작 ----------
  const fetchApplyPriceData = async (targetId: string) => {
    const result = await getAPI({
      type: 'core-d2',
      utype: 'tenant/',
      url: `cbiz-apply-price-data/default/one/MATERIAL_PRICE/${targetId}`
    });
  
    if (result.resultCode === 'OK_0000') {
      const data = result.data?.data;
  
      if (data) {
        setNewData((prev) => ({
          ...prev,
          appDt: data.applyDate, // 적용일
          priceUnit: data.mapping?.priceUnit // 적용 가격
        }));
      }
    }
  
    return result;
  };
  

  

  // 원자재 데이터 조회
  useQuery<apiGetResponseType>({
    queryKey: ['material/jsxcrud/many'],
    queryFn: async () => {
      const result = await getAPI({ type: 'baseinfo', utype: 'tenant/', url: 'material/jsxcrud/many' });
      if (result.resultCode === 'OK_0000') setDataMaterial(result.data?.data ?? []);
      return result;
    },
  });
  
  // 공급처 데이터를 조회하는 API
  const { data: supplierData, isLoading: supplierLoading, refetch: supplierRefetch } = useQuery<apiGetResponseType>({
    queryKey: ["material-suppliers"],
    queryFn: async () => {
      return await getAPI({ 
        type: 'baseinfo', 
        utype: 'tenant/', 
        url: 'material-sup/jsxcrud/many' 
      });
    },
  });

  // 공급처 데이터가 로드되면 옵션 목록을 설정하는 useEffect
  useEffect(() => {
  
    if (!supplierLoading && supplierData?.data?.data) {
      const supplierOptions = (supplierData.data.data as materialSupplierType[]).map((supplier) => ({
        value: supplier.supplier?.id,
        label: `${supplier.supplier?.prtNm}`
      }));
      
      setAddModalInfoList(prev =>
        prev.map(item =>
          item.name === 'partnerIdx' ? { ...item, option: supplierOptions } : item
        )
      );
    }
  }, [supplierData?.data?.data, supplierLoading]);
  
  // 선택된 원자재에 따라 공급처 필터링
  useEffect(() => {
    console.log('[materialIdx 변경 감지]', newData.materialIdx);
  
    if (!newData.materialIdx) {
      console.log('[partnerIdx 옵션 초기화 진행됨]');
      setAddModalInfoList(prev =>
        prev.map(item =>
          item.name === 'partnerIdx' ? { ...item, option: [] } : item
        )
      );
      return;
    }
    
    // 선택된 원자재에 따른 공급처 필터링
    const fetchPartnersByMaterial = async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: `material-sup/jsxcrud/many`,
      }, {
        s_query: {
          "material.id": { $eq: newData.materialIdx }
        }
      });
  
      console.log("특정 원자재에 대한 공급처 응답:", result);
      if (result.resultCode === 'OK_0000') {
        const partners = (result.data?.data as materialSupplierType[]).map((sup) => ({
          value: sup.supplier?.id ?? '',
          label: `${sup.supplier?.prtNm || ''}`
        })) ?? [];
  
        setAddModalInfoList(prev =>
          prev.map(item =>
            item.name === 'partnerIdx' ? { ...item, option: partners } : item
          )
        );
      }
    };    
    fetchPartnersByMaterial();
  }, [newData.materialIdx]);

  
  // --------- 필요 데이터 끝 ----------

  const { refetch } = useQuery<apiGetResponseType>({
    queryKey: ['material-price/jsxcrud/many', pagination.current],
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'material-price/jsxcrud/many',
      }, {
        limit: pagination.size,
        page: pagination.current,
      });
      if (result.resultCode === 'OK_0000') {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
      }
      setDataLoading(false);
      return result;
    },
  });

  // 적용일이 지난 경우 가격만 수정 불가능하도록 처리
  const getUpdatedCUDPopItems = (items = addModalInfoList) => {
    return items.map((item) => {
      let disabled = false;
  
      if (
        newData.id &&
        newData.appDt &&
        dayjs(newData.appDt).isValid() &&
        (dayjs(newData.appDt).isBefore(dayjs(), 'day') || dayjs(newData.appDt).isSame(dayjs(), 'day'))
      ) {
        if (item.name !== 'priceUnit' && item.name !== 'applyPricedt') {
          disabled = true;
        }
      }
  
      if (item.name === 'materialIdx') {
        return {
          ...item,
          option: dataMaterial.map((m) => ({ value: m.id, label: m.mtNm })),
          disabled,
        };
      }
  
      return { ...item, disabled };
    });
  };
  
  

  useEffect(() => {
    setAddModalInfoList(getUpdatedCUDPopItems());
  }, [dataMaterial, newData.appDt, newData.id]);  
  
  const convertToCUType = (record: materialPriceType): materialPriceCUType => ({
    id: record.id,
    priceNm: record.priceNm,
    priceUnit: record.priceUnit,
    materialType: record.materialType,
    txturType: record.txturType,
    thicMin: record.thicMin,
    thicMax: record.thicMax,
    sizeW: record.sizeW,
    sizeH: record.sizeH,
    cntMin: record.cntMin,
    cntMax: record.cntMax,
    wgtMin: record.wgtMin,
    wgtMax: record.wgtMax,
    unitType: record.unitType,
    remarks: record.remarks,
    safeInv: record.safeInv,
    appDt: record.appDt,
    useYn: record.useYn,
    materialIdx: record.material?.id,
    partnerIdx: record.partner?.id,
    appOriginDt: record.appDt,
    applyPrice: record.applyPrice,
    applyPricedt: record.appDt,      
  });

  const handleSubmitNewData = async () => {
    const val = validReq(newData, materialPriceReq());
    if (!val.isValid) {
      showToast(`${val.missingLabels}은(는) 필수 입력입니다.`, 'error');
      return;
    }
  
    try {
      // 신규 등록인 경우
      if (!newData.id) {
        setActionType('create');
        const {appOriginDt, applyPrice, applyPricedt, ...payloadWithoutId } = newData;
        const result = await postAPI(
          { type: 'baseinfo', utype: 'tenant/', url: 'material-price', jsx: 'jsxcrud' }, 
          {
            ...payloadWithoutId,
            material: { id: newData.materialIdx ?? '' },
            partner: { id: newData.partnerIdx ?? '' },
            materialIdx: undefined,
            partnerIdx: undefined,
          }
        );
        
        if (result.resultCode === 'OK_0000') {
          setResultType('success');
          setNewData(newMaterialPriceCUType());
          refetch();
        } else {
          setResultType('error');
          setErrMsg(result?.response?.data?.message || '처리 중 오류가 발생했습니다.');
        }
      } else {
        // 수정인 경우
        setActionType('update');
        const today = dayjs();
        
        if (newData.appOriginDt && (dayjs(newData.appDt).isBefore(today, 'day') || dayjs(newData.appDt).isSame(today, 'day'))) {
          // 과거 적용일인 경우: 적용단가만 수정 (priceUnit은 건드리지 않음)
          const result = await patchAPI(
            { type: 'baseinfo', utype: 'tenant/', url: 'material-price', jsx: 'jsxcrud' },
            newData?.id ?? '',
            {
              // 여기에 전송할 데이터 추가
              priceUnit: newData.applyPrice, // applyPrice를 priceUnit로 업데이트
            }
          );
          
          if (result.resultCode === 'OK_0000') {
            setResultType('success');
            setNewData(newMaterialPriceCUType());
            refetch();
          } else {
            setResultType('error');
            setErrMsg(result?.response?.data?.message || '처리 중 오류가 발생했습니다.');
          }
        } else {
          // 적용일이 지나지 않은 경우 모든 필드 변경 가능
          const { id, appOriginDt, applyPrice, applyPricedt, ...payloadWithoutId } = newData;
          const result = await patchAPI(
            { type: 'baseinfo', utype: 'tenant/', url: 'material-price', jsx: 'jsxcrud' },
            id ?? '',
            {
              ...payloadWithoutId,
              material: { id: newData.materialIdx ?? '' },
              partner: { id: newData.partnerIdx ?? '' },
              materialIdx: undefined,
              partnerIdx: undefined,
              priceUnit: newData.priceUnit, // priceUnit 포함
            }
          );
          
          if (result.resultCode === 'OK_0000') {
            setResultType('success');
            setNewData(newMaterialPriceCUType());
            refetch();
          } else {
            setResultType('error');
            setErrMsg(result?.response?.data?.message || '처리 중 오류가 발생했습니다.');
          }
        }
      }
    } catch (e) {
      setResultType('error');
      setErrMsg('처리 중 오류가 발생했습니다.');
    } finally {
      setResultOpen(true);
      setNewOpen(false);
    }
  };

  const handleEditClick = async (record: materialPriceType) => {
    setActionType('update');
    const applyDataResult = await fetchApplyPriceData(record.id);
    console.log('[applyDataResult]', applyDataResult);
    const converted = convertToCUType(record);
    
    // 기본값으로 현재 단가 설정
    let currentData = {
      ...converted,
      applyPrice: record.priceUnit, // 기본값으로 현재 단가 설정
    };
  
    if (applyDataResult.resultCode === 'OK_0000' && applyDataResult.data) {
      const applyData = applyDataResult.data;
      const applyDate = dayjs(applyData.applyDate);
      
      const today = dayjs();
  
      // 단가적용일이 오늘이거나 과거면 적용단가 정보 설정
      if (applyDate.isBefore(today, 'day') || applyDate.isSame(today, 'day')) {
        currentData = {
          ...currentData,
          applyPrice: applyData.mapping?.priceUnit ?? record.priceUnit,  // 적용 단가로 설정
        };
      }

      if (applyDataResult.resultCode === 'OK_0000' && applyDataResult.data) {
        const applyData = applyDataResult.data;
      
        currentData = {
          ...currentData,
          applyPrice: applyData.mapping?.priceUnit ?? record.priceUnit,
          applyPricedt: applyData.applyDate ?? record.appDt, // 직접 넣어줘야 함
        };
      }

    }
  
    setNewData(currentData);
  
    const today = dayjs();
    // 적용일 기준으로 다른 모달 아이템 표시
    if (record.appDt && (dayjs(record.appDt).isSame(today, 'day') || dayjs(record.appDt).isBefore(today, 'day'))) {
      // 과거/오늘이면 적용단가 수정 폼 (적용가격만 수정 가능)
      const applyItems = getUpdatedCUDPopItems(MOCK.ApplymaterialPriceItems.CUDPopItems);
      setAddModalInfoList(applyItems);
    } else {
      // 미래면 기본 폼 (모든 필드 수정 가능)
      const standardItems = getUpdatedCUDPopItems(MOCK.materialPriceItems.CUDPopItems);
      setAddModalInfoList(standardItems);
    }
  
    setNewOpen(true);
  };
  


  const handleDataDelete = async (id: string) => {
    try {
      const result = await deleteAPI({ type: 'baseinfo', utype: 'tenant/', url: 'material-price', jsx: 'jsxcrud' }, id);
      if (result.resultCode === 'OK_0000') {
        setActionType('delete'); 
        setResultType('success');
        refetch();
      } else {
        setActionType('delete'); 
        setResultType('error');
        setErrMsg(result?.response?.data?.message || '삭제 실패');
      }
      setResultOpen(true);
      setNewOpen(false);
    } catch {
      setResultType('error');
      setResultOpen(true);
      setNewOpen(false);
    }
  };
  
  const handleDataChange = (
    e: any,
    name: string,
    type: 'input' | 'select' | 'date' | 'other',
    key?: string
  ) => {
    // 단가(priceUnit)와 적용단가(applyPrice)를 독립적으로 처리
    if (name === 'priceUnit' && typeof e !== "string") {
      const { value } = e.target;
      setNewData({
        ...newData,
        priceUnit: value
        // 적용단가는 자동으로 설정하지 않음
      });
      return;
    }
    
    // 적용단가(applyPrice) 별도 처리
    if (name === 'applyPrice' && typeof e !== "string") {
      const { value } = e.target;
      setNewData({
        ...newData,
        applyPrice: value
      });
      return;
    }
  
    if (type === "input" && typeof e !== "string") {
      const { value } = e.target;
      const findLabelByName = (name: string): string => {
        const item = addModalInfoList.find((i) => i.name === name);
        return item?.label || name;
      };
      
      // 숫자 필드에 대한 유효성 검사
      if (['priceUnit', 'applyPrice', 'thicMin', 'thicMax', 'sizeW', 'sizeH', 'cntMin', 'cntMax', 'wgtMin', 'wgtMax', 'safeInv'].includes(name)) {
        // 빈 문자열이거나 숫자인 경우만 허용
        if (value === '' || isValidNumber(value)) {
          setNewData({ ...newData, [name]: value });
        } else {
          showToast(`${findLabelByName(name)}은(는) 숫자만 입력 가능합니다.`, 'error');
          return;
        }
      } else {
        // 일반 텍스트 필드는 그대로 처리
        setNewData({ ...newData, [name]: value });
      }
    } else if (type === "select") {
      if (key) {
        setNewData({
          ...newData, [name]: {
            ...((newData as any)[name] || {}),
            [key]: e?.toString(),
          }
        });
      } else {
        // 원자재가 바뀌었을 때 관련 종속 값들 초기화
        if (name === 'materialIdx') {
          setNewData({
            ...newData,
            [name]: e,
            partnerIdx: undefined,
            priceNm: '',
            priceUnit: 0,
            applyPrice: 0, // 적용단가도 초기화
          });
        } else {
          setNewData({ ...newData, [name]: e });
        }
      }
    }
  };
  

  useEffect(() => {
    console.log('[newData 변경 감지]', newData);
  }, [newData]);
  
  return (
    <>
      {dataLoading ? (
        <div className="w-full h-[90vh] v-h-center">
          <Spin tip="Loading..." />
        </div>
      ) : (
        <>
          <div className="v-between-h-center pb-10">
            <p>총 {totalData}건</p>
            <div
              className="w-80 h-30 v-h-center rounded-6 bg-[#038D07] text-white cursor-pointer"
              onClick={() => {
                setActionType('create');
                setNewOpen(true);
                setNewData(newMaterialPriceCUType());
                setAddModalInfoList(MOCK.materialPriceItems.CUDPopItems);
              }}
            >
              등록
            </div>
          </div>
          <AntdTable
            columns={[
              {
                title: 'No',
                dataIndex: 'no',
                render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index),
                align: 'center',
              },
              {
                title: '원자재명',
                dataIndex: 'material',
                render: (m: materialType | null) => m?.mtNm ?? '-',
                align: 'center'
              },
              {
                title: '공급처명',
                dataIndex: 'partner',
                render: (p: partnerRType | null) => p?.prtNm ?? '-',
                align: 'center'
              },
              {
                title: '가격명',
                dataIndex: 'priceNm',
                render: (_: any, record: any) => (
                  <span
                    className="cursor-pointer"
                    onClick={() => 
                      handleEditClick(record)
                    }
                  >
                    {record.priceNm}
                  </span>
                ),
                align: 'center'
              },
              {
                title: '가격',
                dataIndex: 'priceUnit',
                align: 'center'
              },
              {
                title: '적용일',
                dataIndex: 'appDt',
                render: (date) => dayjs(date).format('YYYY-MM-DD'),
                align: 'center'
              },
              {
                title: '사용여부',
                dataIndex: 'useYn',
                render: (value: boolean) => value ? '사용' : '미사용',
                align: 'center'
              }
            ]}
            data={data}
          />
          <div className="w-full h-100 v-h-center">
            <AntdSettingPagination
              current={pagination.current}
              total={totalData}
              size={pagination.size}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
      <BaseInfoCUDModal
        title={{ name: `원자재 단가 ${newData.id ? '수정' : '등록'}`, icon: <Bag /> }}

        data={newData}
        onSubmit={handleSubmitNewData}
        setOpen={setNewOpen}
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onDelete={() => handleDataDelete(newData.id ?? '')}
        items={addModalInfoList}
        handleDataChange={handleDataChange}
      />
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={
          resultType === 'success'
            ? actionType === 'delete'
              ? '원자재 단가 삭제 성공'
              : `원자재 단가 ${actionType === 'create' ? '등록' : '수정'} 성공`
            : actionType === 'delete'
              ? '원자재 단가 삭제 실패'
              : `원자재 단가 ${actionType === 'create' ? '등록' : '수정'} 실패`
        }
        contents={
          resultType === 'success'
            ? actionType === 'delete'
              ? <div>삭제가 완료되었습니다.</div>
              : <div>{actionType === 'create' ? '등록' : '수정'}이 완료되었습니다.</div>
            : <div>{errMsg}</div>
        }
        type={resultType}
        onOk={() => setResultOpen(false)}
        hideCancel
        theme="base"
      />
      <ToastContainer />
    </>
  );
};

BuyMtUnitListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{ pd: '70px' }}
    menu={[
      { text: '원자재 및 원자재 구매처', link: '/setting/buy/mt/list' },
      { text: '원자재 불량', link: '/setting/buy/mt/bad' },
      { text: '원자재 단가', link: '/setting/buy/mt/unit' },
    ]}
  >
    {page}
  </SettingPageLayout>
);

export default BuyMtUnitListPage;