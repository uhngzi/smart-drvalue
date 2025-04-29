import { buyOrderDetailType, buyOrderType } from "./cost";

export const changeDataOrder = (
  entity: buyOrderType,
  order: buyOrderType | null,
  details: buyOrderDetailType[]
): buyOrderType => {
  return {
    ...order,
    ...entity,
    status: entity?.type,
    orderRoot: {
      orderId: order?.id,
      prtIdx: entity.detailInfo?.prtInfo?.prt?.id,
      prtMngIdx: entity.detailInfo?.prtInfo?.mng?.id,
      empIdx: entity.detailInfo?.emp?.id,
      orderName: entity?.detailInfo?.orderName,
      orderDueDt: entity.detailInfo?.orderDueDt,
      orderDt: entity.detailInfo?.orderDt,
      remarks: entity.detailInfo?.remarks,
      deliveryDueDt: entity.detailInfo?.deliveryDueDt,
      arrivalDt: entity.detailInfo?.arrivalDt,
      paymentCondition: entity.detailInfo?.paymentCondition,
      totalAmount: entity.detailInfo?.totalAmount,
      orderConfirmDt: entity.detailInfo?.orderConfirmDt,
      approvalDt: entity.detailInfo?.approvalDt,
      worksheetIdxNoForgKeyType: entity.detailInfo?.worksheetIdxNoForgKeyType,
      worksheetIdxNoForgKey: entity.detailInfo?.worksheetIdxNoForgKey,
      worksheetProcessIdxNoForgKey:
        entity.detailInfo?.worksheetProcessIdxNoForgKey,
    },
    orderDetail: details,
  };
};

export const changeDataOrderDetails = (
  entity: buyOrderType
): buyOrderDetailType[] => {
  return entity.detailInfo?.details?.map((item) => ({
    id: item.id,
    materialIdx: item.material?.id,
    order: item.order,
    mtOrderQty: item.mtOrderQty,
    mtOrderSizeW: item.mtOrderSizeW,
    mtOrderSizeH: item.mtOrderSizeH,
    mtOrderWeight: item.mtOrderWeight,
    mtOrderThk: item.mtOrderThk,
    mtOrderPrice: item.mtOrderPrice,
    mtOrderInputPrice: item.mtOrderInputPrice,
    mtOrderAmount: item.mtOrderAmount,
    mtOrderUnit: item.mtOrderUnit,
    mtOrderTxtur: item.mtOrderTxtur,
    mtOrderArrivalQty:
      !item.mtOrderArrivalQty || item.mtOrderArrivalQty < 1
        ? item.mtOrderQty
        : item.mtOrderArrivalQty,
    mtOrderArrivalDate: item.mtOrderArrivalDate,
    mtOrderInputDate: item.mtOrderInputDate,
    mtOrderInputQty: item.mtOrderInputQty,
    mtOrderInvenQty: item.mtOrderInvenQty,
    mtOrderBadQty: item.mtOrderBadQty,
    requestMaterialQuality: item.requestMaterialQuality ?? [],
    mtNm: item.mtNm,
    materialGrpIdx: item.material
      ? item?.material?.materialGroup?.id
      : "직접입력",
    mtPriceIdx: item?.materialPrice?.id,
  })) as buyOrderDetailType[];
};
