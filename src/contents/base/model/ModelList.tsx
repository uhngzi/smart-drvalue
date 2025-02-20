import AntdInput from "@/components/Input/AntdInput";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { modelsType, orderModelType } from "@/data/type/sayang/models";
import { Dropdown, MenuProps, Radio, Space } from "antd";
import { SetStateAction, useEffect, useState } from "react";

import Edit from "@/assets/svg/icons/edit.svg";
import SearchIcon from "@/assets/svg/icons/s_search.svg";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";
import styled from "styled-components";
import { SalesOrderStatus } from "@/data/type/enum";

interface Props {
  type: 'order' | 'match';
  models: modelsType[];
  setModels: React.Dispatch<SetStateAction<modelsType[]>>;
  selectId: string;
  setSelectId: React.Dispatch<SetStateAction<string>>;
  products: orderModelType[] | salesOrderProcuctCUType[];
  setProducts: React.Dispatch<SetStateAction<orderModelType[] | salesOrderProcuctCUType[]>>;
  setNewFlag: React.Dispatch<SetStateAction<boolean>>;
}

const ModelList:React.FC<Props> = ({
  type,
  models,
  setModels,
  selectId,
  setSelectId,
  products,
  setProducts,
  setNewFlag,
}) => {
  const items = (record: any): MenuProps['items'] => [
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

  const [searchModel, setSearchModel] = useState<string>('');
  useEffect(()=>{
    setModels(models.filter((f:modelsType) => f.prdNm.includes(searchModel)));
  }, [searchModel]);

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectMenuKey, setSelectMenuKey] = useState<number | null>(null);
  const [selectRecord, setSelectRecord] = useState<modelsType | null>(null);

  const handleSelectMenu = () => {
    if(selectMenuKey===0)       setNewFlag(true);   // 복사하여 새로 등록
    else if(selectMenuKey===1)  setNewFlag(false);  // 그대로 등록
    else                        return ;
    
    if(selectRecord !== null) {
      if(type === 'order') {
        const newData = [...products] as salesOrderProcuctCUType[];
        const index = newData.findIndex((item) => selectId === item.id);
        if (index > -1) {
          newData[index] = { ...newData[index], currPrdInfo: { ...selectRecord } };
          setProducts(newData);
        }
      } else {
        const newData = [...products] as orderModelType[];
        const index = newData.findIndex((item) => selectId === item.id);
        if (index > -1) {
          newData[index] = { ...newData[index], model:{ ...selectRecord }, editModel: { ...selectRecord } };
          setProducts(newData);
        }
      }
      setAlertOpen(false);
      setSelectMenuKey(null);
    }
  }
  
  // 입력하려는 모델에 값이 있는지 체크
  const [productChk, setProductChk] = useState<boolean>(false);
  const [alertProductOpen, setAlertProductOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-20">
      <div className="flex h-70 py-20 border-b-1 border-line">
        <AntdInput value={searchModel} onChange={(e)=>setSearchModel(e.target.value)}/>
        <div
          className="w-38 h-32 border-1 border-line v-h-center border-l-0 cursor-pointer"
          onClick={()=>{}}
        >
          <p className="w-16 h-16 text-[#2D2D2D45]"><SearchIcon /></p>
        </div>
      </div>
      <div className="">
        <AntdTableEdit
          columns={[
            {
              title: '모델명',
              dataIndex: 'prdNm',
              key: 'prdNm',
              align: 'center',
            },
            {
              title: 'Rev No',
              dataIndex: 'prdRevNo',
              key: 'prdRevNo',
              align: 'center',
            },
            {
              title: '층/두께',
              dataIndex: 'thk',
              key: 'thk',
              align: 'center',
              render: (value, record:modelsType) => (
                <div className="w-full h-full v-h-center">
                  {record.layerEm} / {value}
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
          data={models}
          styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px',}}
        />
      </div>

      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={"등록할 모델의 관리번호 선택"}
        contents={<div>
          <CustomRadioGroup size="large" className="flex gap-20" value={selectId}>
          {
            products
            .filter(f=>!f.completed)
            .filter(f=>f.glbStatus?.salesOrderStatus !== SalesOrderStatus.MODEL_REG_DISCARDED)
            .map((p) => (
              <Radio.Button
                key={p.id}
                value={p.id}
                onClick={(e)=>{
                  setSelectId(p.id ?? "");
                  // 모델 매칭에서 해당 모델에 입력된 값이 있을 경우
                  if(type === 'match' && (p as orderModelType).editModel) setProductChk(true);
                  // 고객 발주에서 해당 모델에 입력된 값이 있을 경우
                  else if(type === 'order' && p.currPrdInfo)              setProductChk(true);
                  console.log(p);
                }}
                className="!rounded-20 [border-inline-start-width:1px]"
              >{p.prtOrderNo}</Radio.Button>
            ))
          }
          </CustomRadioGroup>
        </div>}
        type={'info'} 
        onCancle={()=>{
          setAlertOpen(false);
        }}
        onOk={()=>{
          // 해당 모델에 입력된 값이 있을 경우
          if(productChk) {
            setAlertOpen(false);
            setAlertProductOpen(true);
          } else {
            handleSelectMenu();
          }
        }}
        okText={'완료'}
        cancelText={'취소'}
      />

      <AntdAlertModal
        open={alertProductOpen}
        setOpen={setAlertProductOpen}
        title={"값이 이미 존재하는 모델입니다."}
        contents={<div>
          기존에 입력된 데이터가 있습니다.<br/>
          입력된 데이터가 사라지고 모델의 정보로 입력됩니다.
        </div>}
        type={'warning'} 
        onCancle={()=>{
          setProductChk(false);
          setAlertProductOpen(false);
        }}
        onOk={()=>{
          setProductChk(false);
          setAlertProductOpen(false);
          handleSelectMenu();
        }}
        okText={'선택한 모델의 정보로 새로 입력할게요'}
        cancelText={'취소할게요'}
      />
    </div>
  )
}

const CustomRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper::before {
    display: none !important;
  }
`;

export default ModelList;