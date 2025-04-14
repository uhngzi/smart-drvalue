import AntdInput from "@/components/Input/AntdInput";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { modelsType, orderModelType, salesModelsType } from "@/data/type/sayang/models";
import { Dropdown, MenuProps, Pagination, Radio, Space } from "antd";
import { SetStateAction, useEffect, useState } from "react";

import Edit from "@/assets/svg/icons/edit.svg";
import SearchIcon from "@/assets/svg/icons/s_search.svg";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";
import styled from "styled-components";
import { ModelStatus, SalesOrderStatus } from "@/data/type/enum";
import CustomAutoComplete from "@/components/AutoComplete/CustomAutoComplete";
import { useQuery } from "@tanstack/react-query";
import { getPrtCsAPI } from "@/api/cache/client";
import { partnerRType } from "@/data/type/base/partner";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";

interface Props {
  type: 'order' | 'match' | 'model';
  selectId?: string | null;
  setSelectId?: React.Dispatch<SetStateAction<string | null>>;
  products?: orderModelType[] | salesOrderProcuctCUType[];
  setProductsOrder?: React.Dispatch<SetStateAction<salesOrderProcuctCUType[]>>;
  setProductsMatch?: React.Dispatch<SetStateAction<orderModelType[]>>;
  setNewFlag?: React.Dispatch<SetStateAction<boolean>>;
  setDrawerOpen?: React.Dispatch<SetStateAction<boolean>>;
  partnerId?: string;
  model?: salesModelsType | null;
  setModel?: React.Dispatch<SetStateAction<salesModelsType | null>>;
}

