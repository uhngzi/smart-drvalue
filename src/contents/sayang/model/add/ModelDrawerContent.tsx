import { getAPI } from "@/api/get";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import FullChip from "@/components/Chip/FullChip";
import CardList from "@/components/List/CardList";
import { LabelIcon } from "@/components/Text/Label";

import { HotGrade } from "@/data/type/enum";
import { salesOrderDetailRType } from "@/data/type/sales/order";

import Call from "@/assets/svg/icons/s_call.svg";
import Mobile from "@/assets/svg/icons/mobile.svg";
import Mail from "@/assets/svg/icons/mail.svg";
import { Empty } from "antd";

interface Props {
  orderId: string | string[] | undefined;
}

const ModelDrawerContent: React.FC<Props> = ({
  orderId,
}) => {
  const [orderDataLoading, setOrderDataLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<salesOrderDetailRType | null>(null);
  const { data:orderQueryData, isLoading:orderQueryLoading, refetch:orderQueryRefetch } = useQuery({
    queryKey: ['sales-order/detail/jsxcrud/one', orderId],
    queryFn: async () =>{
      try {
        return getAPI({
          type: 'core-d1',
          utype: 'tenant/',
          url: `sales-order/detail/jsxcrud/one/${orderId}`,
        });
      } catch (e) {
        console.log('models/jsxcrud/many Error : ', e);
        return;
      }
    },
    enabled: !!orderId,
  });
  useEffect(()=>{
    setOrderDataLoading(true);
    if(!orderQueryLoading && orderQueryData?.resultCode === "OK_0000") {
      setOrderData(orderQueryData?.data?.data ?? null);
      setOrderDataLoading(false);
    }
  }, [orderQueryData]);

  return (
    <>{ !orderDataLoading &&
      <>
      <CardList
        items={[
          {label: '거래처명/거래처코드', value: orderData?.prtInfo?.prt?.prtNm+'/'+orderData?.prtInfo?.prt?.prtRegCd, widthType: 'half'},
          {label: '발주일', value: dayjs(orderData?.orderDt).format('YYYY-MM-DD'), widthType: 'half'},
          {
            label: '고객발주명', 
            value:<div className="w-full h-full h-center gap-5">
              { orderData?.hotGrade === HotGrade.SUPER_URGENT ? (
                <FullChip label="초긴급" state="purple"/>
              ) : orderData?.hotGrade === HotGrade.URGENT ? (
                <FullChip label="긴급" state="pink" />
              ) : (
                <FullChip label="일반" />
              )}
              {orderData?.orderNm}
            </div>,
            widthType: 'full'
          },
          {label: '발주내용', value: orderData?.orderTxt, widthType: 'full'},
        ]}
        title="" btnLabel="" btnClick={()=>{}}
      />
      <CardList items={[]} title="" btnLabel="" btnClick={()=>{}}>
        <div className="flex flex-col gap-10">
          <div className="w-full text-16 font-medium" >담당자 정보</div>
          <div className="w-full" style={{borderBottom:'1px solid #d9d9d9'}}/>
          { !orderData?.prtInfo?.mng && <Empty />}
          { orderData?.prtInfo?.mng && <>
            <p className="">{orderData?.prtInfo?.mng?.prtMngNm}</p>
            <div className="w-full h-40 h-center gap-10">
              <div className="w-[200px]">
                <LabelIcon label={orderData?.prtInfo?.mng?.prtMngTel ?? ''} icon={<Call />}/>
              </div>
              <div className="w-[200px]">
                <LabelIcon label={orderData?.prtInfo?.mng?.prtMngMobile ?? ''} icon={<Mobile />}/>
              </div>
              <div className="flex-1">
                <LabelIcon label={orderData?.prtInfo?.mng?.prtMngEmail ?? ''} icon={<Mail />}/>
              </div>
            </div>
          </>}
        </div>
      </CardList>
      <CardList items={[]} title="" btnLabel="" btnClick={()=>{}}>
        <div className="flex flex-col gap-10">
          <div className="w-full text-16 font-medium" >등록된 고객발주 모델</div>
          <div className="w-full" style={{borderBottom:'1px solid #d9d9d9'}}/>
          <table>
            <colgroup>
              <col style={{width:'auto'}}/>
              <col style={{width:'auto'}}/>
              <col style={{width:'17%'}}/>
              <col style={{width:'10%'}}/>
              <col style={{width:'20%'}}/>
            </colgroup>
            <thead>
              <tr>
                <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>발주 모델명</th>
                <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>관리번호</th>
                <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>납기일</th>
                <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>수량</th>
                <th className="font-normal pb-8" style={{borderBottom: '1px solid #0000000F'}}>수주금액</th>
              </tr>
            </thead>
            <tbody>
              {(orderData?.products ?? []).map((m, idx) => (
                <tr key={idx}>
                  <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.orderTit}</td>
                  <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.prtOrderNo}</td>
                  <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{m.orderPrdDueDt ? dayjs(m.orderPrdDueDt).format('YYYY-MM-DD') : null}</td>
                  <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{Number(m.orderPrdCnt).toLocaleString()}</td>
                  <td className="text-center py-8" style={{borderBottom: '1px solid #0000000F'}}>{Number(m.orderPrdPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardList>
    </>
    }</>
  )
}

export default ModelDrawerContent;