import { SetStateAction, useEffect, useState } from "react";
import { Radio } from "antd";
import styled from "styled-components";

import AntdDrawer from "@/components/Drawer/AntdDrawer";
import { TabSmall } from "@/components/Tab/Tabs";

import { modelsType, orderModelType } from "@/data/type/sayang/models";
import { salesOrderDetailRType } from "@/data/type/sales/order";

import Close from "@/assets/svg/icons/s_close.svg";

import ModelList from "@/contents/base/model/ModelList";
import CardList from "@/components/List/CardList";

interface Props {
  order: salesOrderDetailRType;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  selectTabDrawer: number;
  setSelectTabDrawer: React.Dispatch<SetStateAction<number>>;
  products: orderModelType[];
  setProducts: React.Dispatch<SetStateAction<orderModelType[]>>;
  setNewFlag: React.Dispatch<SetStateAction<boolean>>;
  selectId: string | null;
  setSelectId: React.Dispatch<SetStateAction<string | null>>;
  partnerId: string;
}

const AddDrawer:React.FC<Props> = ({
  order,
  drawerOpen,
  setDrawerOpen,
  selectTabDrawer,
  setSelectTabDrawer,
  products,
  setProducts,
  setNewFlag,
  selectId,
  setSelectId,
  partnerId,
}) => {
  const [ drawerPrtItems, setDrawerPrtItems ] = useState<Array<any>>([]);
  const [ drawerMngItems, setDrawerMngItems ] = useState<Array<any>>([]);

  // 거래처 클릭 시 값이 변하고 Drawer 오픈
  useEffect(()=>{
    if(order?.prtInfo?.prt) {
      setDrawerPrtItems([
        { label: '거래처명', value: order.prtInfo?.prt?.prtNm ?? '-', widthType: 'full' },
        { label: '거래처 식별코드', value: order.prtInfo?.prt?.prtRegCd ?? '-', widthType: 'half' },
        { label: '거래처 축약명', value: order.prtInfo?.prt?.prtSnm ?? '-', widthType: 'half' },
        { label: '거래처 영문명', value: order.prtInfo?.prt?.prtEngNm ?? '-', widthType: 'half' },
        { label: '거래처 영문 축약명', value: order.prtInfo?.prt?.prtEngSnm ?? '-', widthType: 'half' },
        { label: '사업자등록번호', value: order.prtInfo?.prt?.prtRegNo ?? '-', widthType: 'half' },
        { label: '법인등록번호', value: order.prtInfo?.prt?.prtCorpRegNo ?? '-', widthType: 'half' },
        { label: '업태', value: order.prtInfo?.prt?.prtBizType ?? '-', widthType: 'half' },
        { label: '업종', value: order.prtInfo?.prt?.prtBizCate ?? '-', widthType: 'half' },
        { label: '주소', value: `${order.prtInfo?.prt?.prtAddr ?? ''} ${order.prtInfo?.prt?.prtAddrDtl ?? ''}`, widthType: 'full' },
        { label: '대표자명', value: order.prtInfo?.prt?.prtCeo ?? '-', widthType: 'half' },
        { label: '전화번호', value: order.prtInfo?.prt?.prtTel ?? '-', widthType: 'half' },
        { label: '팩스번호', value: order.prtInfo?.prt?.prtFax ?? '-', widthType: 'half' },
        { label: '이메일', value: order.prtInfo?.prt?.prtEmail ?? '-', widthType: 'half' },
      ]);
    } else {
      setDrawerPrtItems([]);
    }

    if(order.prtInfo?.mng) {
      setDrawerMngItems([
        { label: '담당자명', value: order.prtInfo?.mng?.prtMngNm ?? '-', widthType: 'full' },
        { label: '부서명', value: order.prtInfo?.mng?.prtMngDeptNm ?? '-', widthType: 'half' },
        { label: '팀명', value: order.prtInfo?.mng?.prtMngTeamNm ?? '-', widthType: 'half' },
        { label: '전화번호', value: order.prtInfo?.mng?.prtMngTel ?? '-', widthType: 'half' },
        { label: '휴대번호', value: order.prtInfo?.mng?.prtMngMobile ?? '-', widthType: 'half' },
        { label: '팩스번호', value: order.prtInfo?.mng?.prtMngFax ?? '-', widthType: 'half' },
        { label: '이메일', value: order.prtInfo?.mng?.prtMngEmail ?? '-', widthType: 'half' },
      ]);
    } else {
      setDrawerMngItems([]);
    }
  }, [order]);

  return (
    <>
      <AntdDrawer
        open={drawerOpen}
        width={643}
        close={()=>{setDrawerOpen(false)}}
      >
        <div className="w-full px-20 py-30 flex flex-col gap-20">
          <div className="flex w-full v-between-h-center">
            <TabSmall
              items={[
                {key:1,text:'고객 정보'},
                {key:2,text:'모델 목록'},
              ]}
              selectKey={selectTabDrawer}
              setSelectKey={setSelectTabDrawer}
            />
            <p className="cursor-pointer" onClick={()=>setDrawerOpen(false)}><Close/></p>
          </div>
          { selectTabDrawer === 1 ?
            <>
              <CardList title="고객정보" 
                items={drawerPrtItems}/>
              <CardList title="담당자정보" 
                items={drawerMngItems}/>
            </>
            :
            <ModelList
              type="match"
              products={products}
              setProductsMatch={setProducts}
              selectId={selectId ?? ""}
              setSelectId={setSelectId}
              setNewFlag={setNewFlag}
              setDrawerOpen={setDrawerOpen}
              partnerId={partnerId}
            />
          }
        </div>
      </AntdDrawer>
    </>
  )
}

const CustomRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper::before {
    display: none !important;
  }
`;

export default AddDrawer;