const ModelList:React.FC<Props> = ({
  type,
  selectId,
  setSelectId,
  products,
  setProductsOrder,
  setProductsMatch,
  setNewFlag,
  setDrawerOpen,
  partnerId,
  model,
  setModel,
}) => {
  // ----------- 거래처 데이터 세팅 ----------- 시작
    // 거래처를 가져와 SELECT에 세팅 (type이 다름)
  const [ csList, setCsList ] = useState<Array<{value:any,label:string}>>([]);
  const { data:cs, refetch:csRefetch } = useQuery({
    queryKey: ["getClientCs"],
    queryFn: () => getPrtCsAPI(),
  });
  useEffect(()=>{
    if(cs?.data?.data?.length) {
      setCsList(cs.data?.data.map((cs:partnerRType) => ({
        value:cs.id,
        label:cs.prtNm
      })));
    }
  }, [cs?.data?.data]);

  const [searchCs, setSearchCs] = useState<string>("");
  useEffect(()=>{
    if(partnerId)
      setSearchCs(partnerId);
  }, [partnerId])
  // ----------- 거래처 데이터 세팅 ----------- 끝

  const [searchModel, setSearchModel] = useState<string>('');

  // ------------ 모델 데이터 세팅 ------------ 시작
  const [totalData, setTotalData] = useState<number>(0);
  const [data, setData] = useState<modelsType[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const pageSizeOptions = ["10", "20", "50", "100"];
  if (totalData > 100) {
    pageSizeOptions.push(totalData.toString()); // "전체 보기" 옵션 추가
  }
  const [pagination, setPagination] = useState({
    current: 1,
    size: 20,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  
  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["models", searchModel, searchCs, pagination],
    queryFn: async () => {
      setDataLoading(true);
      const result = await getAPI({
        type: "core-d1",
        utype: "tenant/",
        url: "models/jsxcrud/many"
      },{
        limit: pagination.size,
        page: pagination.current,
        s_query: { "$or": [
          { "$and": [
            { "prdNm": {"$cont": searchModel}},
            { "partner.id": {"$eq": searchCs}}
          ]},
          searchModel.length < 4 ? { "$and": [
            { "prdNm": {"$startsL": searchModel}},
            { "partner.id": {"$eq": searchCs}}
          ]} : {}
        ]}
      });

      if (result.resultCode === "OK_0000") {
        setData(result.data?.data ?? []);
        setTotalData(result.data?.total ?? 0);
        setDataLoading(false);
      } else {
        console.log("MODELS ERROR:", result.response);
      }
      return result;
    },
  });
  // ------------ 모델 데이터 세팅 ------------ 끝

  
  const items = (record: any): MenuProps['items'] => type === "model" ? 
  [
    {
      label: <>복사하여 새로 등록</>,
      key: 0,
      onClick:()=>{
        setModel?.({
          ...record,
          id: model?.id,
          usedYn: false,
        });
        setDrawerOpen?.(false);
      },
    },
  ]:
  [
    {
      label: <>복사하여 새로 등록</>,
      key: 0,
      onClick:()=>{
        setAlertOpen(true);
        setSelectMenuKey(0);
        setSelectRecord(record);
      },
    },
    {
      label: <>그대로 등록</>,
      key: 1,
      onClick:()=>{
        setAlertOpen(true);
        setSelectMenuKey(1);
        setSelectRecord(record);
      }
    },
  ]

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectMenuKey, setSelectMenuKey] = useState<number | null>(null);
  const [selectRecord, setSelectRecord] = useState<modelsType | null>(null);

  const handleSelectMenu = () => {
    if(selectMenuKey===0)   setNewFlag?.(true);   // 복사하여 등록
    if(selectMenuKey===1)   setNewFlag?.(false);  // 그대로 등록

    if(selectRecord !== null && products) {
      if(type === 'order') {
        const newData = [...products] as salesOrderProcuctCUType[];
        const index = newData.findIndex((item) => selectId === item.id);
        if (index > -1) {
          newData[index] = {
            ...newData[index],
            currPrdInfo: { ...selectRecord },
            orderTit: selectRecord.prdNm,
            // 복사일 경우 수정, 그대로일 경우 반복
            modelStatus: selectMenuKey === 1 ? ModelStatus.REPEAT : ModelStatus.MODIFY,
            modelId: selectRecord.id,
          };
          setProductsOrder?.(newData);
        }
      } else {
        const newData = [...products] as orderModelType[];
        const index = newData.findIndex((item) => selectId === item.id);
        if (index > -1) {
          newData[index] = { 
            ...newData[index],
            // 저장 될 모델 값
            model:{ ...selectRecord },
            // 입력한 모델 값
            editModel: { ...selectRecord },
            // 임시저장 될 값
            tempPrdInfo: { ...selectRecord },
            // 복사일 경우 수정, 그대로일 경우 반복
            modelStatus: selectMenuKey === 1 ? ModelStatus.REPEAT : ModelStatus.MODIFY,
          };
          setProductsMatch?.(newData);
        }
      }
      setAlertOpen(false);
      setSelectMenuKey(null);

      if(!productChk)
        setDrawerOpen?.(false);
    }
  }
  
  // 입력하려는 모델에 값이 있는지 체크
  const [productChk, setProductChk] = useState<boolean>(false);
  const [alertProductOpen, setAlertProductOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"in" | "miss" | "">("");

  return (
    <div className="flex flex-col gap-20">
      <div className="v-between-h-center h-70 py-20 border-b-1 border-line">
        <div className="h-center pt-3 min-w-[220px]">
          <AntdInput 
            value={searchModel}
            onChange={(e)=>setSearchModel(e.target.value)}
            placeholder="모델명 검색"
            styles={{ht:"36px",br:"0"}}
          />
          <div
            className="min-w-32 w-32 h-36 border-1 border-line v-h-center border-l-0 cursor-pointer"
          >
            <p className="w-16 h-16 text-[#2D2D2D45]"><SearchIcon /></p>
          </div>
        </div>

        <div className="h-center min-w-[220px]">
          <CustomAutoComplete
            option={csList}
            value={searchCs}
            onChange={(value) => {
              setSearchCs(value);
            }}
            placeholder="고객명 검색"
          />
          <div
            className="min-w-32 w-32 h-36 border-1 border-line v-h-center border-l-0 cursor-pointer mt-3"
          >
            <p className="w-16 h-16 text-[#2D2D2D45]"><SearchIcon /></p>
          </div>
        </div>
      </div>
      <div className="h-center justify-end">
        <Pagination 
          size="small"
          defaultCurrent={1}
          current={pagination.current}
          total={totalData}
          onChange={(page: number, size: number) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            handlePageChange?.(page, size);
          }}
          pageSize={pagination.size}
          showSizeChanger={true}
          pageSizeOptions={pageSizeOptions}
          locale={{ items_per_page: "건씩 보기" }}
        />
      </div>
      <div className="h-[calc(100vh-300px)] overflow-y-auto">
        <AntdTableEdit
          columns={[
            {
              title: '모델명',
              dataIndex: 'prdNm',
              key: 'prdNm',
              align: 'center',
              cellAlign: 'left',
            },
            {
              title: 'Rev No',
              dataIndex: 'prdRevNo',
              key: 'prdRevNo',
              align: 'center',
              cellAlign: 'left',
            },
            {
              title: '층/두께',
              dataIndex: 'thk',
              key: 'thk',
              align: 'center',
              render: (value, record:modelsType) => (
                <div className="w-full h-full v-h-center">
                  {record.layerEm.replace("L","")} / {value}
                </div>
              )
            },
            {
              title: '동박두께',
              dataIndex: 'copOut',
              key: 'copOut',
              align: 'center',
              render: (value, record:modelsType) => (
                <div className="w-full h-full v-h-center">
                  {value+'외'} / {record.copIn+'내'}
                </div>
              )
            },
            {
              title: '',
              dataIndex: 'id',
              key: 'id',
              align: 'center',
              render: (value, record) => (
                <Dropdown trigger={['click']} menu={{ items:items(record) }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <div 
                        className="w-full h-full v-h-center cursor-pointer"
                        onClick={()=>{}}
                      >
                        <p className="w-12 h-12 v-h-center"><Edit /></p>
                      </div>
                    </Space>
                  </a>
                </Dropdown>
              )
            },
          ]}
          data={data}
          styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px',}}
        />
      </div>
      <div className="h-center justify-end">
        <Pagination 
          size="small"
          defaultCurrent={1}
          current={pagination.current}
          total={totalData}
          onChange={(page: number, size: number) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            handlePageChange?.(page, size);
          }}
          pageSize={pagination.size}
          showSizeChanger={true}
          pageSizeOptions={pageSizeOptions}
          locale={{ items_per_page: "건씩 보기" }}
        />
      </div>

      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={"등록할 모델 선택"}
        contents={<div>
          <CustomRadioGroup size="large" className="flex gap-20" value={selectId}>
          { products &&
            products
            .filter(f=>!f.completed)
            .filter(f=>f.glbStatus?.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED)
            .map((p) => (
              <Radio.Button
                key={p.id}
                value={p.id}
                onClick={(e)=>{
                  setSelectId?.(p.id ?? "");
                  // 모델 매칭에서 해당 모델에 입력된 값이 있을 경우
                  if(type === 'match' && (p as orderModelType).editModel) setProductChk(true);
                  // 고객 발주에서 해당 모델에 입력된 값이 있을 경우
                  else if(type === 'order' && p.currPrdInfo)              setProductChk(true);
                }}
                className="!rounded-20 [border-inline-start-width:1px]"
              >{p.index}</Radio.Button>
            ))
          }
          </CustomRadioGroup>
        </div>}
        type={'info'} 
        onCancel={()=>{
          setAlertOpen(false);
        }}
        onOk={()=>{
          const selectP = products?.find(f=>f.id === selectId);
          if(selectP) {
            if(selectP.modelStatus === ModelStatus.REPEAT && selectMenuKey === 0) {
            // 반복인데 복사하여 새로 등록을 선택한 경우 실패
              setAlertOpen(false);
              setAlertType("miss");
              setAlertProductOpen(true);
              return;
            } else if(selectP.modelStatus === ModelStatus.MODIFY && selectMenuKey === 1) {
            // 수정인데 그대로 등록을 선택한 경우 실패
              setAlertOpen(false);
              setAlertType("miss");
              setAlertProductOpen(true);
              return;
            }
            // 해당 모델에 입력된 값이 있을 경우
            if(productChk) {
              setAlertOpen(false);
              setAlertProductOpen(true);
              setAlertType("in");
            } else {
              handleSelectMenu();
            }
          }
        }}
        okText={'완료'}
        cancelText={'취소'}
      />

      <AntdAlertModal
        open={alertProductOpen}
        setOpen={setAlertProductOpen}
        title={
          alertType === "in" ? "값이 이미 존재하는 모델입니다." :
          alertType === "miss" ? 
            selectMenuKey === 0 ? "복사하여 등록 실패" : "그대로 등록 실패" :
          ""
        }
        contents={
          alertType === "in" ? <div>
            기존에 입력된 데이터가 있습니다.<br/>
            입력된 데이터가 사라지고 모델의 정보로 입력됩니다.
          </div> :
          alertType === "miss" ?
            selectMenuKey === 0 ?
              <div>반복일 경우 그대로 등록만 가능합니다.</div> :
              <div>수정일 경우 복사하여 새로 등록만 가능합니다.</div> :
          <></>
        }
        type={'warning'} 
        onOk={()=>{
          setProductChk(false);
          setAlertProductOpen(false);
          if(alertType !== "miss") {
            handleSelectMenu();
            setDrawerOpen?.(false);
          }
        }}
        onCancel={()=>{
          setProductChk(false);
          setAlertProductOpen(false);
        }}
        hideCancel={alertType === "miss" ? true : false}
        okText={
          alertType === "in" ? '선택한 모델의 정보로 새로 입력할게요' :
          alertType === "miss" ? "확인" :
          ""
        }
        cancelText={'취소할게요'}
      />
    </div>
  )
}

const CustomRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-wrap: wrap; /* 자동 줄 바꿈 */
  gap: 10px; /* 간격 유지 */
  justify-content: center; /* 중앙 정렬 */

  .ant-radio-button-wrapper {
    flex: 1 1 auto; /* 크기 자동 조절 */
    min-width: 100px; /* 최소 너비 설정 */
    text-align: center;
  }

  .ant-radio-button-wrapper::before {
    display: none !important;
  }
`;

export default ModelList;